import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { DataTable, ShowToast } from "@/components/hero-ui";
import Form from "./Form";
import View from "./View";
import { useFetch } from "@/hooks/useFetch";
import { useDisclosure } from "@/god-ui";
import { useMutation } from "@/hooks/useMutation";

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
    searchKeyword.trim() === "" ? "/class/list" : "/class/search", 
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
      { name: t("className"), uid: "class_name" },
      { name: t("roomName"), uid: "room_name" },
      { name: t("facultyCode"), uid: "faculty_code", sortable: true },
      { name: t("facultyNameEn"), uid: "faculty_name_en", sortable: true },
      { name: t("facultyNameKh"), uid: "faculty_name_kh" },
      { name: t("fieldCode"), uid: "field_code", sortable: true },
      { name: t("fieldNameEn"), uid: "field_name_en", sortable: true },
      { name: t("fieldNameKh"), uid: "field_name_kh" },
      { name: t("promotionNo"), uid: "promotion_no" },
      { name: t("termNo"), uid: "term_no" },
      { name: t("status"), uid: "status", sortable: true },
      { name: t("action"), uid: "actions" },
    ],
    [t],
  );

  const visibleCols = [ "faculty_code", "faculty_name_en", "faculty_name_kh", "field_code", "field_name_en", "field_name_kh", "promotion_no", "term_no", "class_name", "room_name", "status", "actions"];

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

  const { mutate: deleteClass } = useMutation();
  
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

      await deleteClass(`/class/${id}`, id, "DELETE");
      await refetch();
      ShowToast({ color: "success", title: "Success", description: "Class deleted successfully" });

    } catch (error) {

      console.error(error);
      ShowToast({ color: "error", title: "Error", description: "Failed to delete class" });

    }
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
        onDelete={(id: number) => onDelete(id)}
        loadData={refetch} 
        selectRow={false}
        permissionCreate="create:class"
        permissionDelete="delete:class"
        permissionEdit="update:class"
        permissionView="view:class"
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
        status={status}
      />
    </div>
  );
};

export default Index;
