import { useMemo, useState, useCallback, useTransition } from "react";
import { useTranslation } from "react-i18next";
import { DataTable, ShowToast } from "@/components/hero-ui";
import Form from "./Form";
import View from "./View";
import { useFetch } from "@/hooks/useFetch";
import { useDisclosure } from "@/god-ui";
import { useMutation } from "@/hooks/useMutation";
import { useRenderCount } from "@/hooks/testing-render/useRenderCount";

const useViewDisclosure = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return {
    isOpenView: isOpen,
    onOpenView: onOpen,
    onCloseView: onClose,
  };
};

const Index = () => {
  useRenderCount("FacultyPage");
  const { t } = useTranslation();

  // ==== Disclosure ====
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpenView, onOpenView, onCloseView } = useViewDisclosure();

  // ==== UI State ====
  const [isEdit, setIsEdit] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [editRow, setEditRow] = useState<any>(null);
  const [viewRow, setViewRow] = useState<any>(null);

  // ==== Pagination ====
  const [pagination, setPagination] = useState(() => ({
    page: 1,
    limit: parseInt(import.meta.env.VITE_DEFAULT_PAGE_LIMIT) || 10,
  }));

  // ==== transition for smooth UI ====
  const [isPending, startTransition] = useTransition();

  // ==== Data fetching ====
  const { data, loading, refetch } = useFetch<{ rows: any[]; total_count: number }>(
    searchKeyword.trim() === "" ? "/faculty/list" : "/faculty/search",
    {
      params: {
        page: pagination.page,
        limit: pagination.limit,
        ...(searchKeyword.trim() && { keyword: searchKeyword }),
      },
      deps: [pagination.page, pagination.limit, searchKeyword],
    }
  );

  const rows = data?.data?.rows || [];
  const totalPage = Math.ceil((data?.data?.total || 0) / pagination.limit) || 1;

  // ==== Columns (memoized) ====
  const cols = useMemo(
    () => [
      { name: t("id"), uid: "id", sortable: true },
      { name: t("code"), uid: "code", sortable: true },
      { name: t("nameEn"), uid: "name_en", sortable: true },
      { name: t("nameKh"), uid: "name_kh" },
      { name: t("status"), uid: "status", sortable: true },
      { name: t("action"), uid: "actions" },
    ],
    [t]
  );

  const visibleCols = useMemo(
    () => ["id", "code", "name_en", "name_kh", "status", "actions"],[]
  );

  const status = useMemo(
    () => [
      { name: "Active", uid: "Active" },
      { name: "Inactive", uid: "Inactive" },
    ],[]
  );

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
  const { mutate: deleteFaculty } = useMutation({
    onSuccess: () => {
      refetch();
      ShowToast({ color: "success", title: t("success"), description: t("facultyDeleted") });
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

  const onEdit = useCallback(
    (row: any) => {
      setEditRow(row);
      setIsEdit(true);
      onOpen();
    },
    [onOpen]
  );

  const onView = useCallback(
    (row: any) => {
      setViewRow(row);
      setIsEdit(false);
      onOpenView();
    },
    [onOpenView]
  );

  const onDelete = useCallback(
    async (id: number) => {
      await deleteFaculty(`/faculty/${id}`, id, "DELETE");
    },
    [deleteFaculty]
  );

  // ==== Pagination Handler ====
  const onChangePage = useCallback((newPage: number) => {
    startTransition(() => {
      setPagination((prev) => ({ ...prev, page: newPage }));
    });
  }, []);

  // ==== Props for dialogs ====
  const formProps = useMemo(
    () => ({ isOpen, onClose, isEdit, row: editRow, loadList: refetch }),
    [isOpen, onClose, isEdit, editRow, refetch]
  );

  const viewProps = useMemo(
    () => ({ isOpen: isOpenView, onClose: onCloseView, row: viewRow }),
    [isOpenView, onCloseView, viewRow]
  );

  // ==== Render ====
  return (
    <div className="relative p-4">
      <Form {...formProps} />
      <View {...viewProps} />

      <DataTable
        key="faculty-table"
        loading={loading}
        isPending={isPending}
        dataApi={rows}
        cols={cols}
        visibleCols={visibleCols}
        onCreate={onCreate}
        onEdit={onEdit}
        onView={onView}
        onDelete={onDelete}
        loadData={refetch}
        selectRow={false}
        permissionCreate="create:faculty"
        permissionDelete="delete:faculty"
        permissionEdit="update:faculty"
        permissionView="view:faculty"
        searchKeyword={searchKeyword}
        onSearchInputChange={onSearchInputChange}
        handleClearSearch={handleClearSearch}
        handleSearch={refetch}
        initialPage={pagination.page}
        totalPages={totalPage}
        page={pagination.page}
        onChangePage={onChangePage}
        status={status}
      />
    </div>
  );
};

export default Index;
