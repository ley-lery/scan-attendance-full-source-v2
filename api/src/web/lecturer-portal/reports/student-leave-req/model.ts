import { db } from "../../../../index";

type FilterData = {
    classId: number,
    course: number,
    student: number,
    startDate: Date | string,
    endDate: Date | string,
    status: string,
} // 6 parameters



export const StudentLeaveReqReportModel = {

    async getAll(): Promise<any> {
        const [result] = await db.query(`Call sp_lecturer_student_leave_requests_report(null, null, null, null, null, null, null)`);
        return result;
    },
    async filter(lecturerId: number, filterData: FilterData): Promise<any> {
        const { classId, course, student, startDate, endDate, status } = filterData;
        const [result] = await db.query(`Call sp_lecturer_student_leave_requests_report(?, ?, ?, ?, ?, ?, ?)`, [lecturerId, classId, course, student, startDate, endDate, status]);
        return result;
    },
    
}


