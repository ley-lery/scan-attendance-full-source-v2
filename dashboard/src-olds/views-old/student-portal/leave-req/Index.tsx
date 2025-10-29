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
  Skeleton,
  Tooltip,
  type DateValue,
  Pagination,
} from "@heroui/react";
import { IoAddCircleOutline } from "react-icons/io5";
import Form from "./Form";
import { useEffect, useMemo, useState } from "react";
import { IoIosCheckmarkCircleOutline, IoIosClose } from "react-icons/io";
import { PiWarningCircle } from "react-icons/pi";
import { SlClose } from "react-icons/sl";
import { FaRegCircle } from "react-icons/fa";
import CardUi from "@/components/hero-ui/card/CardUi";
import { useTranslation } from "react-i18next";
import ConfirmDialog from "@/components/ui/dialog/ConfirmDialog";
import { GoDotFill } from "react-icons/go";
import { FiChevronDown } from "react-icons/fi";
import PopupUi from "@/components/ui/dialog/Popup";
import DatePickerUi from "@/components/hero-ui/date/date-picker/DatePickerUi";
import moment from "moment";
import { CiFilter } from "react-icons/ci";
import ShowToast from "@/components/hero-ui/toast/ShowToast";
import LoadingUi from "@/components/hero-ui/loading/Loading";
import { DropdownItem, Dropdown, DropdownTrigger, DropdownMenu } from "@/components/hero-ui";

interface Cards {
  title: string;
  number: number;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: string;
}

interface DataApi {
  id: number;
  subject: string;
  reason: string;
  start_date: string;
  end_date: string;
  submitted_on: string;
  status: string;
}

const dataApi: DataApi[] = [
  {
    id: 1,
    subject: "Mathematics",
    reason: "Medical Appointment",
    start_date: "2023-10-01",
    end_date: "2023-10-05",
    submitted_on: "2023-09-28",
    status: "Pending",
  },
  {
    id: 2,
    subject: "Science",
    reason: "Family Emergency",
    start_date: "2023-10-10",
    end_date: "2023-10-12",
    submitted_on: "2023-10-01",
    status: "Approved",
  },
  {
    id: 3,
    subject: "History",
    reason: "Personal Leave",
    start_date: "2025-07-15",
    end_date: "2025-07-20",
    submitted_on: "2025-07-10",
    status: "Approved",
  },
];

const useCancelClosure = () => {
  const { isOpen, onOpen, onOpenChange, ...rest } = useDisclosure();
  return {
    isOpenCancel: isOpen,
    onOpenCancel: onOpen,
    onOpenChangeCancel: onOpenChange,
    ...rest,
  };
};

