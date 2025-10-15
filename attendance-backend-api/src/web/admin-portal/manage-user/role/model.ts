import { db } from "../../../../config/db";
import { Role } from "../../../../types/interface";
import { Message } from "../../../../utils/message";

export const RoleModel = {
    async getAll(page: number = 1, limit: number = 10): Promise<any> {
        const [result] = await db.query(`Call sp_role_get(?, ?, ?)`, [null, page, limit]);
        return result;
    },
    async getById(id: number): Promise<any> {
        const [result] = await db.query(`Call sp_role_get(?, ?, ?)`, [id, null, null]);
        return result;
    },
    async create(data: Role): Promise<any> {
        const { name, description, changedByUser, clientIp, sessionInfo } = data;
        await db.query(`Call sp_role_create(?, ?, ?, ?, ?, @p_messages_json)`, [name, description, changedByUser, clientIp, sessionInfo]);
        return Message.callProcedureWithMessages();
    },
    async update(id: number, data: Role): Promise<any> {
        const { name, description, changedByUser, clientIp, sessionInfo } = data;
        await db.query(`Call sp_role_update(?, ?, ?, ?, ?, ?, @p_messages_json)`, [id, name, description, changedByUser, clientIp, sessionInfo]);
        return Message.callProcedureWithMessages();
    },
    async delete(id: number, data: Role): Promise<any> {
        const { changedByUser, clientIp, sessionInfo } = data;
        await db.query(`Call sp_role_delete(?, ?, ?, ?, @p_messages_json)`, [id, changedByUser, clientIp, sessionInfo]);
        return Message.callProcedureWithMessages();
    },
    async search(keyword: string, page: number = 1, limit: number = 10): Promise<any> {
        const [result] = await db.query(`Call sp_role_search(?, ?, ?)`, [keyword, page, limit]);
        return result;
    },
};
