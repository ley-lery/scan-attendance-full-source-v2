import { db } from "../../../index";


export const LecturerCourseListModel = {

    async getAll(): Promise<any> {
        const [result] = await db.query(`Call sp_course_of_lecturer_list()`);
        return result;
    },

}


