import { db } from "../../../config/db";
import { UserRole } from "../../../types/interface";
import { Message } from "../../../utils/message";

export const UserRoleModel = {
    async getAll(page: number = 1, limit: number = 10): Promise<any> {
        const [result] = await db.query(`Call sp_user_role_get(?, ?, ?)`, [null, page, limit]);
        return result;
    },
    async getById(id: number): Promise<any> {
        const [result] = await db.query(`Call sp_user_role_get(?, ?, ?)`, [id, null, null]);
        return result;
    },
    async create(data: UserRole): Promise<any> {
        const { user, role } = data;
        await db.query(`Call sp_user_role_create(?, ?, @p_messages_json)`, [user, role]);
        return Message.callProcedureWithMessages();
    },
    async update(id: number, data: UserRole): Promise<any> {
        const { user, role } = data;
        await db.query(`Call sp_user_role_update(?, ?, ?, @p_messages_json)`, [id, user, role]);
        return Message.callProcedureWithMessages();
    },
    async delete(id: number): Promise<any> {
        await db.query(`Call sp_user_role_delete(?, @p_messages_json)`, [id]);
        return Message.callProcedureWithMessages();
    },
    async search(keyword: string, page: number = 1, limit: number = 10): Promise<any> {
        const [result] = await db.query(`Call sp_user_role_search(?, ?, ?, ?)`, [keyword, page, limit]);
        return result;
    },
};
