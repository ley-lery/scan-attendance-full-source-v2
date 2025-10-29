import { IMG } from "@/constants/Image";

interface Props {
    classInfo: ClassInfo;
}

// Helper to format date nicely
const formatDate = (date: string) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };


export const ScheduleInfo = ({ classInfo }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 space-y-4">
        <div className="flex items-center gap-4">
            <div>
                <img src={IMG.LOGO} alt="BBU Logo" className="w-28 h-28 object-contain" />
            </div>
            <div className="*:text-center *:font-semibold">
                <p className="text-xl font-khmerOSMoul">សកលវិទ្យាល័យបៀលប្រាយ</p>
                <p className="text-xl font-khmerOSSiemreap uppercase">Build Bright University</p>
                <h2>Schedule for Bachelor of Law</h2>
                <p>Field: {classInfo.field_name_en}</p>
            </div>
        </div>
        <div className="flex items-center gap-40">
        <div className="flex gap-6 space-y-2">
            <div className="mt-2 flex flex-col gap-2">
            <span>
                Promotion: {classInfo.promotion_no}
            </span>
            <span className="capitalize">{classInfo.group} Class</span>
            </div>
            <div className="space-y-2 *:flex *:gap-8">
            <div>
                <span>Stage: {classInfo.stage}</span>
                <span>Group: {classInfo.group}</span>
                <span className="ml-40">Year {classInfo.year}</span>
                <span>Semester {classInfo.term_no}</span>
            </div>
            <div>
                <span>Start Date: {formatDate(classInfo.start_date)}</span>
                <span>
                Mid-term: {formatDate(classInfo.mid_term_start_date)} to{" "}
                {formatDate(classInfo.mid_term_end_date)}
                </span>
            </div>
            <div>
                <span>ថ្ងៃផត់កំណត់បង់ថ្លៃសិក្សា: Aug 15, 2025</span>
            </div>
            </div>
        </div>
        <div className="flex flex-col gap-2">
            <span>Final: {classInfo.final_exam_date}</span>
            <span>New Term Start: {classInfo.new_term_start_date}</span>
            <span>Room: {classInfo.room_name}</span>
        </div>
        </div>
    </div>
  )
}