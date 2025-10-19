import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { DataTable, ShowToast } from "@/components/hero-ui";
import Form from "./Form";
import { useFetch } from "@/hooks/useFetch";
import { useDisclosure } from "@/god-ui";
import { useMutation } from "@/hooks/useMutation";


const Index = () => {
  const { t } = useTranslation();
  // ==== State Modal Management ====
  const { isOpen, onOpen, onClose } = useDisclosure();

  // ==== State Management ====
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [editRow, setEditRow] = useState<any>(null);

  // ==== Pagination State ====
  const [pagination, setPagination] = useState({
    page: 1,
    limit: parseInt(import.meta.env.VITE_DEFAULT_PAGE_LIMIT) || 10,
  });

  // ==== Fetch Data with useFetch ====
  const { data, loading, refetch } = useFetch<{ rows: any[]; total_count: number }>(
    searchKeyword.trim() === "" ? "/schedule/list" : "/schedule/search", 
    {
      params: {
        page: pagination.page,
        limit: pagination.limit,
        ...(searchKeyword.trim() !== "" && { keyword: searchKeyword }), 
      },
      deps: [pagination.page, pagination.limit, searchKeyword], 
    }
  );
  
  useEffect(() => {
    console.log("Fetched data:", data);
  }, [data]);
  
  // ==== Table Data & Total Pages ====
  const dataRows = data?.data?.rows;
  const rows = dataRows || [];
  const totalPage = Math.ceil((data?.data?.total || 0) / pagination.limit) || 1;

  // ==== Columns Definitions ====
  const cols = useMemo(
    () => [
      { name: t("id"), uid: "id", sortable: true },
      { name: t("class"), uid: "class_name", sortable: true },
      { name: t("room"), uid: "room_name" },
      { name: t("facultyNameEn"), uid: "faculty_name_en", sortable: true },
      { name: t("fieldNameEn"), uid: "field_name_en", sortable: true },
      { name: t("programType"), uid: "program_type" },
      { name: t("promotion"), uid: "promotion_no" },
      { name: t("term"), uid: "term_relative" },
      { name: t("year"), uid: "study_year", sortable: true },
      { name: t("startDate"), uid: "start_date" },
      { name: t("endDate"), uid: "end_date" },
      { name: t("totalStudent"), uid: "total_students" },
      { name: t("status"), uid: "class_status", sortable: true },
      { name: t("action"), uid: "actions" },
    ],
    [t],
  );

  
  const visibleCols = [
    "class_name", 
    "room_name", 
    "faculty_name_en", 
    "field_name_en", 
    "program_type", 
    "term_relative", 
    "study_year", 
    "total_students", 
    "class_status", 
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

  const { mutate: deleteCourse } = useMutation();

  const onCreate = () => {
    setIsEdit(false);
    onOpen();
  };

  const onEdit = (row: object) => {
    setEditRow(row);
    onOpen();
    setIsEdit(true);
  };

  const onDelete = async (id: number) => {
    try {

      await deleteCourse(`/course/${id}`, id, "DELETE");
      await refetch();
      ShowToast({ color: "success", title: "Success", description: "Course deleted successfully" });

    } catch (error) {

      console.error(error);
      ShowToast({ color: "error", title: "Error", description: "Failed to delete course" });

    }
  };

  const formProps = {
    isOpen,
    onClose,
    isEdit,
    row: editRow,
    loadList: refetch,
  };

  return (
    <div className="p-4">
      <Form {...formProps} />

      <DataTable
        loading={loading}
        dataApi={rows}
        cols={cols}
        visibleCols={visibleCols}
        onCreate={onCreate}
        onEdit={onEdit}
        onDelete={(id: number) => onDelete(id)}
        loadData={refetch} 
        selectRow={false}
        permissionCreate="create:course"
        permissionDelete="delete:course"
        permissionEdit="update:course"
        permissionView="view:course"
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
