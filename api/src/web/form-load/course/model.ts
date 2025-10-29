import { db } from "../../../index";


export const CourseListModel = {

    async getAll(): Promise<any> {
        const [result] = await db.query(`Call sp_course_list()`);
        return result;
    },

}


