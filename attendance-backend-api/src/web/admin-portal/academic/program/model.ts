import { db } from "../../../../config/db";
import { Program } from "../../../../types/interface";
import { Message } from "../../../../utils/message";


export const ProgramModel = {

    async getAll(page: number = 1, limit: number = 10): Promise<any> {
        const [result] = await db.query(`Call sp_program_get(?, ?, ?)`, [null, page, limit]);
        return result;
    },

    async getById(id: number): Promise<any> {
        const [result] = await db.query(`Call sp_program_get(?, ?, ?)`, [id, null, null]);
        return result;
    },

    async create(data: Program): Promise<any> {
        const {type, faculty, field, course, credits, promotionNo, termNo, status, changedByUser, clientIp, sessionInfo } = data;
        await db.query(`Call sp_program_create(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @p_messages_json)`, [type, faculty, field, course, credits, promotionNo, termNo, status, changedByUser, clientIp, sessionInfo]);
        return Message.callProcedureWithMessages();
    },

    async update(id: number, data: Program): Promise<any> {
         const {type, faculty, field, course, credits, promotionNo, termNo, status, changedByUser, clientIp, sessionInfo } = data;
        await db.query(`Call sp_program_update(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,@p_messages_json)`, [id, type, faculty, field, course, credits, promotionNo, termNo, status, changedByUser, clientIp, sessionInfo]);
        return Message.callProcedureWithMessages();
    },

    async delete(id: number, data: Program): Promise<any> {
        const {changedByUser, clientIp, sessionInfo } = data;
        await db.query(`Call sp_program_delete(?, ?, ?, ?, @p_messages_json)`, [id, changedByUser, clientIp, sessionInfo]);
        return Message.callProcedureWithMessages();
    },

    async search(keyword: string, page: number = 1, limit: number = 10): Promise<any> {
        const [result] = await db.query( `Call sp_program_search(?, ?, ?)`, [keyword, page, limit]);
        return result;
    },
}


