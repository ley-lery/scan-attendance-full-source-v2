import { db } from "../../../../config/db";
import { BatchLeave, LecturerMangeStudentLeave, LectureStudentLeveFilter } from "../../../../types/interface";
import { Message } from "../../../../utils/message";

export const LecturerManageStudentLeaveModel = {

    async getAll(lecturer: number, page: number = 1, limit: number = 10): Promise<any> {
        const [result] = await db.query(`Call sp_lecturer_student_leave_filter_list(?, ?, ?, ?, ?, ?, ?)`, [lecturer, null, null, null, null, page, limit]);
        return result;
    },

    async getById(id: number): Promise<any> {
        const [result] = await db.query(`Call sp_student_leave_request_get_lecturer(?, ?, ?)`, [id, null, null]);
        return result;
    },

    async approveLeave(data: LecturerMangeStudentLeave): Promise<any> {
        const { leaveId, approveByLecturer, adminNote } = data;
        await db.query(`Call sp_student_leave_request_approve_lecturer(?, ?, ?, @p_messages_json)`, [leaveId, approveByLecturer, adminNote]);
        return Message.callProcedureWithMessages();
    },

    async rejectLeave(data: LecturerMangeStudentLeave): Promise<any> {
        const { leaveId, approveByLecturer, adminNote } = data;
        await db.query(`Call sp_student_leave_request_reject_lecturer(?, ?, ?, @p_messages_json)`, [leaveId, approveByLecturer, adminNote]);
        return Message.callProcedureWithMessages();
    },

    // Multi approve/reject
    async batchLeave(data: BatchLeave): Promise<any> {
        const { leaveIds, action, approveByUser, adminNote } = data;
        await db.query(`Call sp_student_leave_request_batch_lecturer(?, ?, ?, ?, @p_messages_json)`, [leaveIds, action, approveByUser, adminNote]);
        return Message.callProcedureWithMessages();
    },
    
    async filter(lecturer: number, data: LectureStudentLeveFilter): Promise<any> {
        const { course, status, startDate, endDate, page, limit } = data;
        return await db.query(`Call sp_lecturer_student_leave_filter_list(?, ?, ?, ?, ?, ?, ?)`, [ lecturer, course, status, startDate, endDate, page, limit]);
    },

}


