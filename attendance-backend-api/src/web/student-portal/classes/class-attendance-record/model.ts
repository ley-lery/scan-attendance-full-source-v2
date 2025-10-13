import { db } from "../../../../index"

export const ClassAttendanceRecordModel = {

    async getAll(student: number, page: number, limit: number): Promise<any> {
        const [result] = await db.query(`Call sp_attendance_student_get(?, ?, ?)`, [student, page, limit]);
        return result;
    },
    async getDetail(student: number, data: {classId: number, course: number}): Promise<any> {
        const [result] = await db.query(`Call sp_class_attendance_detail_student_get(?, ?, ?)`, [student, data.classId, data.course]);
        return result;
    },
    
}


