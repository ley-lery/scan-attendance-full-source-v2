/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ModalView, ShowToast } from "@/components/hero-ui";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { cn } from "@/lib/utils";
import { GoDotFill } from "react-icons/go";
import { useMutation } from "@/hooks/useMutation";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MetricCard } from "../../../../components/ui/card/MetricCard";
import { FaRegCircle } from "react-icons/fa";

interface ViewProps {
  isOpen?: boolean;
  onClose: (isOpen: boolean) => void;
  row: {
    id: number;
    course_id: number;
  };
}

const View = ({ isOpen = false, onClose, row }: ViewProps) => {
  const { t } = useTranslation();

  const [attendanceData, setAttendanceData] = useState<any>({});
  const [sessionKeys, setSessionKeys] = useState<string[]>([]);

  const { mutate: fetchData, loading: fetchLoading } = useMutation({
    onSuccess: (response) => {
      const rows = response?.data?.rows;
      setAttendanceData(rows);
      const keys = Object.keys(rows).filter((key) => key.startsWith("s"));
      setSessionKeys(keys);
      console.log(rows, 'rows');
    },
    onError: (err) => {
      ShowToast({
        color: "error",
        title: "Error",
        description: err?.message || "Failed to fetch data",
      });
    },
  });

  useEffect(() => {
    if (isOpen && row?.id && row?.course_id) {
      fetchData(
        "/lecturer/markattstudent/studentsession",
        {
          course: row.course_id,
          student: row.id,
        },
        "POST"
      );
    }
  }, [isOpen, row]);

  // ==== status
  const statusIcon = (action: string | null) => {
    switch (action) {
      case "1":
        return {
          icon: <GoDotFill />,
          text: t("present"),
          class: "text-success bg-success/20",
        };
      case "P":
        return {
          icon: <GoDotFill />,
          text: t("permission"),
          class: "text-primary bg-primary/20",
        };
      case "A":
        return {
          icon: <GoDotFill />,
          text: t("absent"),
          class: "text-danger bg-danger/20",
        };
      case "L":
        return {
          icon: <GoDotFill />,
          text: t("late"),
          class: "text-warning bg-warning/20",
        };
      default:
        return {
          icon: <GoDotFill className="text-gray-400" />,
          text: t("notMarked"),
          class: "text-gray-500 bg-zinc-500/20",
        };
    }
  };

  const customizeCols = (status: string | null) => {
    const s = statusIcon(status);
    return (
      <span
        className={cn(
          "px-3 py-1 rounded-full w-fit text-xs/tight font-medium inline-flex items-center gap-1 whitespace-nowrap",
          s.class
        )}
      >
        {s.icon} {s.text}
      </span>
    );
  };

  

  const states = (data: any, icon: any, label: string, color: string) => {
    <div className="text-center p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-md bg-zinc-700">
            {icon}
          </span>
          <span>{label}</span>
        </div>
        <Button isIconOnly startContent={<BsThreeDotsVertical />}/>
      </div>
      <div>
        <span>{data}</span>
        <div>

        </div>
      </div>
    </div>
  }

  return (
    <ModalView
      isOpen={isOpen}
      onClose={() => onClose(false)}
      title={t("viewDetail")}
      size="full"
      animation="scale"
      isLoading={fetchLoading}
    >
      <div className="space-y-10 p-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <MetricCard title={t("present")} description="Total number of students marked as present." type="Presents" value={attendanceData.total_present} variant="success" icon={<FaRegCircle />} />
          <MetricCard title={t("absent")} description="Total number of students who were absent." type="Absents" value={attendanceData.total_absent} variant="danger" icon={<FaRegCircle />} />
          <MetricCard title={t("late")} description="Total number of students who arrived late." type="Late" value={attendanceData.total_late} variant="warning" icon={<FaRegCircle />} />
          <MetricCard title={t("permission")} description="Total number of students with approved leave or permission." type="Permissions" value={attendanceData.total_permission} variant="secondary" icon={<FaRegCircle />} />
          <MetricCard title={t("attendanceRate")} description="Overall attendance rate percentage for the class." type="%" value={attendanceData.attendance_percentage} variant="success" icon={<FaRegCircle />} />

        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-zinc-50 dark:bg-zinc-800 p-5 rounded-3xl">
          <div>
            <p className="text-sm text-gray-500">{t("studentCode")}</p>
            <p className="font-medium">{attendanceData.student_code}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">{t("studentNameKh")}</p>
            <p className="font-medium">{attendanceData.student_name_kh}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">{t("studentNameEn")}</p>
            <p className="font-medium">{attendanceData.student_name_en}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">{t("status")}</p>
            <p className="font-medium">{attendanceData.status}</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          {sessionKeys.length > 0 ? (
            <Table
              aria-label="Sessions Table"
              removeWrapper
              className="has-scrollbar pb-10"
              classNames={{
                thead: "bg-transparent",
                th: "bg-transparent border-b border-zinc-200 dark:border-zinc-700",
              }}
            >
              <TableHeader>
                {sessionKeys.map((key) => (
                  <TableColumn key={key}>
                    <span className="capitalize">{t(key)}</span>
                  </TableColumn>
                ))}
              </TableHeader>
              <TableBody>
                <TableRow key="1">
                  {sessionKeys.map((key) => (
                    <TableCell key={key}>
                      {customizeCols(attendanceData[key])}
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-gray-500 py-10">
              {fetchLoading ? t("loading") : t("noData")}
            </p>
          )}
        </div>

      </div>
    </ModalView>
  );
};

export default memo(View);
