import { db } from "../../../index";


export const LecturerClassListModel = {

    async getAll(lecturer: number, page: number, limit: number): Promise<any> {
        const [result] = await db.query(`Call sp_lecturer_classes_get(?, ?, ?)`, [lecturer, page, limit]);
        return result;
    },
    async fullList(lecturer: number): Promise<any> {
        const [result] = await db.query(`Call sp_lecturer_classes_full_list(?)`, [lecturer]);
        return result;
    },

}


