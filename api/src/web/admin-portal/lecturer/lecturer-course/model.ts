import { db } from "../../../../config/db";
import { LecturerCourse } from "../../../../types/interface";
import { Message } from "../../../../utils/message";


export const LecturerCourseModel = {

    async getAll(page: number = 1, limit: number = 10): Promise<any> {
        const [result] = await db.query(`Call sp_lecturer_course_get(?, ?, ?)`, [null, page, limit]);
        return result;
    },

    async getById(id: number): Promise<any> {
        const [result] = await db.query(`Call sp_lecturer_course_get(?, ?, ?)`, [id, null, null]);
        return result;
    },

    async create(data: LecturerCourse): Promise<any> {
        const { lecturer, course, changedByUser, clientIp, sessionInfo } = data;
        await db.query(`Call sp_lecturer_course_create(?, ?, ?, ?, ?, @p_messages_json)`, [lecturer, course, changedByUser, clientIp, sessionInfo]);
        return Message.callProcedureWithMessages();
    },

    async update(id: number, data: LecturerCourse): Promise<any> {
         const {lecturer, course, changedByUser, clientIp, sessionInfo } = data;
        await db.query(`Call sp_lecturer_course_update(?, ?, ?, ?, ?, ?, @p_messages_json)`, [id, lecturer, course, changedByUser, clientIp, sessionInfo]);
        return Message.callProcedureWithMessages();
    },

    async delete(id: number, data: LecturerCourse): Promise<any> {
        const {changedByUser, clientIp, sessionInfo } = data;
        await db.query(`Call sp_lecturer_course_delete(?, ?, ?, ?, @p_messages_json)`, [id, changedByUser, clientIp, sessionInfo]);
        return Message.callProcedureWithMessages();
    },

    async search(keyword: string, page: number = 1, limit: number = 10): Promise<any> {
        const [result] = await db.query( `Call sp_lecturer_course_search(?, ?, ?)`, [keyword, page, limit]);
        return result;
    },
}


