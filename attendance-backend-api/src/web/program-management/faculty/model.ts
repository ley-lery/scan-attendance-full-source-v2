import { db } from "../../../config/db";
import { Faculty } from "../../../types/interface";
import { Message } from "../../../utils/message";


export const FacultyModel = {
    async search(keyword: string, page: number = 1, limit: number = 10): Promise<any[]> {
        const [results]: any = await db.query(`CALL sp_faculty_search(?, ?, ?)`, [keyword, page, limit]);
        return results;
    },

    async getAll(page: number = 1, limit: number = 10): Promise<any> {
        const [result] = await db.query(`Call sp_faculty_get(?, ?, ?)`, [null, page, limit]);
        return result;
    },

    async getById(id: number): Promise<any> {
        const [result] = await db.query(`Call sp_faculty_get(?, ?, ?)`, [id, null, null]);
        return result;
    },

    async create(data: Faculty): Promise<any> {
        const {facultyCode, facultyNameKh, facultyNameEn, status} = data;
        await db.query(`Call sp_faculty_create(?, ?, ?, ?, @p_messages_json)`,  [ facultyCode, facultyNameKh, facultyNameEn, status]);
        return Message.callProcedureWithMessages();
    },

    async update(id: number, data: Faculty): Promise<any> {
        const {facultyCode, facultyNameKh, facultyNameEn, status} = data;
        await db.query(`Call sp_faculty_update(?, ?, ?, ?, ?, @p_messages_json)`, [id, facultyCode, facultyNameKh, facultyNameEn, status]);
        return Message.callProcedureWithMessages();
    },

    async delete(id: number): Promise<any> {
        await db.query(`Call sp_faculty_delete(?, @p_messages_json)`, [id]);
        return Message.callProcedureWithMessages();
    }
}


