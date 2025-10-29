import { db } from "../../../../index";

type FilterData = {
    classId: number;
    course: number;
    programType: string;
    promotionNo: number;
    termNo: number;
    dayOfWeek: string;
    status: string;
    startDate: Date;
    endDate: Date;
} // 9 parameters


export const LecturerScheduleModel = {

    async getAll(lecturerId: number): Promise<any> {
        const [result] = await db.query(`Call sp_lecturer_schedules_list_filter(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [lecturerId, null, null, null, null, null, null, null, null, null]);
        return result;
    },
    async filter(lecturerId: number, filterData: FilterData): Promise<any> {
        const { classId, course, programType, promotionNo, termNo, dayOfWeek, status, startDate, endDate } = filterData;
        const [result] = await db.query(`Call sp_lecturer_schedules_list_filter(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [lecturerId, classId, course, programType, promotionNo, termNo, dayOfWeek, status, startDate, endDate]);
        return result;
    }

}


