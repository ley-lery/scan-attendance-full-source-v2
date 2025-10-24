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
interface FullParameterData {
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
    page: number,
    limit: number
} // 13 parameters

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
            classAtt: number,
            status: string
        }
    ]
}

type MarkBulkRecord = {
    bulkData: [
        {
            attendanceId: number,
            classId: number,
            courseId: number,
            attData: [
                {status: string, session: string},
            ]
        }
    ]
};

export const AdminMarkAttStudentModel = {

    async getAll(page: number, limit: number): Promise<any> {
        const [result] = await db.query(`Call sp_admin_student_attendance_list_by_filters(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [null, null, null, null, null, null, null, null, null, null, null,'s1', page, limit]);
        return result;
    },
    async getFullSessions(page: number, limit: number): Promise<any> {
        const [result] = await db.query(`Call sp_admin_student_attendance_full_list_filter(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [null, null, null, null, null, null, null, null, null, null, null, page, limit]);
        return result;
    },
    async getStudentSessionDetail(data: {course: number, student: number}): Promise<any> {
        const { course, student } = data;
        const [result] = await db.query(`Call sp_admin_student_attendance_session_detail_get(?, ?)`, [course, student]);
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
    async getFullSessionsFilter(data: FullParameterData): Promise<any> {
        const { faculty, field, classId, course, student, promotionNo, termNo, programType, gender, studentStatus, searchKeyword, page, limit } = data;
        const [result] = await db.query(
            `Call sp_admin_student_attendance_full_list_filter(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [faculty, field, classId, course, student, promotionNo, termNo, programType, gender, studentStatus, searchKeyword, page, limit]
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

        const formatted = attData.map(item => ({
            class_attendance_id: item.classAtt,
            status: item.status
        }));

        await db.query(
            `CALL sp_attendance_record_mark_multi(?, ?, ?, ?, @p_messages_json)`,
            [classId, course, session, JSON.stringify(formatted)]
        );

        return Message.callProcedureWithMessages();
    },
    async markBulkRecord(data: MarkBulkRecord): Promise<any> {
        const { bulkData } = data;

        await db.query(
            `CALL sp_attendance_record_mark_bulk(?, @p_messages_json)`,
            [JSON.stringify(bulkData)]
        );

        return Message.callProcedureWithMessages();
    }


}


