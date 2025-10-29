import { db, Message } from "../../index";

type ScanData = {
    classId: number | null,
    studentId: number | null,
    dayOfWeek: string | null,
    targetTime: string | null
}

export const ScanModel = {

    async getClass(classId: number): Promise<any> {
        const [result] = await db.query(`Call sp_get_class_info(?)`, [classId]);
        return result;
    },

    async getSessionAndProcess(data: ScanData): Promise<any> {
        const { classId, studentId, dayOfWeek, targetTime } = data;
        await db.query(`Call sp_get_session_and_process_attendance(?, ?, ?, ?, @p_messages_json)`, [classId, studentId, dayOfWeek, targetTime]);
        return Message.callProcedureWithMessages();
        
    },

    
}


