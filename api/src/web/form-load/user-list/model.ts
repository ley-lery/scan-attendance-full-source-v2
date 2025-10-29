import { db } from "../../../index";


export const UserListModel = {

    async getAll(): Promise<any> {
        const [result] = await db.query(`Call sp_user_list()`);
        return result;
    },

}


