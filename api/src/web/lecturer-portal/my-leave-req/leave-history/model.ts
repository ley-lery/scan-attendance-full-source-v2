import { db } from "../../../../config/db";
import { LectureLeaveFilter } from "../../../../types/interface";

export const LectureLeaveHistoryModel = {
    async state(lecturerId: number): Promise<any> {
        const [result] = await db.query(`Call sp_lecturer_leave_state_get(?)`, [lecturerId]);
        return result;
    },

    async getAll(lecturerId: number, page: number = 1, limit: number = 10): Promise<any> {
        const [result] = await db.query(`Call sp_lecturer_leave_request_history_get(?, ?, ?, ?)`, [null, lecturerId, page, limit]);
        return result;
    },

    async getById(id: number, lecturerId: number): Promise<any> {
        const [result] = await db.query(`Call sp_lecturer_leave_request_history_get(?, ?, ?, ?)`, [id, lecturerId, null, null]);
        return result;
    },
    
    async filter(lecturerId: number,data: LectureLeaveFilter): Promise<any> {
        const { status, reqDate, startDate, endDate, page, limit  } = data;
        const [result] = await db.query(`Call sp_lecturer_leave_request_filter(?, ?, ?, ?, ?, ?, ?)`, [lecturerId, status, reqDate, startDate, endDate, page, limit]);
        return result;
    },
}


