import { db } from "../../../../config/db";
import { StudentLeaveFilter } from "../../../../types/interface";

export const StudentLeaveHistoryModel = {

    async getAll(studentId: number, page: number = 1, limit: number = 10): Promise<any> {
        const [result] = await db.query(`Call sp_student_leave_request_history_student(?, ?, ?, ?)`, [null, studentId, page, limit]);
        return result;
    },

    async getById(id: number, studentId: number): Promise<any> {
        const [result] = await db.query(`Call sp_student_leave_request_history_student(?, ?, ?, ?)`, [id, studentId, null, null]);
        return result;
    },
    
    async filter(data: StudentLeaveFilter): Promise<any> {
        const { classId, student, status, date, startDate, endDate, page, limit  } = data;
        const [result] = await db.query(`Call sp_student_leave_request_filter_student(?, ?, ?, ?, ?, ?, ?, ?)`, [classId, student, status, date, startDate, endDate, page, limit]);
        return result;
    },
}


