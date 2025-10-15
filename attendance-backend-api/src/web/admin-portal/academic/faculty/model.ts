import { db, Message } from "../../../../index";
import { Faculty } from "../../../../types/interface";


export const FacultyModel = {

    async getAll(page: number = 1, limit: number = 10): Promise<any> {
        const [result] = await db.query(`Call sp_faculty_get(?, ?, ?)`, [null, page, limit]);
        return result;
    },

    async getById(id: number): Promise<any> {
        const [result] = await db.query(`Call sp_faculty_get(?, ?, ?)`, [id, null, null]);
        return result;
    },

    async create(data: Faculty): Promise<any> {
        const {facultyCode, facultyNameEn, facultyNameKh, status, changedByUser, clientIp, sessionInfo} = data;
        await db.query(`Call sp_faculty_create(?, ?, ?, ?, ?, ?, ?, @p_messages_json)`, [facultyCode, facultyNameKh, facultyNameEn, status, changedByUser, clientIp, sessionInfo]);
        return Message.callProcedureWithMessages();
    },

    async update(id: number, data: Faculty): Promise<any> {
        const {facultyCode, facultyNameEn, facultyNameKh, status, changedByUser, clientIp, sessionInfo} = data;
        await db.query(`Call sp_faculty_update(?, ?, ?, ?, ?, ?, ?, ?, @p_messages_json)`, [id, facultyCode, facultyNameKh, facultyNameEn, status, changedByUser, clientIp, sessionInfo]);
        return Message.callProcedureWithMessages();
    },

    async delete(id: number, data: Faculty): Promise<any> {
        const {changedByUser, clientIp, sessionInfo} = data;
        await db.query(`Call sp_faculty_delete(?, ?, ?, ?, @p_messages_json)`, [id, changedByUser, clientIp, sessionInfo]);
        return Message.callProcedureWithMessages();
    },

    async search(keyword: string, page: number = 1, limit: number = 10): Promise<any> {
        const [result] = await db.query( `Call sp_faculty_search(?, ?, ?)`, [keyword, page, limit]);
        return result;
    },
}


