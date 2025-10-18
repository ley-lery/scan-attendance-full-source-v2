import { db } from "../../../../config/db";
import { Message } from "../../../../utils";

interface ParameterData {
    faculty: number | null,
    field: number | null,
    classId: number | null,
    course: number | null,
    student: number | null,
    promotionNo: number | null,
    termNo: number,
    programType: string | null,
    gender: string | null,
    studentStatus: string | null,
    searchKeyword: string | null,
    sessionNo: string | null,
    page: number,
    limit: number
} // 14 parameters

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

export const AdminMarkAttStudentModel = {

    async getAll(): Promise<any> {
        const [result] = await db.query(`Call sp_admin_student_attendance_list_by_filters(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [null, null, null, null, null, null, null, null, null, null, null,'s1', 1, 10]);
        return result;
    },
    async filter(data: ParameterData): Promise<any> {
        const { faculty, field, classId, course, student, promotionNo, termNo, programType, gender, studentStatus, searchKeyword, sessionNo, page, limit } = data;
        const [result] = await db.query(
            `Call sp_admin_student_attendance_list_by_filters(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [faculty, field, classId, course, student, promotionNo, termNo, programType, gender, studentStatus, searchKeyword, sessionNo, page, limit]
        );
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


