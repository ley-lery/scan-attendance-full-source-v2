import { db } from "../../../config/db";
import { Permission } from "../../../types/interface";
import { Message } from "../../../utils/message";

export const PermissionModel = {
    async getAll(page: number = 1, limit: number = 10): Promise<any> {
        const [result] = await db.query(`Call sp_permission_get(?, ?, ?)`, [null, page, limit]);
        return result;
    },
    async getFull(): Promise<any> {
        const [result] = await db.query(`Call sp_permission_get_all()`, []);
        return result;
    },
    async getById(id: number): Promise<any> {
        const [result] = await db.query(`Call sp_permission_get(?, ?, ?)`, [id, null, null]);
        return result;
    },
    async create(data: Permission): Promise<any> {
        const { name, description, changedByUser, clientIp, sessionInfo } = data;
        await db.query(`Call sp_permission_create(?, ?, ?, ?, ?, @p_messages_json)`, [name, description, changedByUser, clientIp, sessionInfo]);
        return Message.callProcedureWithMessages();
    },
    async generate(data: { table: string }, auditLog: { changedByUser: string, clientIp: string, sessionInfo: string }): Promise<any> {
        const { table } = data;
        const { changedByUser, clientIp, sessionInfo } = auditLog;
        await db.query(`Call sp_permission_generate(?, ?, ?, ?, @p_messages_json)`, [table, changedByUser, clientIp, sessionInfo]);
        return Message.callProcedureWithMessages();
    },
    async update(id: number, data: Permission): Promise<any> {
        const { name, description, changedByUser, clientIp, sessionInfo } = data;
        await db.query(`Call sp_permission_update(?, ?, ?, ?, ?, ?, @p_messages_json)`, [id, name, description, changedByUser, clientIp, sessionInfo]);
        return Message.callProcedureWithMessages();
    },
    async delete(id: number, data: Permission): Promise<any> {
        const { changedByUser, clientIp, sessionInfo } = data;
        await db.query(`Call sp_permission_delete(?, ?, ?, ?, @p_messages_json)`, [id, changedByUser, clientIp, sessionInfo]);
        return Message.callProcedureWithMessages();
    },
    async search(keyword: string, page: number = 1, limit: number = 10): Promise<any> {
        const [result] = await db.query(`Call sp_permission_search(?, ?, ?)`, [keyword, page, limit]);
        return result;
    },
};
