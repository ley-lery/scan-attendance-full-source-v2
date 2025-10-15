import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { DataTable, ShowToast } from "@/components/hero-ui";
import View from "./View";
import { useFetch } from "@/hooks/useFetch";
import { useDisclosure } from "@/god-ui";
import { useMutation } from "@/hooks/useMutation";
import Permission from "./Permission";

// Custom hook for separate view dialog
const useViewClosure = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return {
    isOpenView: isOpen,
    onOpenView: onOpen,
    onCloseView: onClose,
  };
};

const usePermissionClosure = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return {
    isOpenPermission: isOpen,
    onOpenPermission: onOpen,
    onClosePermission: onClose,
  };
};

const Index = () => {
  const { t } = useTranslation();
  // ==== State Modal Management ====
  const { isOpenView, onOpenView, onCloseView } = useViewClosure();
  const { isOpenPermission, onOpenPermission, onClosePermission } = usePermissionClosure();

  // ==== State Management ====
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [viewRow, setViewRow] = useState<any>(null);
  const [roleId, setRoleId] = useState<number | null>(null);

  // ==== Pagination State ====
  const [pagination, setPagination] = useState({
    page: 1,
    limit: parseInt(import.meta.env.VITE_DEFAULT_PAGE_LIMIT) || 10,
  });

  // ==== Fetch Data with useFetch ====
  const { data, loading, refetch } = useFetch<{ rows: any[]; total_count: number }>(
    searchKeyword.trim() === "" ? "/role/list" : "/role/search", 
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
      { name: t("role"), uid: "name", sortable: true },
      { name: t("description"), uid: "description", sortable: true },
      { name: t("action"), uid: "actions" },
    ],
    [t],
  );

  const visibleCols = ["name", "description", "actions"];

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
  const { mutate: deletePermission } = useMutation();

  const onView = (row: object) => {
    setViewRow(row);
    onOpenView();
  };

  const onDelete = async (id: number) => {
    try {

      await deletePermission(`/userpermission/${id}`, id, "DELETE");
      await refetch();
      ShowToast({ color: "success", title: "Success", description: "Permission deleted successfully" });

    } catch (error) {

      console.error(error);
      ShowToast({ color: "error", title: "Error", description: "Failed to delete permission" });

    }
  };

  const onPermission = (id: number) => {
    onOpenPermission();
    setRoleId(id);
  };

  const viewProps = {
    isOpen: isOpenView,
    onClose: onCloseView,
    row: viewRow,
  };

 
  return (
    <div className="p-4">

      <View {...viewProps} />
      <Permission isOpen={isOpenPermission} onClose={onClosePermission} roleId={roleId}/>

      <DataTable
        loading={loading}
        dataApi={rows}
        cols={cols}
        visibleCols={visibleCols}
        onView={onView}
        onDelete={(id: number) => onDelete(id)}
        onPermission={(id: number) => onPermission(id)}
        loadData={refetch}
        selectRow={false}
        permissionCreate="create:rolepermission"
        permissionDelete="delete:rolepermission"
        permissionEdit="update:rolepermission"
        permissionView="view:rolepermission"
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
