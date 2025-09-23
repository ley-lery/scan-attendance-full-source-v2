import { db } from "../../../config/db";
import { LecturerCourse } from "../../../types/interface";
import { Message } from "../../../utils/message";

export const LecturerCourseModel = {
    async search(keyword: string, page: number = 1, limit: number = 10): Promise<any> {
        const [result] = await db.query( `Call sp_search_lecturer_course(?, ?, ?)`, [keyword, page, limit]);
        return result;
    },

    async getAll(page: number = 1, limit: number = 10): Promise<any> {
        const [result] = await db.query(`Call sp_lecturer_course_get(?, ?, ?)`, [null, page, limit]);
        return result;
    },

    async getById(id: number): Promise<any> {
        const [result] = await db.query(`Call sp_lecturer_course_get(?, ?, ?)`, [id, null, null]);
        return result;
    },

    async create(data: LecturerCourse): Promise<any> {
        await db.query(`Call sp_lecturer_course_create(?, ?, @p_messages_json)`,  [data.lecturer, data.course]);
        return Message.callProcedureWithMessages();
    },

    async update(id: number, data: LecturerCourse): Promise<any> {
        await db.query(`Call sp_lecturer_course_update(?, ?, ?, @p_messages_json)`, [id, data.lecturer, data.course]);
        return Message.callProcedureWithMessages();
    },

    async delete(id: number): Promise<any> {
        await db.query(`Call sp_lecturer_course_delete(?, @p_messages_json)`, [id]);
        return Message.callProcedureWithMessages();
    }
}


