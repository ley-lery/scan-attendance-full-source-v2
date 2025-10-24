import { db } from "../../../../index";

type FilterData = {
    courseId: number,
    startDate: Date | string,
    endDate: Date | string,
} // 3 parameters


export const LecturerTeachingSummaryReportModel = {

    async getAll(): Promise<any> {
        const [result] = await db.query(`Call sp_lecturer_course_teaching_summary_report( null, null, null )`);
        return result;
    },
    async filter(lecturerId: number, filterData: FilterData): Promise<any> {
        const { courseId, startDate, endDate } = filterData;
        const [result] = await db.query(`Call sp_lecturer_course_teaching_summary_report( ?, ?, ?, ? )`, [lecturerId, courseId, startDate, endDate]);
        return result;
    },
}


