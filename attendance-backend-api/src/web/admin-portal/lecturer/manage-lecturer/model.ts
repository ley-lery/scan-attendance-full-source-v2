import { db } from "../../../../config/db";
import { Lecturer } from "../../../../types/interface";
import { Message } from "../../../../utils/message";


export const LecturerModel = {

    async getAll(page: number = 1, limit: number = 10): Promise<any> {
        const [result] = await db.query(`Call sp_lecturer_get(?, ?, ?)`, [null, page, limit]);
        return result;
    },

    async getById(id: number): Promise<any> {
        const [result] = await db.query(`Call sp_lecturer_get(?, ?, ?)`, [id, null, null]);
        return result;
    },

    async create(data: Lecturer): Promise<any> {
        const {lecturerCode, lecturerNameEn, lecturerNameKh, dob, gender, phone, email, password, status, changedByUser, clientIp, sessionInfo } = data;
        await db.query(`Call sp_lecturer_create(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @p_messages_json)`, [lecturerCode, lecturerNameKh, lecturerNameEn, dob, gender, phone, email, password, status, changedByUser, clientIp, sessionInfo]);
        return Message.callProcedureWithMessages();
    },

    async update(id: number, data: Lecturer): Promise<any> {
         const {lecturerCode, lecturerNameEn, lecturerNameKh, dob, gender, phone, email, password, status, changedByUser, clientIp, sessionInfo } = data;
        await db.query(`Call sp_lecturer_update(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @p_messages_json)`, [id, lecturerCode, lecturerNameKh, lecturerNameEn, dob, gender, phone, email, password, status, changedByUser, clientIp, sessionInfo]);
        return Message.callProcedureWithMessages();
    },

    async delete(id: number, data: Lecturer): Promise<any> {
        const {changedByUser, clientIp, sessionInfo } = data;
        await db.query(`Call sp_lecturer_delete(?, ?, ?, ?, @p_messages_json)`, [id, changedByUser, clientIp, sessionInfo]);
        return Message.callProcedureWithMessages();
    },

    async search(keyword: string, page: number = 1, limit: number = 10): Promise<any> {
        const [result] = await db.query( `Call sp_lecturer_search(?, ?, ?)`, [keyword, page, limit]);
        return result;
    },
}


