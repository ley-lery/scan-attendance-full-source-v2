import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { DataTable, ShowToast } from "@/components/hero-ui";
import Form from "./Form";
import { useFetch } from "@/hooks/useFetch";
import { useDisclosure } from "@/god-ui";
import { useMutation } from "@/hooks/useMutation";
import CardUi from "@/components/hero-ui/card/CardUi";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { PiWarningCircle } from "react-icons/pi";
import { SlClose } from "react-icons/sl";
import { FaRegCircle } from "react-icons/fa";



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
  const { data: states, loading: loadingStates, refetch: refetchStates } = useFetch<any>(
    "/student/leave/state"
  );

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
      { name: t("startDate"), uid: "start_date" },
      { name: t("endDate"), uid: "end_date" },
      { name: t("status"), uid: "status", sortable: true },
      { name: t("action"), uid: "actions" },
    ],
    [t],
  );

  const visibleCols = [ "reason", "start_date", "end_date", "status", "actions"];

  const status = [
    { name: "Approved", uid: "Approved" },
    { name: "Pending", uid: "Pending" },
    { name: "Rejected", uid: "Rejected" },
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
        description: "Leave request cancelled successfully",
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
    cancelLeave("student/leave/cancel", { id }, "PUT");
  };

  
 
  const reloadList = () => {
    refetchList();
    refetchStates();
  };


  return (
    <div className="p-4 space-y-4">
      <Form isOpen={isOpen} onOpenChange={onClose} loadList={reloadList} />

     {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <CardUi
            title={t("approved")}
            number={loadingStates ? 0 : states.data.row[0].approved_requests}
            subtitle={t("times")}
            icon={<IoIosCheckmarkCircleOutline size={25} />}
            color="text-green-500"
          />
          <CardUi
            title={t("pending")}
            number={loadingStates ? 0 : states.data.row[0].pending_requests}
            subtitle={t("times")}
            icon={<PiWarningCircle size={25} />}
            color="text-yellow-500"
          />
          <CardUi
            title={t("rejected")}
            number={loadingStates ? 0 : states.data.row[0].rejected_requests}
            subtitle={t("times")}
            icon={<SlClose size={22} />}
            color="text-pink-500"
          />
          <CardUi
            title={t("total")}
            number={loadingStates ? 0 : states.data.row[0].total_requests}
            subtitle={t("times")}
            icon={<FaRegCircle size={22} />}
            color="text-blue-500"
          />
        </div>
      <DataTable
        loading={loadingList}
        dataApi={rows}
        cols={cols}
        visibleCols={visibleCols}
        onReqLeave={onReqLeave}
        onCancelLeave={onCancelLeave}
        loadData={refetchList} 
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