const Index = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [isOpenConfirmDialog, setIsOpenConfirmDialog] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { isOpenCancel, onOpenCancel, onOpenChangeCancel } = useCancelClosure();

  const [data, setData] = useState<DataApi[]>(dataApi);
  const [status, setStatus] = useState(new Set(["Pending", "Approved", "Rejected"]));
  
  const [filterData, setFilterData] = useState<{ date: DateValue | null }>({
    date: null,
  });

  useEffect(()=>{
    const loadData = async () =>{
      try {
        setLoading(true)
      } catch (error) {
        console.log(error)
      } finally{
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const statusMatch = status.has(item.status);
      setIsOpenPopup(false);
      const dateFilterMatch = filterData.date
        ? (() => {
            const filter = new Date(filterData.date.toString());
            const start = new Date(item.start_date);
            const end = new Date(item.end_date);
            return filter >= start && filter <= end;
          })()
        : true;

      return statusMatch && dateFilterMatch;
    });
    
  }, [data, status, filterData]);

  // Card data
  const totalApproved = data.filter((item) => item.status === "Approved").length;
  const totalPending = data.filter((item) => item.status === "Pending").length;
  const totalRejected = data.filter((item) => item.status === "Rejected").length;
  const totalRequests = data.length;

  const [card] = useState<Cards[]>([
    {
      number: totalApproved,
      title: t("approved"),
      subtitle: t("times"),
      icon: <IoIosCheckmarkCircleOutline size={25} />,
      color: "text-green-500",
    },
    {
      number: totalPending,
      title: t("pending"),
      subtitle: t("times"),
      icon: <PiWarningCircle size={25} />,
      color: "text-yellow-500",
    },
    {
      number: totalRejected,
      title: t("rejected"),
      subtitle: t("times"),
      icon: <SlClose size={22} />,
      color: "text-pink-500",
    },
    {
      number: totalRequests,
      title: t("total"),
      subtitle: t("times"),
      icon: <FaRegCircle size={22} />,
      color: "text-blue-500",
    },
  ]);

  const onCancel = () => {
    ShowToast({
      color: "success",
      title: t("success"),
      description: t("leaveRequestRejected"),
    });
  };

  const handleDateChange = (field: keyof typeof filterData, value: DateValue | null) => {
    setFilterData((prev) => ({ ...prev, [field]: value }));
  };

  const handleClearFilter = () => {
    setFilterData({ date: null });
    setStatus(new Set(["Pending", "Approved", "Rejected"]));
  }

  return (
    <>
      <div className="p-4 space-y-4 h-full">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Leave Requests</h1>
            <p className="text-zinc-500 dark:text-zinc-400">
              Here you can view and manage your leave requests.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Dropdown >
              <DropdownTrigger>
                <Button className="capitalize btn-small-ui" variant="solid" endContent={<FiChevronDown />}>
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
            <Button onPress={handleClearFilter} startContent={<CiFilter size={20} />} color="danger" className={`btn-small-ui `} isDisabled={!filterData.date}>
              {t("clear")}
            </Button>
            <Button onPress={() => setIsOpenPopup(true)} startContent={<CiFilter size={20} />} color="secondary" className="btn-small-ui">
              {t("filter")}
            </Button>
            <Button onPress={onOpen} startContent={<IoAddCircleOutline size={18} />} color="primary" className="btn-small-ui">
              {t("requestLeave")}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-28 w-full rounded-lg p-4" />
              ))
            : card.map((item, index) => (
                <CardUi key={index} {...item} />
              ))}
        </div>
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
              td: "px-4"
            }}
          >
            <TableHeader>
              <TableColumn>Subject</TableColumn>
              <TableColumn>Reason</TableColumn>
              <TableColumn>Start Date</TableColumn>
              <TableColumn>End Date</TableColumn>
              <TableColumn>Status</TableColumn>
              <TableColumn>Actions</TableColumn>
            </TableHeader>
            <TableBody 
              emptyContent={
                <p>{loading ? <LoadingUi/> : t('noData') }</p>
              }
            >
              {filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.subject}</TableCell>
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
                      content={item.end_date < moment(new Date()).format("YYYY-MM-DD") ? t("expiredLeaveRequest") : t("cancelLeaveRequest")}
                      closeDelay={0}
                      placement="left-start"
                      color="danger"
                      showArrow
                    >
                      <div>
                        <Button
                          // onPress={onOpenCancel}
                          onPress={()=> setIsOpenConfirmDialog(true)}
                          color="danger"
                          size="sm"
                          isIconOnly
                          radius="full"
                          variant="faded"
                          className={`${item.end_date < moment(new Date()).format("YYYY-MM-DD") ? "hidden" : ""}`}
                          >
                          <IoIosClose size={24} />
                        </Button>
                        <Button
                          onPress={onOpenCancel}
                          color="danger"
                          size="sm"
                          isIconOnly
                          radius="full"
                          variant="faded"
                          disabled
                          className={`${item.end_date >= moment(new Date()).format("YYYY-MM-DD") ? "hidden" : "opacity-50 hover:opacity-50"}`}
                        >
                          <IoIosClose size={24} />
                        </Button>
                      </div>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pagination total={10} showControls radius="lg" variant="light"/>
        </div>

      </div>

      <Form isOpen={isOpen} onOpenChange={onOpenChange} />

      <ConfirmDialog
        isOpen={isOpenCancel}
        onOpenChange={onOpenChangeCancel}
        confirm={onCancel}
        confirmLabel={t("ok")}
        title={t("cancelLeaveRequest")}
        message={t("areYouSureCancelLeaveRequest")}
      />

      {/* // ======== Popup for filtering leave requests ======== */}
      <PopupUi
        isOpen={isOpenPopup}
        onClose={() => setIsOpenPopup(false)}
        size="sm"
        header={t("filter")}
        position="center"
        animation="clip"
      >
        <div className="space-y-4">
          <DatePickerUi
            labelPlacement="outside"
            label={t("date")}
            name="date"
            value={filterData.date}
            onChange={(val) => handleDateChange("date", val as DateValue)}
            isRequired
          />
        </div>
      </PopupUi>
      <PopupUi
        isOpen={isOpenConfirmDialog}
        onClose={() => setIsOpenConfirmDialog(false)}
        size="sm"
        position="center"
        animation="clip"
        footerPlacement="center"
        onSave={onCancel}
        btnLabel="confirm"
        radius="2xl"
        iconClose={false}
      >
        <div className="space-y-4 px-4 text-center pt-4">
          <h2>{t('cancelLeaveRequest')}</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{t('areYouSureCancelLeaveRequest')}</p>
        </div>
      </PopupUi>
    </>
  );
};

export default Index;
