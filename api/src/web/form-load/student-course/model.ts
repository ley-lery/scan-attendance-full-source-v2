import { db } from "../../../index";


export const StudentCourseListModel = {

    async getAll(student: number): Promise<any> {
        const [result] = await db.query(`Call sp_courses_of_student_list(?)`, [student]);
        return result;
    },

}


