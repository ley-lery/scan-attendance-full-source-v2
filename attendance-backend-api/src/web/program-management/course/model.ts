import { db } from "../../../config/db";
import { Course } from "../../../types/interface";
import { Message } from "../../../utils/message";

export const CourseModel = {
    async search(keyword: string, page: number = 1, limit: number = 10): Promise<any> {
        const [result] = await db.query( `Call sp_search_course(?, ?, ?)`, [keyword, page, limit]);
        return result;
    },

    async getAll(page: number = 1, limit: number = 10): Promise<any> {
        const [result] = await db.query(`Call sp_course_get(?, ?, ?)`, [null, page, limit]);
        return result;
    },

    async getById(id: number): Promise<any> {
        const [result] = await db.query(`Call sp_course_get(?, ?, ?)`, [id, null, null]);
        return result;
    },

    async create(data: Course): Promise<any> {
        const {courseCode, courseNameKh, courseNameEn, status} = data;
        await db.query(`Call sp_course_create(?, ?, ?, ?, @p_messages_json)`,  [courseCode, courseNameKh, courseNameEn, status]);
        return Message.callProcedureWithMessages();
    },

    async update(id: number, data: Course): Promise<any> {
        const {courseCode, courseNameKh, courseNameEn, status} = data;
        await db.query(`Call sp_course_update(?, ?, ?, ?, ?, @p_messages_json)`, [id, courseCode, courseNameKh, courseNameEn, status, status]);
        return Message.callProcedureWithMessages();
    },

    async delete(id: number): Promise<any> {
        await db.query(`Call sp_course_delete(?, @p_messages_json)`, [id]);
        return Message.callProcedureWithMessages();
    }
}


