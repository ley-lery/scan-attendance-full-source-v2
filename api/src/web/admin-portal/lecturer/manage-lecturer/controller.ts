import { FastifyReply, FastifyRequest } from "fastify";
import { handleError, sendSuccessResponse } from "../../../../utils/response";
import { Lecturer, SearchParams } from "../../../../types/interface";
import { LecturerModel } from "./model";
import { RequestWithUser, AuthUserPayload } from "../../../../middlewares/auth.middleware";
import { getClientIP, getSessionInfo } from "../../../../helpers/audit-log";


const model = LecturerModel;

export const LecturerController = {

    async getAll(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const { page = 1, limit = 10 } = req.query as { page?: number; limit?: number };
        try {
            const [rows, [{ total } = { total: 0 }]] = await model.getAll(page, limit);

            if (!rows?.length) {
                res.status(404).send({ message: "No lecturers found" });
                return;
            }

            sendSuccessResponse(res, true, "Lecturers list", { rows: rows, total:total }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching lecturers", 500);
        }
    },

    async getById(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const { id } = req.params as { id: number };
        try {
            const [rows] = await model.getById(id);

            if (!rows?.length) {
                res.status(404).send({ message: "lecturer not found" });
                return;
            }
            sendSuccessResponse(res, true, "Lecturer details", { row: rows[0] }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching lecturer by ID", 500);
        }
    },

    async create(req: RequestWithUser, res: FastifyReply): Promise<void> {
        const data = req.body as Lecturer;
        const userPayload = req.user as AuthUserPayload;
        
        const updatedData: Lecturer = {
            ...data,
            changedByUser: String(userPayload.user_id),
            clientIp: String(getClientIP(req)),
            sessionInfo: String(getSessionInfo(req))
        };
        try {
            
            const [result] = await model.create(updatedData);
            
            const messages = JSON.parse(result?.messages);
            if (messages && messages.length > 0 && messages[0].code === 0) {
                sendSuccessResponse(res, true, messages, null, 200);
            }else{
                res.status(400).send({ message: messages[0].message || "Error updating lecturer" });
            }
        } catch (e: any) {
            handleError(res, e as Error, "Error creating lecturer", 500);
        }
    },

    async update(req: RequestWithUser, res: FastifyReply): Promise<void> {
        const { id } = req.params as { id: number };
        const data = req.body as Lecturer;
        const userPayload = req.user as AuthUserPayload;
        
        const updatedData: Lecturer = {
            ...data,
            changedByUser: String(userPayload.user_id),
            clientIp: String(getClientIP(req)),
            sessionInfo: String(getSessionInfo(req))
        };
        try {

            const [result] = await model.update(id, updatedData);
            const messages = JSON.parse(result?.messages) ;
            if (messages && messages.length > 0 && messages[0].code === 0) {
                sendSuccessResponse(res, true, messages, null, 200);
            }else{
                res.status(400).send({ message: messages[0].message || "Error updating lecturer" });
            }
            
        } catch (e: any) {
            handleError(res, e as Error, "Error updating lecturer", 500);
        }
    },

    async delete(req: RequestWithUser, res: FastifyReply): Promise<void> {
        const { id } = req.params as { id: number };
        const userPayload = req.user as AuthUserPayload;
        
        const updatedData: Lecturer = {
            changedByUser: String(userPayload.user_id),
            clientIp: String(getClientIP(req)),
            sessionInfo: String(getSessionInfo(req))
        };
        try {
            if (!id) {
                res.status(400).send({ message: "lecturer not found!" });
                return;
            }
            const [result] = await model.delete(id, updatedData);
            const rawMessages = result?.messages;
            const parsedMessages = typeof rawMessages === "string" ? JSON.parse(rawMessages) : [];
            sendSuccessResponse(res, true, parsedMessages, null, 200);
        } catch (e: any) {
            handleError(res, e as Error, "Error deleting lecturer", 500);
        }
    },

    async search(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const { keyword = "", page = 1, limit = 10 } = req.query as SearchParams;
        try {
            const [ rows, [{total} = {total : 0} ]] = await model.search(keyword, page, limit);
            if (!rows?.length) {
                res.send({ message: "No lecturer found" });
                return;
            }
            sendSuccessResponse(res, true, "Search result lecturer", { rows: rows, total: total }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error searching lecturer", 500);
        }
    },

};