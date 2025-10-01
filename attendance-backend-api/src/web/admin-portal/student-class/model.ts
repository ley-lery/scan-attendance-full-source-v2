import { db } from "../../../config/db";
import { StudentClass } from "../../../types/interface";
import { Message } from "../../../utils/message";


export const StudentClassModel = {

    async getAll(page: number = 1, limit: number = 10): Promise<any> {
        const [result] = await db.query(`Call sp_class_student_get(?, ?, ?)`, [null, page, limit]);
        return result;
    },

    async getById(id: number): Promise<any> {
        const [result] = await db.query(`Call sp_class_student_get(?, ?, ?)`, [id, null, null]);
        return result;
    },

    async create(data: StudentClass): Promise<any> {
        const { classId, studentId, status, changedByUser, clientIp, sessionInfo } = data;
        await db.query(`Call sp_class_student_create(?, ?, ?, ?, ?, ?, @p_messages_json)`, [classId, studentId, status, changedByUser, clientIp, sessionInfo]);
        return Message.callProcedureWithMessages();
    },

    async update(id: number, data: StudentClass): Promise<any> {
         const { classId, studentId, status, changedByUser, clientIp, sessionInfo } = data;
        await db.query(`Call sp_class_student_update(?, ?, ?, ?, ?, ?, ?, @p_messages_json)`, [id, classId, studentId, status, changedByUser, clientIp, sessionInfo]);
        return Message.callProcedureWithMessages();
    },

    async delete(id: number, data: StudentClass): Promise<any> {
        const { changedByUser, clientIp, sessionInfo } = data;
        await db.query(`Call sp_class_student_delete(?, ?, ?, ?, @p_messages_json)`, [id, changedByUser, clientIp, sessionInfo]);
        return Message.callProcedureWithMessages();
    },

    async search(keyword: string, page: number = 1, limit: number = 10): Promise<any> {
        const [result] = await db.query( `Call sp_class_student_search(?, ?, ?)`, [keyword, page, limit]);
        return result;
    },
}


