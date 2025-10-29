import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { DataTable, ShowToast } from "@/components/hero-ui";
import Form from "./Form";
import { useFetch } from "@/hooks/useFetch";
import { useDisclosure } from "@/god-ui";
import { useMutation } from "@/hooks/useMutation";
import { cn } from "@/lib/utils";



const Index = () => {
  const { t } = useTranslation();
  // ==== State Modal Management ====
  const { isOpen, onOpen, onClose } = useDisclosure();

  // ==== State Management ====
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  // ==== Pagination State ====
  const [pagination, setPagination] = useState({
    page: 1,
    limit: parseInt(import.meta.env.VITE_DEFAULT_PAGE_LIMIT) || 10,
  });

  // ==== Fetch Data with useFetch ====
  const { data: dataList, loading: loadingList, refetch: refetchList } = useFetch<{ rows: any[]; total_count: number }>(
    searchKeyword.trim() === "" ? "/student/leave/list" : "/student/leave/search", 
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
    console.log("Fetched data:", dataList);
  }, [dataList]);
  
  // ==== Table Data & Total Pages ====
  const dataRows = dataList?.data?.rows;
  const rows = dataRows || [];
  const totalPage = Math.ceil((dataList?.data?.total || 0) / pagination.limit) || 1;

  // ==== Columns Definitions ====
  const cols = useMemo(
    () => [
      { name: t("id"), uid: "id", sortable: true },
      { name: t("reason"), uid: "reason" },
      { name: t("requestDate"), uid: "request_date" },
      { name: t("startDate"), uid: "start_date" },
      { name: t("endDate"), uid: "end_date" },
      { name: t("status"), uid: "status", sortable: true },
      { name: t("action"), uid: "actions" },
    ],
    [t],
  );

  const visibleCols = [ "reason", "request_date", "start_date", "end_date", "status", "actions"];

  const status = [
    { name: "Approved", uid: "Approved" },
    { name: "Pending", uid: "Pending" },
    { name: "Rejected", uid: "Rejected" },
    { name: "Cancelled", uid: "Cancelled" },
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

  const { mutate: cancelLeave, loading: canceling } = useMutation({
    onSuccess: (response) => {
      ShowToast({
        color: "success",
        title: "Success",
        description: response.message || "Leave request cancelled successfully",
      });
      reloadList();
    },
    onError: (err) => {
      ShowToast({
        color: "error",
        title: "Error",
        description: err.message || "Failed to cancel leave request",
      });
    },
  });
  
  const onReqLeave = () => {
    onOpen();
  };


  const onCancelLeave = async (id: number) => {
    cancelLeave(`student/leave/cancel`, { id }, "POST");
  };
 
  const reloadList = () => {
    refetchList();
  };

  // Customize cols
   const customizeCols = useCallback((data: any, key: string) => {
      const value = data[key];
      return (
        <span
          className={cn(
            "flex items-center gap-2",
            "px-3 py-1 bg-black/10 dark:bg-white/10 text-xs rounded-full w-fit font-medium inline-flex items-center gap-2",
          )}
        >
          {value || "N/A"}
        </span>
      );
    }, []);
    const colsKeys = useMemo(
      () => [
        { key: "reason", value: (data: any) => customizeCols(data, "reason") },
      ],
      [customizeCols]
    );



  return (
    <div className="p-4 space-y-4">
      <Form isOpen={isOpen} onClose={onClose} loadList={reloadList} />

      <DataTable
        loading={loadingList}
        dataApi={rows}
        cols={cols}
        visibleCols={visibleCols}
        colKeys={colsKeys}
        onReqLeave={onReqLeave}
        onCancelLeave={onCancelLeave}
        loadData={refetchList} 
        loadingButton={canceling}
        selectRow={false}
        permissionRequest="request:studentleave"
        permissionCancel="cancel:studentleave"
        searchKeyword={searchKeyword}
        onSearchInputChange={onSearchInputChange}
        handleClearSearch={handleClearSearch}
        handleSearch={refetchList} 
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
