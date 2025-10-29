import { db } from "../../../../../index";

type Data = {
    classId : number,
    course : number,
    student : number,
    faculty : number,
    field : number,
    promotionNo : number,
    termNo : number,
    minAttendancePercentage : number,
    maxAttendancePercentage : number,
    showAtRiskOnly : boolean,
    page?: number,
    limit?: number,
}

export const AttendanceSummaryModel = {

    async getAll(): Promise<any> {
        const [result] = await db.query(`Call sp_attendance_report_admin(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [null, null, null, null, null, null, null, null, null, null, 0, 0]);
        return result;
    },
    async filter(data: Data): Promise<any> {
        const { classId, course, student, faculty, field, promotionNo, termNo, minAttendancePercentage, maxAttendancePercentage, showAtRiskOnly, page, limit } = data;
        const [result] = await db.query(`Call sp_attendance_report_admin(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [classId, course, student, faculty, field, promotionNo, termNo, minAttendancePercentage, maxAttendancePercentage, showAtRiskOnly, page, limit]);
        return result;
    },
    

}


