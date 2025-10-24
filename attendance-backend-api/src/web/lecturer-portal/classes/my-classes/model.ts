import { db } from "../../../../index";

type FilterData = {
    lecturer: number,
    faculty: number,
    field: number,
    programType: string,
    promotionNo: number,
    termNo: number,
    classId: number,
    status: string,
    startDate: Date,
    endDate: Date, 
    search: string
}

export const LecturerMyClassesModel = {

    async getAll(lecturerId: number): Promise<any> {
        const [result] = await db.query(`Call sp_lecturer_classes_list_filter(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [lecturerId, null, null, null, null, null, null, null, null, null, null]);
        return result;
    },

    async filter(lecturerId: number, filterData: FilterData): Promise<any> {
        const { faculty, field, programType, promotionNo, termNo, classId, status, startDate, endDate, search } = filterData;
        const [result] = await db.query(`Call sp_lecturer_classes_list_filter(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [lecturerId, faculty, field, programType, promotionNo, termNo, classId, status, startDate, endDate, search]);
        return result;
    },

}


