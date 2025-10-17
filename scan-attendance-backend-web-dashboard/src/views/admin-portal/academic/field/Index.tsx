import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
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

  // ==== transition for smooth UI ====
  const [isPending, startTransition] = useTransition();

  // ==== Pagination State ====
  const [pagination, setPagination] = useState({
    page: 1,
    limit: parseInt(import.meta.env.VITE_DEFAULT_PAGE_LIMIT) || 10,
  });

  // ==== Fetch Data with useFetch ====
  const { data, loading, refetch } = useFetch<{ rows: any[]; total_count: number }>(
    searchKeyword.trim() === "" ? "/field/list" : "/field/search", 
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
      { name: t("facultyCode"), uid: "faculty_code", sortable: true },
      { name: t("facultyNameEn"), uid: "faculty_name_en", sortable: true },
      { name: t("facultyNameKh"), uid: "faculty_name_kh" },
      { name: t("fieldCode"), uid: "field_code", sortable: true },
      { name: t("fieldNameEn"), uid: "field_name_en", sortable: true },
      { name: t("fieldNameKh"), uid: "field_name_kh" },
      { name: t("status"), uid: "status", sortable: true },
      { name: t("action"), uid: "actions" },
    ],
    [t],
  );

  const visibleCols = [ "faculty_code", "faculty_name_en", "faculty_name_kh", "field_code", "field_name_en", "field_name_kh", "status", "actions"];

  const status = [
    { name: "Active", uid: "Active" },
    { name: "Inactive", uid: "Inactive" },
  ];

  
  // ==== Search Handler (stable with useCallback) ====
  const onSearchInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    startTransition(() => {
      setSearchKeyword(value);
      setPagination((prev) => ({ ...prev, page: 1 }));
    });
  }, []);

  const handleClearSearch = useCallback(() => {
    startTransition(() => {
      setSearchKeyword("");
      setPagination((prev) => ({ ...prev, page: 1 }));
    });
  }, []);

  // ==== CRUD Actions (stable) ====
  const { mutate: deleteField } = useMutation({
    onSuccess: () => {
      refetch();
      ShowToast({ color: "success", title: t("success"), description: t("fieldDeleted") });
    },
    onError: (err) => {
      ShowToast({
        color: "error",
        title: t("error"),
        description: err.message || t("failedToDelete"),
      });
    },
  });
  
  const onCreate = useCallback(() => {
    setIsEdit(false);
    onOpen();
  }, [onOpen]);

  const onEdit = useCallback((row: object) => {
    setEditRow(row);
    onOpen();
    setIsEdit(true);
  }, [onOpen]);

  const onDelete = useCallback(async (id: number) => {
    await deleteField(`/field/${id}`, id, "DELETE");
  }, [deleteField]);

  const onView = useCallback((row: object) => {
    setViewRow(row);
    setIsEdit(false);
    onOpenView();
  }, [onOpenView]);

  const formProps = useMemo(() => {
    return { isOpen, onClose, isEdit, row: editRow, loadList: refetch };
  }, [isOpen, onClose, isEdit, editRow, refetch]);

  const viewProps = useMemo(() => {
    return { isOpen: isOpenView, onClose: onCloseView, row: viewRow };
  }, [isOpenView, onCloseView, viewRow]);

  return (
    <div className="p-4">
      <Form {...formProps} />
      <View {...viewProps} />

      <DataTable
        dataApi={rows}
        cols={cols}
        loading={loading}
        isPending={isPending}
        visibleCols={visibleCols}
        onCreate={onCreate}
        onEdit={onEdit}
        onView={onView}
        onDelete={(id: number) => onDelete(id)}
        loadData={refetch}
        selectRow={false}
        permissionCreate="create:field"
        permissionDelete="delete:field"
        permissionEdit="update:field"
        permissionView="view:field"
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
