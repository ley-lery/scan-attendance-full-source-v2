import { db } from "../../../config/db";
import { Field } from "../../../types/interface";
import { Message } from "../../../utils/message";


export const FieldModel = {
    async search(keyword: string, page: number = 1, limit: number = 10): Promise<any> {
        const [result] = await db.query( `Call sp_field_search(?, ?, ?)`, [keyword, page, limit]);
        return result;
    },

    async getAll(page: number = 1, limit: number = 10): Promise<any> {
        const [result] = await db.query(`Call sp_field_get(?, ?, ?)`, [null, page, limit]);
        return result;
    },

    async getById(id: number): Promise<any> {
        const [result] = await db.query(`Call sp_field_get(?, ?, ?)`, [id, null, null]);
        return result;
    },

    async create(data: Field): Promise<any> {
        const {faculty, fieldCode, fieldNameKh, fieldNameEn, status} = data;
        await db.query(`Call sp_field_create(?, ?, ?, ?, ?, @p_messages_json)`,  [faculty ,fieldCode, fieldNameKh, fieldNameEn, status]);
        return Message.callProcedureWithMessages();
    },

    async update(id: number, data: Field): Promise<any> {
        const {faculty, fieldCode, fieldNameKh, fieldNameEn, status} = data;
        await db.query(`Call sp_field_update(?, ?, ?, ?, ?, ?, @p_messages_json)`, [id, faculty ,fieldCode, fieldNameKh, fieldNameEn, status, status]);
        return Message.callProcedureWithMessages();
    },

    async delete(id: number): Promise<any> {
        await db.query(`Call sp_feild_delete(?, @p_messages_json)`, [id]);
        return Message.callProcedureWithMessages();
    }
}


