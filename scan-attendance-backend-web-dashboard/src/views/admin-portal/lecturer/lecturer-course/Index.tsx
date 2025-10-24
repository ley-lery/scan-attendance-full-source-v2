import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { DataTable, ShowToast } from "@/components/hero-ui";
import Form from "./Form";
import View from "./View";
import { useFetch } from "@/hooks/useFetch";
import { useDisclosure } from "@/god-ui";
import { useMutation } from "@/hooks/useMutation";
import { useDebounce } from "@/hooks/useDebounce";

// Custom hook modal
const useViewClosure = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return {
    isOpenView: isOpen,
    onOpenView: onOpen,
    onCloseView: onClose,
  };
};

const Index = () => {
  
  const { t } = useTranslation();

  // ==== State Modal Management ====
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpenView, onOpenView, onCloseView } = useViewClosure();

  // ==== State Management ====
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const debouncedSearchKeyword = useDebounce(searchKeyword, 500);
  const [editRow, setEditRow] = useState<any>(null);
  const [viewRow, setViewRow] = useState<any>(null);

  // ==== Pagination State ====
  const [pagination, setPagination] = useState({
    page: 1,
    limit: parseInt(import.meta.env.VITE_DEFAULT_PAGE_LIMIT) || 10,
  });

  // ================= Start Data Fetching Block =================

  const { data, loading, refetch } = useFetch<{ rows: any[]; total_count: number }>(
    debouncedSearchKeyword.trim() === "" ? "/lecturercourse/list" : "/lecturercourse/search", 
    {
      params: {
        page: pagination.page,
        limit: pagination.limit,
        ...(debouncedSearchKeyword.trim() !== "" && { keyword: debouncedSearchKeyword }), 
      },
      deps: [pagination.page, pagination.limit, debouncedSearchKeyword],
    }
  );
  
  useEffect(() => {
    console.log("Fetched data:", data?.data);
  }, [data]);
  
  // ==== Table Data & Total Pages ====
  const dataRows = data?.data?.rows;
  const rows = dataRows || [];
  const totalPage = Math.ceil((data?.data?.total || 0) / pagination.limit) || 1;

  // ================= End Data Fetching Block =================



  // ================= Start Table Configuration Block =================

  const cols = useMemo(
    () => [
      { name: t("id"), uid: "id", sortable: true },
      { name: t("lecturerCode"), uid: "lecturer_code", sortable: true },
      { name: t("lecturerNameEn"), uid: "lecturer_name_en", sortable: true },
      { name: t("lecturerNameKh"), uid: "lecturer_name_kh" },
      { name: t("courseCode"), uid: "course_code", sortable: true },
      { name: t("courseNameEn"), uid: "course_name_en", sortable: true },
      { name: t("courseNameKh"), uid: "course_name_kh" },
      { name: t("action"), uid: "actions" },
    ],
    [t],
  );

  const visibleCols = [
    "lecturer_code",
    "lecturer_name_en",
    "lecturer_name_kh",
    "course_code",
    "course_name_en",
    "course_name_kh",
    "actions"
  ];


  // ================= End Table Configuration Block =================


  // ================= Start Event Handlers Block =================

  const { mutate: deleteLecturerCourse } = useMutation();

  const onSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleClearSearch = () => {
    setSearchKeyword("");
    setPagination((prev) => ({ ...prev, page: 1 }));
  };


  const onCreate = () => {
    setIsEdit(false);
    onOpen();
  };

  const onEdit = (row: object) => {
    setEditRow(row);
    onOpen();
    setIsEdit(true);
  };

  const onView = (row: object) => {
    setViewRow(row);
    setIsEdit(false);
    onOpenView();
  };

  const onDelete = async (id: number) => {
    try {

      await deleteLecturerCourse(`/lecturercourse/${id}`, id, "DELETE");
      await refetch();
      ShowToast({ color: "success", title: "Success", description: "Lecturer course deleted successfully" });

    } catch (error) {

      console.error(error);
      ShowToast({ color: "error", title: "Error", description: "Failed to delete lecturer course" });

    }
  };

  // ================= End Event Handlers Block =================


  return (
    <div className="p-4">
      <Form isOpen={isOpen} onClose={onClose} isEdit={isEdit} row={editRow} loadList={refetch} />
      <View isOpen={isOpenView} onClose={onCloseView} row={viewRow} />

      <DataTable
        loading={loading}
        dataApi={rows}
        cols={cols}
        visibleCols={visibleCols}
        onCreate={onCreate}
        onEdit={onEdit}
        onView={onView}
        onDelete={(id: number) => onDelete(id)}
        loadData={refetch}
        selectRow={false}
        permissionCreate="create:lecturercourse"
        permissionDelete="delete:lecturercourse"
        permissionEdit="update:lecturercourse"
        permissionView="view:lecturercourse"
        searchKeyword={searchKeyword}
        onSearchInputChange={onSearchInputChange}
        handleClearSearch={handleClearSearch}
        handleSearch={refetch}
        initialPage={pagination.page}
        totalPages={totalPage}
        page={pagination.page}
        onChangePage={(newPage: number) =>
          setPagination((prev) => ({ ...prev, page: newPage }))
        }
      />
    </div>
  );
};

export default Index;