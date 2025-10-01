import { db } from "../../../config/db";
import { Course, Student } from "../../../types/interface";
import { Message } from "../../../utils/message";


export const StudentModel = {

    async getAll(page: number = 1, limit: number = 10): Promise<any> {
        const [result] = await db.query(`Call sp_student_get(?, ?, ?)`, [null, page, limit]);
        return result;
    },

    async getById(id: number): Promise<any> {
        const [result] = await db.query(`Call sp_student_get(?, ?, ?)`, [id, null, null]);
        return result;
    },

    async create(data: Student): Promise<any> {
        const {studentCode, studentNameEn, studentNameKh, dob, gender, email, phoneNumber, password, status, changedByUser, clientIp, sessionInfo } = data;
        await db.query(`Call sp_student_create(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @p_messages_json)`, [studentCode, studentNameKh, studentNameEn, dob, gender, email, phoneNumber, password, status, changedByUser, clientIp, sessionInfo]);
        return Message.callProcedureWithMessages();
    },

    async update(id: number, data: Student): Promise<any> {
         const {studentCode, studentNameEn, studentNameKh, dob, gender, email, phoneNumber, password, status, changedByUser, clientIp, sessionInfo } = data;
        await db.query(`Call sp_student_update(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @p_messages_json)`, [id, studentCode, studentNameKh, studentNameEn, dob, gender, email, phoneNumber, password, status, changedByUser, clientIp, sessionInfo]);
        return Message.callProcedureWithMessages();
    },

    async delete(id: number, data: Student): Promise<any> {
        const {changedByUser, clientIp, sessionInfo } = data;
        await db.query(`Call sp_student_delete(?, ?, ?, ?, @p_messages_json)`, [id, changedByUser, clientIp, sessionInfo]);
        return Message.callProcedureWithMessages();
    },

    async search(keyword: string, page: number = 1, limit: number = 10): Promise<any> {
        const [result] = await db.query( `Call sp_student_search(?, ?, ?)`, [keyword, page, limit]);
        return result;
    },
}


