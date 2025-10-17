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
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  // ==== Pagination State ====
  const [pagination, setPagination] = useState({
    page: 1,
    limit: parseInt(import.meta.env.VITE_DEFAULT_PAGE_LIMIT) || 10,
  });

  // ==== Fetch Data with useFetch ====
  const { data: dataList, loading: loadingList, refetch: refetchList } = useFetch<{ rows: any[]; total_count: number }>(
    searchKeyword.trim() === "" ? "/lecturer/leavereq/list" : "/lecturer/leavereq/search", 
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
    { name: "Pending", uid: "Pending" },
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
    cancelLeave(`/lecturer/leavereq/cancel`, { id }, "POST");
  };
 
  const reloadList = () => {
    refetchList();
  };



  return (
    <div className="p-4 space-y-4">
      <Form isOpen={isOpen} onClose={onClose} loadList={reloadList} />

      <DataTable
        loading={loadingList}
        dataApi={rows}
        cols={cols}
        visibleCols={visibleCols}
        onReqLeave={onReqLeave}
        onCancelLeave={onCancelLeave}
        loadData={refetchList} 
        loadingButton={canceling}
        selectRow={false}
        permissionRequest="request:lecturerleave"
        permissionCancel="cancel:lecturerleave"
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
