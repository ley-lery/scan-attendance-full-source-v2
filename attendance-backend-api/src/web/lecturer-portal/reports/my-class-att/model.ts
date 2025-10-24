import { db } from "../../../../index";

type FilterData = {
    classId: number,
    course: number,
    startDate: Date | string,
    endDate: Date | string,
} // 8 parameters



export const MyClassAttendanceReportModel = {

    async getAll(): Promise<any> {
        const [result] = await db.query(`Call sp_lecturer_my_class_attendance_report(null, null, null, null, null)`);
        return result;
    },
    
    async filter(lecturerId: number, filterData: FilterData): Promise<any> {
        const { classId, course, startDate, endDate } = filterData;
        const [result] = await db.query(`Call sp_lecturer_my_class_attendance_report(?, ?, ?, ?, ?)`, [lecturerId, classId, course, startDate, endDate]);
        return result;
    },
    
}


