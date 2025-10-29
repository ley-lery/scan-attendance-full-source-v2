import { db } from "../../../../config/db";
import { ApproveLeave, BatchLeave } from "../../../../types/interface";
import { Message } from "../../../../utils/message";

interface Filter {
    lecturer: number | null; // lecturer_id
    status: string; 
    startDate: string | null;
    endDate: string | null; 
    requestDate: string | null; 
    approvedByUser: number | null; // approved_by_user_id
    deleted: boolean | null;
    search: string | null;
    page: number;
    limit: number;
} // 11 parameters

export const LecturerLeaveModel = {

    async getAll(page: number = 1, limit: number = 10): Promise<any> {
        const [result] = await db.query(`Call sp_admin_lecturer_leave_request_filter_list(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [null, null, null, null, null, null, null, null, page, limit]);
        return result;
    },

    async getById(id: number): Promise<any> {
        const [result] = await db.query(`Call sp_lecturer_leave_request_get_admin(?, ?, ?)`, [id, null, null]);
        return result;
    },

    async approveLeave(data: ApproveLeave): Promise<any> {
        const { leaveId, approveByUser, adminNote } = data;
        await db.query(`Call sp_lecturer_leave_request_approve_user(?, ?, ?, @p_messages_json)`, [leaveId, approveByUser, adminNote]);
        return Message.callProcedureWithMessages();
    },

    async rejectLeave(data: ApproveLeave): Promise<any> {
        const { leaveId, approveByUser, adminNote } = data;
        await db.query(`Call sp_lecturer_leave_request_reject_user(?, ?, ?, @p_messages_json)`, [leaveId, approveByUser, adminNote]);
        return Message.callProcedureWithMessages();
    },

    // Multi approve/reject
    async batchLeave(data: BatchLeave): Promise<any> {
        const { leaveIds, action, approveByUser, adminNote } = data;
        await db.query(`Call sp_lecturer_leave_request_batch_user(?, ?, ?, ?, @p_messages_json)`, [leaveIds, action, approveByUser, adminNote]);
        return Message.callProcedureWithMessages();
    },
    
    async filter(data: Filter): Promise<any> {
        const { lecturer, status, startDate, endDate, requestDate, approvedByUser, deleted, search, page, limit } = data;
        return await db.query(`Call sp_admin_lecturer_leave_request_filter_list(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [ lecturer, status, startDate, endDate, requestDate, approvedByUser, deleted, search, page, limit]);
    },

}


