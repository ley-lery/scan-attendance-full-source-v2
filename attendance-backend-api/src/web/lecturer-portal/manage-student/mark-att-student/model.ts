import { db } from "../../../../config/db";
import { Message } from "../../../../utils";

type Fields = {
    course: number
    session: number
    page: number
    limit: number
}

type MarkSingleRecord = {
    classId: number
    course: number
    student: number
    session: number
    status: string
}

type MarkMultiRecord = {
    classId: number
    course: number
    session: number
    attData: [
        {
            student: number,
            status: string
        }
    ]
}

export const MarkAttStudentModel = {

    async getAll(lecturerId: number, data: Fields): Promise<any> {
        const { course, session, page, limit } = data;
        const [result] = await db.query(`Call sp_lecturer_student_list_by_course(?, ?, ?, ?, ?)`, [lecturerId, course, session, page, limit]);
        return result;
    },
    async markSingleRecord(data: MarkSingleRecord): Promise<any> {
        const { classId, course, student, session, status } = data;
        await db.query(`Call sp_attendance_record_mark_single(?, ?, ?, ?, ?, @p_messages_json)`, [classId, course, student, session, status]);
        return Message.callProcedureWithMessages();
    },

    async markMultiRecord(data: MarkMultiRecord): Promise<any> {
        const { classId, course, session, attData } = data;
        await db.query(
            `CALL sp_attendance_record_mark_multi(?, ?, ?, ?, @p_messages_json)`,
            [classId, course, session, JSON.stringify(attData)]
        );
        return Message.callProcedureWithMessages();
    },

}


