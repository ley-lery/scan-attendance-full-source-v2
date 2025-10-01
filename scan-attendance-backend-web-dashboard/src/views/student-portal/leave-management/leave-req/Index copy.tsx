/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  useDisclosure,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  Pagination,
} from "@heroui/react";
import { IoAddCircleOutline } from "react-icons/io5";
import Form from "./Form";
import { useEffect, useState } from "react";
import { IoIosCheckmarkCircleOutline, IoIosClose } from "react-icons/io";
import { PiWarningCircle } from "react-icons/pi";
import { SlClose } from "react-icons/sl";
import { FaRegCircle } from "react-icons/fa";
import CardUi from "@/components/hero-ui/card/CardUi";
import { useTranslation } from "react-i18next";
import { GoDotFill } from "react-icons/go";
import { FiChevronDown } from "react-icons/fi";
import PopupUi from "@/components/ui/dialog/Popup";
import moment from "moment";
import ShowToast from "@/components/hero-ui/toast/ShowToast";
import LoadingUi from "@/components/hero-ui/loading/Loading";
import { DropdownItem, Dropdown, DropdownTrigger, DropdownMenu } from "@/components/hero-ui";
import { useFetch } from "@/hooks/useFetch";

interface DataApi {
  id: number;
  subject: string;
  reason: string;
  start_date: string;
  end_date: string;
  submitted_on: string;
  status: string;
}

