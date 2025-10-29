import { db } from "../../../index";


export const ClassListModel = {

    async getAll(): Promise<any> {
        const [result] = await db.query(`Call sp_class_list()`);
        return result;
    },

}


