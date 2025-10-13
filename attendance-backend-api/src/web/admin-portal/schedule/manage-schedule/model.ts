import { db } from "../../../../config/db";
import { Schedule, ScheduleUpdate } from "../../../../types/interface";
import { Message } from "../../../../utils/message";


export const ScheduleModel = {

    async createSchedule(data: Schedule): Promise<any> {
        const {classId, startDate, endDate, sessions } = data;
        await db.query(`Call sp_class_schedule_create(?, ?, ?, ?, @p_messages_json)`, [classId, startDate, endDate, JSON.stringify(sessions)]);
        return Message.callProcedureWithMessages();
    },

    async update(id: number, data: ScheduleUpdate): Promise<any> {
        const { startDate, endDate, sessions } = data;
        await db.query(`Call sp_class_schedule_update(?, ?, ?, ?, @p_messages_json)`, [id, startDate, endDate, JSON.stringify(sessions)]);
        return Message.callProcedureWithMessages();
    },

    async getAllClassSchedule(page: number = 1, limit: number = 10): Promise<any> {
        const [result] = await db.query(`Call sp_class_schedule_get_admin(?, ?, ?)`, [null, page, limit]);
        return result;
    },
    
    async getClassSchedule(classId: number): Promise<any> {
        const [result] = await db.query(`Call sp_class_schedule_get(?)`, [classId]);
        return result;
    },
    
    async getStudentSchedule(studentId: number): Promise<any> {
        const [result] = await db.query(`Call sp_student_schedules_get(?)`, [studentId]);
        return result;
    },

}


