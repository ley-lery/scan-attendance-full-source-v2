import { FastifyReply, FastifyRequest } from "fastify";
import { handleError, sendSuccessResponse, showValidation } from "../../../utils/response";
import { SearchParams, Student } from "../../../types/interface";
import { ClassModel } from "./model";
import { FacultyModel } from "../faculty/model";
import { FieldModel } from "../field/model";
import { AuthUserPayload, RequestWithUser } from "../../../middlewares/auth.middleware";
import { getClientIP, getSessionInfo } from "../../../helpers/audit-log";


export const ClassController = {

    async getAll(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const { page = 1, limit = 10 } = req.query as { page?: number; limit?: number };
        try {
            const [rows, [{ total } = { total: 0 }]] = await ClassModel.getAll(page, limit);

            if (!rows?.length) {
                res.status(404).send({ message: "No class found" });
                return;
            }

            sendSuccessResponse(res, true, "Class list", { rows: rows, total:total }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching students", 500);
        }
    },

    async getById(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const { id } = req.params as { id: number };
        try {
            const [rows] = await ClassModel.getById(id);

            if (!rows?.length) {
                res.status(404).send({ message: "Class not found" });
                return;
            }
            sendSuccessResponse(res, true, "Class details", { row: rows[0] }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching class by ID", 500);
        }
    },

    async create(req: RequestWithUser, res: FastifyReply): Promise<void> {
        const data = req.body as Student;
        const userPayload = req.user as AuthUserPayload;
        
        const updatedData: Student = {
            ...data,
            changedByUser: String(userPayload.user_id),
            clientIp: String(getClientIP(req)),
            sessionInfo: String(getSessionInfo(req))
        };
        try {
            
            const [result] = await ClassModel.create(updatedData);
            
            const messages = JSON.parse(result?.messages);
            if (messages && messages.length > 0 && messages[0].code === 0) {
                sendSuccessResponse(res, true, messages, null, 200);
            }else{
                res.status(400).send({ message: messages[0].message || "Error updating class" });
            }
        } catch (e: any) {
            handleError(res, e as Error, "Error creating class", 500);
        }
    },

    async update(req: RequestWithUser, res: FastifyReply): Promise<void> {
        const { id } = req.params as { id: number };
        const data = req.body as Student;
        const userPayload = req.user as AuthUserPayload;
        
        const updatedData: Student = {
            ...data,
            changedByUser: String(userPayload.user_id),
            clientIp: String(getClientIP(req)),
            sessionInfo: String(getSessionInfo(req))
        };
        try {

            const [result] = await ClassModel.update(id, updatedData);
            const messages = JSON.parse(result?.messages) ;
            if (messages && messages.length > 0 && messages[0].code === 0) {
                sendSuccessResponse(res, true, messages, null, 200);
            }else{
                res.status(400).send({ message: messages[0].message || "Error updating class" });
            }
            
        } catch (e: any) {
            handleError(res, e as Error, "Error updating class", 500);
        }
    },

    async delete(req: RequestWithUser, res: FastifyReply): Promise<void> {
        const { id } = req.params as { id: number };
        const userPayload = req.user as AuthUserPayload;
        
        const updatedData: Student = {
            changedByUser: String(userPayload.user_id),
            clientIp: String(getClientIP(req)),
            sessionInfo: String(getSessionInfo(req))
        };
        try {
            if (!id) {
                res.status(400).send({ message: "Class not found!" });
                return;
            }
            const [result] = await ClassModel.delete(id, updatedData);
            const rawMessages = result?.messages;
            const parsedMessages = typeof rawMessages === "string" ? JSON.parse(rawMessages) : [];
            sendSuccessResponse(res, true, parsedMessages, null, 200);
        } catch (e: any) {
            handleError(res, e as Error, "Error deleting class", 500);
        }
    },

    async search(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const { keyword = "", page = 1, limit = 10 } = req.query as SearchParams;
        try {
            const [ rows, [{total} = {total : 0} ]] = await ClassModel.search(keyword, page, limit);
            if (!rows?.length) {
                res.send({ message: "No class found" });
                return;
            }
            sendSuccessResponse(res, true, "Search result class", { rows: rows, total: total }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error searching class", 500);
        }
    },
    async formLoad(req: FastifyRequest, res: FastifyReply): Promise<void> {
        try {
            const [faculty] = await FacultyModel.getAll();
            const [field] = await FieldModel.getAll();

            sendSuccessResponse(res, true, "Form load", { faculties: faculty, fields: field }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error loading form", 500);
        }
    }

};