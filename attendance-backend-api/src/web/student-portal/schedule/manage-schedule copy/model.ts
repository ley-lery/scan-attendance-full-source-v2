import { db } from "../../../config/db";
import { Class } from "../../../types/interface";
import { Message } from "../../../utils/message";


export const ClassModel = {

    async getAll(page: number = 1, limit: number = 10): Promise<any> {
        const [result] = await db.query(`Call sp_class_get(?, ?, ?)`, [null, page, limit]);
        return result;
    },

    async getById(id: number): Promise<any> {
        const [result] = await db.query(`Call sp_class_get(?, ?, ?)`, [id, null, null]);
        return result;
    },

    async create(data: Class): Promise<any> {
        const {programType, faculty, field, promotionNo, termNo, className, roomName, status, changedByUser, clientIp, sessionInfo } = data;
        await db.query(`Call sp_class_create(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @p_messages_json)`, [programType, faculty, field, promotionNo, termNo, className, roomName, status, changedByUser, clientIp, sessionInfo]);
        return Message.callProcedureWithMessages();
    },

    async update(id: number, data: Class): Promise<any> {
         const {programType, faculty, field, promotionNo, termNo, className, roomName, status, changedByUser, clientIp, sessionInfo } = data;
        await db.query(`Call sp_class_update(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @p_messages_json)`, [id, programType, faculty, field, promotionNo, termNo, className, roomName, status, changedByUser, clientIp, sessionInfo]);
        return Message.callProcedureWithMessages();
    },

    async delete(id: number, data: Class): Promise<any> {
        const {changedByUser, clientIp, sessionInfo } = data;
        await db.query(`Call sp_class_delete(?, ?, ?, ?, @p_messages_json)`, [id, changedByUser, clientIp, sessionInfo]);
        return Message.callProcedureWithMessages();
    },

    async search(keyword: string, page: number = 1, limit: number = 10): Promise<any> {
        const [result] = await db.query( `Call sp_class_search(?, ?, ?)`, [keyword, page, limit]);
        return result;
    },
}


