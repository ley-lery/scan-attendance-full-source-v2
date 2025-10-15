import { db } from "../../../../index";

export const UserModel = {
    async getAll(page: number = 1, limit: number = 10): Promise<any> {
        const [result] = await db.query(`Call sp_user_get(?, ?, ?)`, [null, page, limit]);
        return result;
    },
    
    async getById(id: number): Promise<any> {
        const [result] = await db.query(`Call sp_user_get(?, ?, ?)`, [id, null, null]);
        return result;
    },
  
    async search(keyword: string, page: number = 1, limit: number = 10): Promise<any> {
        const [result] = await db.query(`Call sp_user_search(?, ?, ?)`, [keyword, page, limit]);
        return result;
    },
};
