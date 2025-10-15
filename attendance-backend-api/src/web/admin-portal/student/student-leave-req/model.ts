import { db } from "../../../../config/db";
import { ApproveLeave, BatchLeave, StudentLeveFilter } from "../../../../types/interface";
import { Message } from "../../../../utils/message";


export const StudentLeaveModel = {

    async getAll(page: number = 1, limit: number = 10): Promise<any> {
        const [result] = await db.query(`Call sp_student_leave_request_get_admin(?, ?, ?)`, [null, page, limit]);
        return result;
    },

    async getById(id: number): Promise<any> {
        const [result] = await db.query(`Call sp_student_leave_request_get_admin(?, ?, ?)`, [id, null, null]);
        return result;
    },

    async approveLeave(data: ApproveLeave): Promise<any> {
        const { leaveId, approveByUser, adminNote } = data;
        await db.query(`Call sp_student_leave_request_approve_user(?, ?, ?, @p_messages_json)`, [leaveId, approveByUser, adminNote]);
        return Message.callProcedureWithMessages();
    },

    async rejectLeave(data: ApproveLeave): Promise<any> {
        const { leaveId, approveByUser, adminNote } = data;
        await db.query(`Call sp_student_leave_request_reject_user(?, ?, ?, @p_messages_json)`, [leaveId, approveByUser, adminNote]);
        return Message.callProcedureWithMessages();
    },

    // Multi approve/reject
    async batchLeave(data: BatchLeave): Promise<any> {
        const { leaveIds, action, approveByUser, adminNote } = data;
        await db.query(`Call sp_student_leave_request_batch_user(?, ?, ?, ?, @p_messages_json)`, [leaveIds, action, approveByUser, adminNote]);
        return Message.callProcedureWithMessages();
    },
    
    async filter(data: StudentLeveFilter): Promise<any> {
        const { faculty, field, classId, student, status, startDate, endDate, search, page, limit } = data;
        return await db.query(`Call sp_student_leave_request_filter(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [ faculty, field, classId, student, status, startDate, endDate, search, page, limit]);
    },

}


