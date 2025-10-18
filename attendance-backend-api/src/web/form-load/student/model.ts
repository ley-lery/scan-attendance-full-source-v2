import { db } from "../../../index";


export const StudentListModel = {

    async getAll(): Promise<any> {
        const [result] = await db.query(`Call sp_student_list()`);
        return result;
    },

}


