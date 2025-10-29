import { db } from "../../../../../config/db";
import { StudentClass } from "../../../../../types/interface";
import { Message } from "../../../../../utils/message";

interface CreateMultipleData {
    classId: number;
    studentIds: number[];
    status: 'Active' | 'Inactive' | 'Complete';
    changedByUser: string;
    clientIp: string;
    sessionInfo: string;
}

interface UpdateMultipleData {
    classId: number;
    studentIds: number[];
    status: 'Active' | 'Inactive' | 'Complete';
    changedByUser: string;
    clientIp: string;
    sessionInfo: string;
}

type DataUpdateStatus = {
    classStudents: number[]
    status: string
    changedByUser: number
    clientIp: string
    sessionInfo: string
}

type DataFilter = {
    faculty: number,
    field: number,
    classId: number,
    student: number,
    status: 'Active' | 'Inactive' | 'Complete',
    promotionNo: number,
    termNo: number,
    programType: string,
    page: number,
    limit: number
} // 10 parameters

export const ClassStudentModel = {

    async getAll(page: number = 1, limit: number = 10): Promise<any> {
        const [result] = await db.query(`Call sp_class_student_list_filters(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [null, null, null, null, null, null, null, null, page, limit]);
        return result;
    },

    async getById(id: number): Promise<any> {
        const [result] = await db.query(`Call sp_class_student_get(?, ?, ?)`, [id, null, null]);
        return result;
    },

    async filter(data: DataFilter): Promise<any> {
        const { faculty, field, classId, student, status, promotionNo, termNo, programType, page, limit } = data;
        const [result] = await db.query(`Call sp_class_student_list_filters(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [faculty, field, classId, student, status, promotionNo, termNo, programType, page, limit]);
        return result;
    },
    
    async create(data: StudentClass): Promise<any> {
        const { classId, studentId, status, changedByUser, clientIp, sessionInfo } = data;
        await db.query(`Call sp_class_student_create(?, ?, ?, ?, ?, ?, @p_messages_json)`, [classId, studentId, status, changedByUser, clientIp, sessionInfo]);
        return Message.callProcedureWithMessages();
    },

    async update(id: number, data: StudentClass): Promise<any> {
         const { classId, studentId, status, changedByUser, clientIp, sessionInfo } = data;
        await db.query(`Call sp_class_student_update(?, ?, ?, ?, ?, ?, ?, @p_messages_json)`, [id, classId, studentId, status, changedByUser, clientIp, sessionInfo]);
        return Message.callProcedureWithMessages();
    },
    async createMultiple(data: CreateMultipleData): Promise<any> {
        const { classId, studentIds, status, changedByUser, clientIp, sessionInfo } = data;
        await db.query(`Call sp_class_student_create_bulk(?, ?, ?, ?, ?, ?, @p_messages_json)`, [classId, JSON.stringify(studentIds), status, changedByUser, clientIp, sessionInfo]);
        return Message.callProcedureWithMessages();
    },

    async updateMultiple(id: number, data: UpdateMultipleData): Promise<any> {
         const { classId, studentIds, status, changedByUser, clientIp, sessionInfo } = data;
        await db.query(`Call sp_class_student_update_bulk(?, ?, ?, ?, ?, ?, ?, @p_messages_json)`, [id, classId, JSON.stringify(studentIds), status, changedByUser, clientIp, sessionInfo]);
        return Message.callProcedureWithMessages();
    },

    async delete(id: number, data: StudentClass): Promise<any> {
        const { changedByUser, clientIp, sessionInfo } = data;
        await db.query(`Call sp_class_student_delete(?, ?, ?, ?, @p_messages_json)`, [id, changedByUser, clientIp, sessionInfo]);
        return Message.callProcedureWithMessages();
    },

    async search(keyword: string, page: number = 1, limit: number = 10): Promise<any> {
        const [result] = await db.query( `Call sp_class_student_search(?, ?, ?)`, [keyword, page, limit]);
        return result;
    },
    async updateStatus(data: DataUpdateStatus): Promise<any> {
        const { classStudents, status, changedByUser, clientIp, sessionInfo } = data;
        await db.query(
            `Call sp_class_student_multi_status_update(?, ?, ?, ?, ?, @p_messages_json)`,
            [JSON.stringify(classStudents), status, changedByUser, clientIp, sessionInfo]
        );
        return Message.callProcedureWithMessages();
    },
}


