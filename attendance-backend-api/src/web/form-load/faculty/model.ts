import { db } from "../../../index";


export const FacultyListModel = {

    async getAll(): Promise<any> {
        const [result] = await db.query(`Call sp_faculty_list()`);
        return result;
    },

}


