import { db } from "../../../config/db";


export const LecturerCourseModel = {

    async getAll(lecturerId: number, page: number = 1, limit: number = 10): Promise<any> {
        const [result] = await db.query(`Call sp_lecturer_courses_get(?, ?, ?)`, [lecturerId, page, limit]);
        return result;
    },

}


