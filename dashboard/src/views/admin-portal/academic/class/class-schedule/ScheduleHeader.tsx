import { IMG } from "@/constants/Image";

type Fields = {
    field_name_en: string,
    promotion_no: number,
    group: string,
    stage: string,
    year: string,
    term_no: number,
    start_date: string,
    mid_term_start_date: string,
    mid_term_end_date: string,
    final_exam_date: string,
    new_term_start_date: string,
    room_name: string
}

interface ScheduleHeaderProps {
    data: Fields;
}

export const ScheduleHeader = ({ data }: ScheduleHeaderProps) => {

    const formatDate = (date: string) => {
      if (!date) return "";
      const d = new Date(date);
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    };

    return (
        <div className="flex flex-col items-center justify-center gap-4 space-y-4">
            <div className="flex items-center gap-4">
                <div>
                    <img src={IMG.LOGO} alt="BBU Logo" className="w-28 h-28 object-contain" />
                </div>
                <div className="*:text-center *:font-semibold">
                    <p className="text-xl font-khmerOSMoul">សកលវិទ្យាល័យបៀលប្រាយ</p>
                    <p className="text-xl font-khmerOSSiemreap uppercase">Build Bright University</p>
                    <h2>Schedule for Bachelor of Science</h2>
                    <p>Field: {data?.field_name_en || "Information Technology"}</p>
                </div>
            </div>
            <div className="flex items-center gap-40">
                <div className="flex gap-6 space-y-2">
                    <div className="flex flex-col gap-2">
                        <span>Promotion: {data?.promotion_no}</span>
                        <span className="capitalize">{data?.group} Class</span>
                    </div>
                    <div className="space-y-2 *:flex *:gap-8">
                        <div>
                            <span>Stage: {data?.stage}</span>
                            <span>Group: {data?.group}</span>
                            <span className="ml-40">Year {data?.year}</span>
                            <span>Semester {data?.term_no}</span>
                        </div>
                        <div>
                            <span>Start Date: {formatDate(data?.start_date)}</span>
                            <span>
                                Mid-term: {formatDate(data?.mid_term_start_date)} to{" "}
                                {formatDate(data?.mid_term_end_date)}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <span>Final: {data?.final_exam_date}</span>
                    <span>New Term Start: {data?.new_term_start_date}</span>
                    <span>Room: {data?.room_name}</span>
                </div>
            </div>
        </div>
    );
};