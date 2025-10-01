import { db } from "../../../config/db";
import { AuditLogFilter } from "../../../types/interface";

export const AuditLogModel = {
    async getAll(page: number = 1, limit: number = 10): Promise<any> {
        const [result] = await db.query(`Call sp_audit_log_get(?, ?, ?)`, [null, page, limit]);
        return result;
    },
    async getById(id: number): Promise<any> {
        const [result] = await db.query(`Call sp_audit_log_get(?, ?, ?)`, [id, null, null]);
        return result;
    },
    async filter(filter: AuditLogFilter, page: number = 1, limit: number = 10): Promise<any> {
        const { action, tableName, user, startDate, endDate, startTime, endTime, clientIp, } = filter;
        const [result] = await db.query(`Call sp_audit_log_filter(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [action, tableName, user, startDate, endDate, startTime, endTime, clientIp, page, limit]);
        return result;
    },
    async search(keyword: string, page: number = 1, limit: number = 10): Promise<any> {
        const [result] = await db.query(`Call sp_audit_log_search(?, ?, ?)`, [keyword, page, limit]);
        return result;
    },
};
