import { db } from "../../../../index"

interface FilterData {
    classId: number,
    course: number,
    status: string,
    page: number,
    limit: number
}

export const ClassAttendanceRecordModel = {

    async getAll(student: number, page: number, limit: number): Promise<any> {
        const [result] = await db.query(`Call sp_student_attendance_list_filter(?, null, null, null, ?, ?)`, [student, page, limit]);
        return result;
    },
    async getDetail(student: number, data: {classId: number, course: number}): Promise<any> {
        const [result] = await db.query(`Call sp_class_attendance_detail_student_get(?, ?, ?)`, [student, data.classId, data.course]);
        return result;
    },
    async filter(student: number, data: FilterData): Promise<any> {
        const [result] = await db.query(`Call sp_student_attendance_list_filter(?, ?, ?, ?, ?, ?)`, [student, data.classId, data.course, data.status, data.page, data.limit]);
        return result;
    }
    
}


