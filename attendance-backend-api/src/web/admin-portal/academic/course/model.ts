import { db, Message } from "../../../../index";
import { Course } from "../../../../types/interface";


export const CourseModel = {

    async getAll(page: number = 1, limit: number = 10): Promise<any> {
        const [result] = await db.query(`Call sp_course_get(?, ?, ?)`, [null, page, limit]);
        return result;
    },

    async getById(id: number): Promise<any> {
        const [result] = await db.query(`Call sp_course_get(?, ?, ?)`, [id, null, null]);
        return result;
    },

    async create(data: Course): Promise<any> {
        const {courseCode, courseNameEn, courseNameKh, status, changedByUser, clientIp, sessionInfo } = data;
        await db.query(`Call sp_course_create(?, ?, ?, ?, ?, ?, ?, @p_messages_json)`, [courseCode, courseNameKh, courseNameEn, status, changedByUser, clientIp, sessionInfo]);
        return Message.callProcedureWithMessages();
    },

    async update(id: number, data: Course): Promise<any> {
         const {courseCode, courseNameEn, courseNameKh, status, changedByUser, clientIp, sessionInfo } = data;
        await db.query(`Call sp_course_update(?, ?, ?, ?, ?, ?, ?, ?, @p_messages_json)`, [id, courseCode, courseNameKh, courseNameEn, status, changedByUser, clientIp, sessionInfo]);
        return Message.callProcedureWithMessages();
    },

    async delete(id: number, data: Course): Promise<any> {
        const {changedByUser, clientIp, sessionInfo } = data;
        await db.query(`Call sp_course_delete(?, ?, ?, ?, @p_messages_json)`, [id, changedByUser, clientIp, sessionInfo]);
        return Message.callProcedureWithMessages();
    },

    async search(keyword: string, page: number = 1, limit: number = 10): Promise<any> {
        const [result] = await db.query( `Call sp_course_search(?, ?, ?)`, [keyword, page, limit]);
        return result;
    },
}


