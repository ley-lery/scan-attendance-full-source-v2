import { db } from "../../../index";


export const FieldListModel = {

    async getAll(): Promise<any> {
        const [result] = await db.query(`Call sp_field_list()`);
        return result;
    },

}


