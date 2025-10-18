import { db } from "../../../index";


export const CourseProgramListModel = {

    async getAll(): Promise<any> {
        const [result] = await db.query(`Call sp_course_full_list()`);
        return result;
    },

}


