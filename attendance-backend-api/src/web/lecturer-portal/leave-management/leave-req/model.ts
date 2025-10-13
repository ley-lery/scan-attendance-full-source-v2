import { db } from "../../../../config/db";
import { StudentLeaveRequest } from "../../../../types/interface";
import { Message } from "../../../../utils/message";


export const LecturerLeaveRequestModel = {

    async state(studentId: number): Promise<any> {
        const [result] = await db.query(`Call sp_lecturer_leave_state_get(?)`, [studentId]);
        return result;
    },
    
    async getAll(studentId: number, page: number = 1, limit: number = 10): Promise<any> {
        const [result] = await db.query(`Call sp_lecturer_leave_request_get_lecturer(?, ?, ?, ?)`, [null, studentId, page, limit]);
        return result;
    },

    async getById(id: number, studentId: number): Promise<any> {
        const [result] = await db.query(`Call sp_lecturer_leave_request_get_lecturer(?, ?, ?, ?)`, [id, studentId, null, null]);
        return result;
    },

    async createReq(data: StudentLeaveRequest): Promise<any> {
        const { studentId, requestDate, startDate, endDate, reason, status } = data;
        await db.query(`Call sp_lecturer_leave_request_create(?, ?, ?, ?, ?, ?, @p_messages_json)`, [studentId, requestDate, startDate, endDate, reason, status]);
        return Message.callProcedureWithMessages();
    },

    async cancelReq(id: number, studentId: number): Promise<any> {
        await db.query(`Call sp_lecturer_leave_request_cancel(?, ?, @p_messages_json)`, [id, studentId]);
        return Message.callProcedureWithMessages();
    },
}