const Index = () => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [searchKeyword, setSearchKeyword] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: parseInt(import.meta.env.VITE_DEFAULT_PAGE_LIMIT) || 10,
  });
  const [totalPage, setTotalPage] = useState(1);

  const [status, setStatus] = useState(new Set(["Pending", "Approved", "Rejected"]));

  const [isOpenConfirm, setIsOpenConfirm] = useState(false);
  const [cancelId, setCancelId] = useState<number | null>(null);

  // leave states (approved, pending, rejected)
  const { data: states, loading: loadingStates, refetch: refetchStates } = useFetch<any>(
    "/student/leave/state"
  );

  const endpoint = searchKeyword.trim() === "" ? "/student/leave/list" : "/student/leave/search";

  const { data: dataList, loading: loadingList, refetch: refetchList } = useFetch<{ rows: any[]; total_count: number }>(endpoint, {
    params: {
      offset: pagination.page,
      limit: pagination.limit,
      ...(searchKeyword.trim() !== "" && { keyword: searchKeyword }),
    },
    deps: [pagination.page, pagination.limit, searchKeyword],
  });

  // update pagination total when data changes
  useEffect(() => {
    console.log(dataList, "dataList");
    if (dataList?.data?.total) {
      setTotalPage(Math.ceil(dataList.data.total / pagination.limit));
    }
  }, [dataList, pagination.limit]);

  const reloadList = () => {
    refetchList();
    refetchStates();
  };

  const onCancel = async () => {
    if (!cancelId) return;
    try {
      // call cancel API
      await fetch(`/student/leave/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: cancelId }),
      });

      ShowToast({
        color: "success",
        title: t("success"),
        description: t("leaveRequestRejected"),
      });
      setIsOpenConfirm(false);
      setCancelId(null);
      reloadList();
    } catch (err) {
      ShowToast({
        color: "danger",
        title: t("error"),
        description: t("cancelLeaveFailed"),
      });
    }
  };

  return (
    <>
      <Form isOpen={isOpen} onOpenChange={onOpenChange} loadList={reloadList} />
      <div className="p-4 space-y-4 h-full">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Leave Requests</h1>
            <p className="text-zinc-500 dark:text-zinc-400">
              Here you can view and manage your leave requests.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button
                  className="capitalize btn-small-ui"
                  variant="solid"
                  endContent={<FiChevronDown />}
                >
                  {t("status")}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Status filter"
                selectedKeys={status}
                variant="flat"
                selectionMode="multiple"
                onSelectionChange={(keys) => setStatus(keys as Set<string>)}
                closeOnSelect={false}
              >
                <DropdownItem key="Pending">{t("pending")}</DropdownItem>
                <DropdownItem key="Approved">{t("approved")}</DropdownItem>
                <DropdownItem key="Rejected">{t("rejected")}</DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <Button
              onPress={onOpen}
              startContent={<IoAddCircleOutline size={18} />}
              color="primary"
              className="btn-small-ui"
            >
              {t("requestLeave")}
            </Button>
          </div>
        </div>

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

        {/* Table */}
        <div className="bg-zinc-50 border-white border dark:border-transparent dark:bg-zinc-800/50 rounded-2xl h-[66vh] 3xl:h-[73vh] flex flex-col justify-between pb-4 pl-4">
          <Table
            aria-label="Leave requests"
            className="w-full"
            shadow="none"
            removeWrapper
            classNames={{
              wrapper: "overflow-x-auto ",
              table: "min-w-full rounded-2xl ",
              thead: "bg-transparent ",
              th: "text-left text-sm font-semibold text-zinc-700 dark:text-zinc-300 bg-transparent border-b border-zinc-100 dark:border-zinc-700 px-4 py-4",
              td: "px-4",
            }}
          >
            <TableHeader>
              <TableColumn>Reason</TableColumn>
              <TableColumn>Start Date</TableColumn>
              <TableColumn>End Date</TableColumn>
              <TableColumn>Status</TableColumn>
              <TableColumn>Actions</TableColumn>
            </TableHeader>
            <TableBody
              emptyContent={<p>{loadingList ? <LoadingUi /> : t("noData")}</p>}
            >
              {dataList?.data?.rows?.map((item: DataApi) => (
                <TableRow key={item.id}>
                  <TableCell>{item.reason}</TableCell>
                  <TableCell>{item.start_date}</TableCell>
                  <TableCell>{item.end_date}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <GoDotFill
                        className={
                          item.status === "Approved"
                            ? "text-success-500"
                            : item.status === "Pending"
                            ? "text-warning-500"
                            : "text-danger-500"
                        }
                      />
                      {item.status}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Tooltip
                      content={
                        item.end_date < moment(new Date()).format("YYYY-MM-DD")
                          ? t("expiredLeaveRequest")
                          : t("cancelLeaveRequest")
                      }
                      closeDelay={0}
                      placement="left-start"
                      color="danger"
                      showArrow
                    >
                      <div>
                        {item.end_date >= moment().format("YYYY-MM-DD") ? (
                          <Button
                            onPress={() => {
                              setCancelId(item.id);
                              setIsOpenConfirm(true);
                            }}
                            color="danger"
                            size="sm"
                            isIconOnly
                            radius="full"
                            variant="faded"
                          >
                            <IoIosClose size={24} />
                          </Button>
                        ) : (
                          <Button
                            disabled
                            color="danger"
                            size="sm"
                            isIconOnly
                            radius="full"
                            variant="faded"
                            className="opacity-50 hover:opacity-50"
                          >
                            <IoIosClose size={24} />
                          </Button>
                        )}
                      </div>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pagination
            total={totalPage}
            page={pagination.page}
            onChange={(page) => setPagination((p) => ({ ...p, page }))}
            showControls
            radius="lg"
            variant="light"
          />
        </div>
      </div>

      {/* Cancel confirm popup */}
      <PopupUi
        isOpen={isOpenConfirm}
        onClose={() => setIsOpenConfirm(false)}
        size="sm"
        position="center"
        animation="clip"
        footerPlacement="center"
        onSave={onCancel}
        btnLabel={t("ok")}
        radius="2xl"
        iconClose={false}
      >
        <div className="space-y-4 px-4 text-center pt-4">
          <h2>{t("cancelLeaveRequest")}</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {t("areYouSureCancelLeaveRequest")}
          </p>
        </div>
      </PopupUi>
    </>
  );
};

export default Index;
