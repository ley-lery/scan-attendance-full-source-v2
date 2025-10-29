import { db } from "../../../../config/db";
import { LectureLeaveRequest } from "../../../../types/interface";
import { Message } from "../../../../utils/message";


export const LecturerLeaveRequestModel = {

    async state(lecturerId: number): Promise<any> {
        const [result] = await db.query(`Call sp_lecturer_leave_state_get(?)`, [lecturerId]);
        return result;
    },
    
    async getAll(lecturerId: number, page: number = 1, limit: number = 10): Promise<any> {
        const [result] = await db.query(`Call sp_lecturer_leave_request_get(?, ?, ?, ?)`, [null, lecturerId, page, limit]);
        return result;
    },

    async getById(id: number, lecturerId: number): Promise<any> {
        const [result] = await db.query(`Call sp_lecturer_leave_request_get(?, ?, ?, ?)`, [id, lecturerId, null, null]);
        return result;
    },

    async createReq(data: LectureLeaveRequest): Promise<any> {
        const { lecturerId, requestDate, startDate, endDate, reason, status } = data;
        await db.query(`Call sp_lecturer_leave_request_create(?, ?, ?, ?, ?, ?, @p_messages_json)`, [lecturerId, requestDate, startDate, endDate, reason, status]);
        return Message.callProcedureWithMessages();
    },

    async cancelReq(id: number, lecturerId: number): Promise<any> {
        await db.query(`Call sp_lecturer_leave_request_cancel(?, ?, @p_messages_json)`, [id, lecturerId]);
        return Message.callProcedureWithMessages();
    },
}


