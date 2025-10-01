import { FastifyReply, FastifyRequest } from "fastify";
import { handleError, sendSuccessResponse } from "../../../utils/response";
import { AuditLogModel } from "./model";
import { AuditLogFilter, SearchParams } from "../../../types/interface";
import { UserModel } from "../user/model";

const tableList = [
    {value: "Table User", label: "Table User"},
    {value: "Table Program", label: "Table Program"},
    {value: "Table Course", label: "Table Course"},
    {value: "Table Field", label: "Table Field"},
    {value: "Table Faculty", label: "Table Faculty"},
    {value: "Table Audit Log", label: "Table Audit Log"},
]
const actionList = [
    {value: "INSERT", label: "INSERT"},
    {value: "UPDATE", label: "UPDATE"},
    {value: "DELETE", label: "DELETE"},
]

export const AuditLogController = {

    async getAll(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const { page = 1, limit = 10 } = req.query as { page?: number; limit?: number };
        try {
            const [rows, [{ total } = { total: 0 }]] = await AuditLogModel.getAll(page, limit);
            if (!rows?.length) {
                res.status(404).send({ message: "No audit logs found" });
                return;
            }
            sendSuccessResponse(res, true, "audit logs list", { rows: rows, total: total }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching audit logs", 500);
        }
    },

    async getById(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const { id } = req.params as { id: number };
        try {
            if (!id) {
                res.status(400).send({ message: "Audit log not found!" });
                return;
            }
            const [rows] = await AuditLogModel.getById(id);
            if (!rows?.length) {
                res.status(404).send({ message: "No audit logs found" });
                return;
            }
            sendSuccessResponse(res, true, "audit logs list", { rows: rows }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching audit logs", 500);
        }
    },

     async filter(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const {  action, tableName, user, startDate, endDate, startTime, endTime, clientIp, page = 1, limit = 10 } = req.body as AuditLogFilter;
        
        try {
            const [rows, [{ total } = { total: 0 }]] = await AuditLogModel.filter(
                { action, tableName, user, startDate, endDate, startTime, endTime, clientIp }, 
                page, 
                limit
            );
            
            if (!rows?.length) {
                res.send({ message: "No audit logs found" });
                return;
            }
            
            sendSuccessResponse(res, true, "audit logs list", { rows: rows, total: total }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching audit logs", 500);
        }
    },

    async search(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const { keyword = "", page = 1, limit = 10 } = req.query as SearchParams;
        try {
            const [rows, [{ total } = { total: 0 }]] = await AuditLogModel.search(keyword, page, limit);
            if (!rows?.length) {
                res.send({ message: "No audit logs found" });
                return;
            }
            sendSuccessResponse(res, true, "audit logs list", { rows: rows, total: total }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching audit logs", 500);
        }
    },

    async formLoad(req: FastifyRequest, res: FastifyReply): Promise<void> {
        try {
            const [users] = await UserModel.getAll();

            sendSuccessResponse(res, true, "Form load", { users: users, tableList: tableList, actionList: actionList }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error loading form", 500);
        }
    }

};
