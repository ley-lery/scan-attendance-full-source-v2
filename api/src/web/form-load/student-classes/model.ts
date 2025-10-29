import { db } from "../../../index";


export const StudentClassesModel = {

    async getAll(student: number): Promise<any> {
        const [result] = await db.query(`Call sp_classes_of_student_list(?)`, [student]);
        return result;
    },

}


