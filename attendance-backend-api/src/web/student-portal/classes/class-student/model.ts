import { db } from "../../../../index";


export const ClassStudentModel = {

    async getAll(student: number, page: number = 1, limit: number = 10): Promise<any> {
        const [result] = await db.query(`Call sp_class_student_specific_get(?, ?, ?, ?)`, [null, student, page, limit]);
        return result;
    },

    async getById(id: number, student: number): Promise<any> {
        const [result] = await db.query(`Call sp_class_student_specific_get(?, ?, ?, ?)`, [id, student, null, null]);
        return result;
    },

}


