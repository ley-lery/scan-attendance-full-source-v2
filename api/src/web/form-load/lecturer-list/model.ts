import { db } from "../../../index";


export const LecturerListModel = {

    async getAll(): Promise<any> {
        const [result] = await db.query(`Call sp_lecturer_list()`);
        return result;
    },

}


