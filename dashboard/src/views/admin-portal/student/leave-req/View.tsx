import { memo } from "react";
import { useTranslation } from "react-i18next";
import { ModalView } from "@/components/hero-ui";
import { cn } from "@/lib/utils";
import { 
  User, 
  Calendar, 
  Clock, 
  FileText, 
  CheckCircle, 
  XCircle,
  Building2,
  GraduationCap,
  Mail,
  Phone,
  Hash
} from "lucide-react";
import { Chip } from "@heroui/react";


interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
  fullWidth?: boolean;
}

// Helper Component
const InfoItem = ({ icon, label, value, fullWidth = false }: InfoItemProps) => (
  <div className={cn("flex items-center gap-2", fullWidth && "md:col-span-2")}>
    <span className="dark:bg-white/10 bg-black/5 p-2 rounded-lg text-zinc-500 dark:text-zinc-400">{icon}</span>
    <div className="flex flex-col">
      <span className="text-xs text-default-500">{label}</span>
      <p className="text-sm font-medium text-foreground">
        {value || "N/A"}
      </p>
    </div>
  </div>
);

interface StudentLeaveRow {
  id: number;
  student_id: number;
  student_code: string;
  student_name_kh: string;
  student_name_en: string;
  student_email: string;
  student_phone: string | null;
  class_id: number;
  class_name: string;
  program_type: string;
  promotion_no: number;
  term_no: number;
  faculty_name_en: string;
  field_name_en: string;
  request_date: string;
  start_date: string;
  end_date: string;
  total_days: number;
  reason_preview: string;
  status: "Approved" | "Rejected" | "Pending" | "Cancelled";
  approved_by_username: string | null;
  approved_by_lecturer: string | null;
  approval_date: string | null;
}

interface ViewProps {
  isOpen?: boolean;
  onClose: (isOpen: boolean) => void;
  row: Partial<StudentLeaveRow> | null;
}

const View = ({ isOpen = false, onClose, row }: ViewProps) => {

  if (!isOpen) return null;

  const { t } = useTranslation();

  if (!row) return null;

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "Approved":
        return "success";
      case "Rejected":
        return "danger";
      case "Pending":
        return "warning";
      case "Cancelled":
        return "default";
      default:
        return "default";
    }
  };

  const formatDate = (date?: string | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  return (
    <ModalView 
      isOpen={isOpen} 
      onClose={() => onClose(false)} 
      title={t("leaveRequestDetails")} 
      size="2xl"
    >
      <div className="space-y-6 pr-4">
        {/* Status Badge */}
        <div className="flex items-center justify-between pb-4 border-b border-divider">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Hash className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-default-500">{t("requestId")}</p>
              <p className="text-lg font-medium">#{row.id}</p>
            </div>
          </div>
          <Chip variant="dot" color={getStatusColor(row.status)}>{row.status || "-"}</Chip>
        </div>

        {/* Student Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-lg font-medium dark:text-zinc-400 text-zinc-500">
            <User className="w-5 h-5 text-primary" />
            <h3>{t("studentInformation")}</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-zinc-100/50 dark:bg-zinc-800/50 rounded-3xl">
            <InfoItem 
              icon={<Hash className="w-4 h-4" />}
              label={t("studentCode")} 
              value={row.student_code} 
            />
            <InfoItem 
              icon={<User className="w-4 h-4" />}
              label={t("studentNameEn")} 
              value={row.student_name_en} 
            />
            <InfoItem 
              icon={<User className="w-4 h-4" />}
              label={t("studentNameKh")} 
              value={row.student_name_kh} 
            />
            <InfoItem 
              icon={<Mail className="w-4 h-4" />}
              label={t("email")} 
              value={row.student_email} 
            />
            <InfoItem 
              icon={<Phone className="w-4 h-4" />}
              label={t("phone")} 
              value={row.student_phone} 
            />
          </div>
        </div>

        {/* Academic Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-lg font-medium dark:text-zinc-400 text-zinc-500">
            <GraduationCap className="w-5 h-5 text-primary" />
            <h3>{t("academicInformation")}</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-zinc-100/50 dark:bg-zinc-800/50 rounded-3xl">
            <InfoItem 
              icon={<Building2 className="w-4 h-4" />}
              label={t("faculty")} 
              value={row.faculty_name_en} 
            />
            <InfoItem 
              icon={<GraduationCap className="w-4 h-4" />}
              label={t("field")} 
              value={row.field_name_en} 
            />
            <InfoItem 
              icon={<GraduationCap className="w-4 h-4" />}
              label={t("class")} 
              value={row.class_name} 
            />
            <InfoItem 
              icon={<GraduationCap className="w-4 h-4" />}
              label={t("programType")} 
              value={row.program_type} 
            />
            <InfoItem 
              icon={<Hash className="w-4 h-4" />}
              label={t("promotion")} 
              value={row.promotion_no?.toString()} 
            />
            <InfoItem 
              icon={<Hash className="w-4 h-4" />}
              label={t("term")} 
              value={row.term_no?.toString()} 
            />
          </div>
        </div>

        {/* Leave Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <Calendar className="w-5 h-5 text-primary" />
            <h3>{t("leaveDetails")}</h3>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {/* Date Range Card */}
            <div className="p-4 bg-zinc-100 dark:bg-zinc-800/50 rounded-3xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-default-500">{t("startDate")}</p>
                    <p className="font-semibold">{formatDate(row.start_date)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-default-500">{t("endDate")}</p>
                    <p className="font-semibold">{formatDate(row.end_date)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-default-500">{t("totalDays")}</p>
                    <p className="font-semibold">{row.total_days} {t("days")}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Other Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-zinc-100 dark:bg-zinc-800/50 rounded-3xl">
              <InfoItem 
                icon={<Calendar className="w-4 h-4" />}
                label={t("requestDate")} 
                value={formatDate(row.request_date)} 
              />
              <InfoItem 
                icon={<FileText className="w-4 h-4" />}
                label={t("reason")} 
                value={row.reason_preview} 
                fullWidth
              />
            </div>
          </div>
        </div>

        {/* Approval Information */}
        {(row.status === "Approved" || row.status === "Rejected") && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
              {row.status === "Approved" ? (
                <CheckCircle className="w-5 h-5 text-success" />
              ) : (
                <XCircle className="w-5 h-5 text-danger" />
              )}
              <h3>{t("approvalInformation")}</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-zinc-100 dark:bg-zinc-800/50 rounded-3xl">
              <InfoItem 
                icon={<User className="w-4 h-4" />}
                label={t("approvedBy")} 
                value={row.approved_by_username} 
              />
              <InfoItem 
                icon={<Calendar className="w-4 h-4" />}
                label={t("approvalDate")} 
                value={formatDate(row.approval_date)} 
              />
              {row.approved_by_lecturer && (
                <InfoItem 
                  icon={<User className="w-4 h-4" />}
                  label={t("lecturer")} 
                  value={row.approved_by_lecturer} 
                  fullWidth
                />
              )}
            </div>
          </div>
        )}
      </div>
    </ModalView>
  );
};



export default memo(View);