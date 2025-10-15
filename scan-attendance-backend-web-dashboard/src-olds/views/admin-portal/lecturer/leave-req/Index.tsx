import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { DataTable } from "@/components/hero-ui";
import Form from "./Form";
import View from "./View";
import { useFetch } from "@/hooks/useFetch";
import { useDisclosure } from "@/god-ui";

// Custom hook for separate view dialog
const useViewClosure = () => {
  const { isOpen, onOpen, onClose, ...rest } = useDisclosure();
  return {
    isOpenView: isOpen,
    onOpenView: onOpen,
    onCloseView: onClose,
    ...rest,
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
  const [editRow, setEditRow] = useState<any>(null);
  const [viewRow, setViewRow] = useState<any>(null);

  // ==== Pagination State ====
  const [pagination, setPagination] = useState({
    page: 1,
    limit: parseInt(import.meta.env.VITE_DEFAULT_PAGE_LIMIT) || 10,
  });

  // ==== Fetch Data with useFetch ====
  const { data, loading, refetch } = useFetch<{ rows: any[]; total_count: number }>(
    searchKeyword.trim() === "" ? "/lecturercourse/list" : "/lecturercourse/search", 
    {
      params: {
        page: pagination.page,
        limit: pagination.limit,
        ...(searchKeyword.trim() !== "" && { keyword: searchKeyword }), // add keyword only for search
      },
      deps: [pagination.page, pagination.limit, searchKeyword], // trigger when keyword changes
    }
  );
  
  useEffect(() => {
    console.log("Fetched data:", data?.data);
  }, [data]);
  
  // ==== Table Data & Total Pages ====
  const dataRows = data?.data?.rows;
  const rows = dataRows || [];
  const totalPage = Math.ceil((data?.data?.total || 0) / pagination.limit) || 1;

  // ==== Columns Definitions ====
  const cols = useMemo(
    () => [
      { name: t("id"), uid: "id", sortable: true },
      { name: t("lecturerCode"), uid: "lecturer_code", sortable: true },
      { name: t("lecturerNameEn"), uid: "lecturer_name_en", sortable: true },
      { name: t("lecturerNameKh"), uid: "lecturer_name_kh" },
      { name: t("courseCode"), uid: "course_code", sortable: true },
      { name: t("courseNameEn"), uid: "course_name_en", sortable: true },
      { name: t("courseNameKh"), uid: "course_name_kh" },
      { name: t("status"), uid: "status", sortable: true },
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

  const status = [
    { name: "Active", uid: "Active" },
    { name: "Inactive", uid: "Inactive" },
  ];

  // ==== Search Input Handlers ====
  const onSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleClearSearch = () => {
    setSearchKeyword("");
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // ==== Handle Create/Edit/View/Delete ====
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

  const formProps = {
    isOpen,
    onClose,
    isEdit,
    row: editRow,
    loadList: refetch, // call refetch after CRUD
  };
  const viewProps = {
    isOpen: isOpenView,
    onClose: onCloseView,
    row: viewRow,
  };

  return (
    <div className="p-4">
      <Form {...formProps} />
      <View {...viewProps} />

      <DataTable
        loading={loading}
        dataApi={rows}
        cols={cols}
        visibleCols={visibleCols}
        onCreate={onCreate}
        onEdit={onEdit}
        onView={onView}
        loadData={refetch} // 👈 refetch
        selectRow={false}
        permissionCreate="studentCreate"
        permissionDelete="studentDelete"
        permissionEdit="studentModify"
        permissionView="studentView"
        searchKeyword={searchKeyword}
        onSearchInputChange={onSearchInputChange}
        handleClearSearch={handleClearSearch}
        handleSearch={refetch} // 👈 refetch triggers search
        initialPage={pagination.page}
        totalPages={totalPage}
        page={pagination.page}
        onChangePage={(newPage: number) =>
          setPagination((prev) => ({ ...prev, page: newPage }))
        }
        status={status}
      />
    </div>
  );
};

export default Index;
