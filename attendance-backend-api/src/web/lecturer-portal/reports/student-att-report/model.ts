import { db } from "../../../../index";

type FilterData = {
    classId: number,
    course: number,
    student: number,
    faculty: number,
    field: number,
    programType: string,
    promotionNo: number,
    termNo: number,
    startDate: Date | string,
    endDate: Date | string,
} // 10 parameters



export const StudentAttendanceReportModel = {

    async getAll(): Promise<any> {
        const [result] = await db.query(`Call sp_lecturer_student_attendance_report( null, null, null, null, null, null, null, null, null, null, null)`);
        return result;
    },
    async filter(lecturerId: number, filterData: FilterData): Promise<any> {
        const { classId, course, student, faculty, field, programType, promotionNo, termNo, startDate, endDate } = filterData;
        const [result] = await db.query(`Call sp_lecturer_student_attendance_report( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )`, [lecturerId, classId, course, student, faculty, field, programType, promotionNo, termNo, startDate, endDate]);
        return result;
    },
}


