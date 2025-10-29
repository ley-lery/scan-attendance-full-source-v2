import { db } from "../../../../config/db";

export const ScheduleModel = {
    
    async getStudentSchedule(studentId: number): Promise<any> {
        const [result] = await db.query(`Call sp_student_schedules_get(?)`, [studentId]);
        return result;
    },
 
}


