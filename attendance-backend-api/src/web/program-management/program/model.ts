import { db } from "../../../config/db";
import { Program } from "../../../types/interface";
import { Message } from "../../../utils/message";


export const ProgramModel = {
    async search(keyword: string, page: number = 1, limit: number = 10): Promise<any> {
        const [result] = await db.query( `Call sp_search_program(?, ?, ?)`, [keyword, page, limit]);
        return result;
    },

    async getAll(page: number = 1, limit: number = 10): Promise<any> {
        const [result] = await db.query(`Call sp_program_get(?, ?, ?)`, [null, page, limit]);
        return result;
    },

    async getById(id: number): Promise<any> {
        const [result] = await db.query(`Call sp_program_get(?, ?, ?)`, [id, null, null]);
        return result;
    },

    async create(data: Program): Promise<any> {
        const {faculty, field, course, promotionNo, termNo,  credits, status} = data;
        await db.query(`Call sp_Program_create(?, ?, ?, ?, ?, ?, ?, @p_messages_json)`,  [faculty, field, course, promotionNo, termNo,  credits, status]);
        return Message.callProcedureWithMessages();
    },
    
    async update(id: number, data: Program): Promise<any> {
        const {faculty, field, course, promotionNo, termNo,  credits, status} = data;
        await db.query(`Call sp_Program_update(?, ?, ?, ?, ?, ?, ?, ?, @p_messages_json)`, [id, faculty, field, course, promotionNo, termNo,  credits, status]);
        return Message.callProcedureWithMessages();
    },

    async delete(id: number): Promise<any> {
        await db.query(`Call sp_feild_delete(?, @p_messages_json)`, [id]);
        return Message.callProcedureWithMessages();
    }
}


