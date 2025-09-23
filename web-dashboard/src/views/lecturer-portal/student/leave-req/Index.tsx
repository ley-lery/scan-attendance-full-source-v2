/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  useDisclosure,
  Skeleton,
  Tooltip,
  type DateValue
} from "@heroui/react";
import Form from "./Form";
import { useEffect, useMemo, useState } from "react";
import { IoIosCheckmarkCircleOutline, IoIosClose } from "react-icons/io";
import { PiWarningCircle } from "react-icons/pi";
import { SlClose } from "react-icons/sl";
import { FaRegCircle } from "react-icons/fa";
import CardUi from "@/components/hero-ui/card/CardUi";
import { useTranslation } from "react-i18next";
import ConfirmDialog from "@/components/ui/dialog/ConfirmDialog";
import { FiCheck } from "react-icons/fi";
import ShowToast from "@/components/hero-ui/toast/ShowToast";
import TableUi from "@/components/hero-ui/table/Table";

// Build UI
import { Popup } from "@/components/ui";
// Hero UI
import { DatePicker } from "@/components/hero-ui";

interface Cards {
  title: string;
  number: number;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: string;
}

interface DataApi {
  id: number;
  requestor: string;
  reason: string;
  start_date: string;
  end_date: string;
  submitted_on: string;
  status: string;
}

const dataApi: DataApi[] = [
  {
    id: 1,
    requestor: "Ley Lery",
    reason: "Medical Appointment",
    start_date: "2023-10-01",
    end_date: "2023-10-05",
    submitted_on: "2023-09-28",
    status: "Pending",
  },
  {
    id: 2,
    requestor: "Sokun",
    reason: "Family Emergency",
    start_date: "2023-10-10",
    end_date: "2023-10-12",
    submitted_on: "2023-10-01",
    status: "Approved",
  },
  {
    id: 3,
    requestor: "Chan Dara",
    reason: "Personal Leave",
    start_date: "2025-07-15",
    end_date: "2025-07-20",
    submitted_on: "2025-07-10",
    status: "Approved",
  },
  {
    id: 4,
    requestor: "Meas Kakada",
    reason: "Personal Leave",
    start_date: "2025-07-15",
    end_date: "2025-07-20",
    submitted_on: "2025-07-10",
    status: "Rejected",
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
  const { isOpen, onOpenChange } = useDisclosure();
  const { isOpenCancel, onOpenChangeCancel } = useCancelClosure();

  const [data] = useState<DataApi[]>(dataApi);
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

  const cols = [
    { key: "requestor", label: t("requestor") },
    { key: "reason", label: t("reason") },
    { key: "start_date", label: t("startDate") },
    { key: "end_date", label: t("endDate") },
    { key: "submitted_on", label: t("submittedOn") },
    { key: "status", label: t("status") },
  ];

  const actions = (
    <div className="flex items-center gap-2">
      <Tooltip
          closeDelay={0}
          placement="left-start"
          color="success"
          showArrow
          content={t("approve")}
      >
        <Button
          color="success"
          size="sm"
          isIconOnly
          radius="full"
          variant="light"
          >
          <FiCheck size={18} />
        </Button>
      </Tooltip>
      <Tooltip
        closeDelay={0}
        placement="right-start"
        color="danger"
        showArrow
        content={t("reject")}
      >
        <Button
            color="danger"
            size="sm"
            isIconOnly
            radius="full"
            variant="light"
            disabled
          >
            <IoIosClose size={24} />
          </Button>
      </Tooltip>
    </div>
  )

  return (
    <>
      <div className="p-4 space-y-4 h-full">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-medium">{t("studentLeaveRequests")}</h1>
            <p className="text-zinc-500 dark:text-zinc-400">
              {t("hereYouCanViewAndManageStudentLeaveRequests")}
            </p>
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

        <TableUi
          data={filteredData}
          loading={loading}
          cols={cols}
          actions={actions}
          background={true}
          status={["Pending", "Approved", "Rejected"]}
          openFilter={() => setIsOpenPopup(true)}
          handleClearFilter={handleClearFilter}
        />

      </div>

      {/* // ======== Form for request leave request ======== */}
      <Form isOpen={isOpen} onOpenChange={onOpenChange} />

      {/* // ======== Confirm dialog for cancel leave request ======== */}
      <ConfirmDialog
        isOpen={isOpenCancel}
        onOpenChange={onOpenChangeCancel}
        confirm={onCancel}
        confirmLabel={t("ok")}
        title={t("cancelLeaveRequest")}
        message={t("areYouSureCancelLeaveRequest")}
      />

      {/* // ======== Popup for filtering leave requests ======== */}
      <Popup
        isOpen={isOpenPopup}
        onClose={() => setIsOpenPopup(false)}
        size="sm"
        header={t("filter")}
        position="center"
        animation="clip"
      >
        <div className="space-y-4">
          <DatePicker
            labelPlacement="outside"
            label={t("date")}
            name="date"
            value={filterData.date}
            onChange={(val) => handleDateChange("date", val as DateValue)}
            isRequired
          />
        </div>
      </Popup>
      <Popup
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
      </Popup>
    </>
  );
};

export default Index;
