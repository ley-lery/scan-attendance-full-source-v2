import { FastifyReply, FastifyRequest } from "fastify";
import { handleError, sendSuccessResponse, AuthUserPayload, RequestWithUser, getClientIP, getSessionInfo } from "../../../../index";
import {Field, SearchParams } from "../../../../types/interface";
import { FieldModel } from "./model";
import { FacultyListModel } from "../../../form-load";

const model = FieldModel;

export const FieldController = {

    async search(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const { keyword = "", page = 1, limit = 10 } = req.query as SearchParams;
        try {
            const [rows, [{total}={total : 0}]] = await model.search(keyword, page, limit);
            if (!rows?.length) {
                res.send({ message: "No field found" });
                return;
            }
            sendSuccessResponse(res, true, "Search result field", { rows: rows, total: total }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error searching field", 500);
        }
    },

    async getAll(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const { page = 1, limit = 10 } = req.query as { page?: number; limit?: number };
        try {
            const [rows, [{ total } = { total: 0 }]] = await model.getAll(page, limit);

            if (!rows?.length) {
                res.status(404).send({ message: "No fields found" });
                return;
            }

            console.log("List lecturers:", rows);

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
                res.status(404).send({ message: "Field not found" });
                return;
            }
            sendSuccessResponse(res, true, "Lecturer details", { row: rows[0] }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching lecturer by ID", 500);
        }
    },

    async create(req: RequestWithUser, res: FastifyReply): Promise<void> {
        const data = req.body as Field;
        const userPayload = req.user as AuthUserPayload;
        
        const updatedData: Field = {
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
                res.send({ message: messages[0].message || "Error updating lecturer" });
            }
            
        } catch (e: any) {
            handleError(res, e as Error, "Error creating lecturer", 500);
        }
    },

    async update(req: RequestWithUser, res: FastifyReply): Promise<void> {
        const { id } = req.params as { id: number };
        const data = req.body as Field;
        const userPayload = req.user as AuthUserPayload;
        
        const updatedData: Field = {
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
                res.send({ message: messages[0].message || "Error updating lecturer" });
            }
            
        } catch (e: any) {
            handleError(res, e as Error, "Error updating lecturer", 500);
        }
    },

    async delete(req: RequestWithUser, res: FastifyReply): Promise<void> {
        const { id } = req.params as { id: number };
        const userPayload = req.user as AuthUserPayload;
        
        const updatedData: Field = {
            changedByUser: String(userPayload.user_id),
            clientIp: String(getClientIP(req)),
            sessionInfo: String(getSessionInfo(req))
        };

        try {

            if (!id) {
                res.send({ message: "Field not found!" });
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
    async formLoad(req: FastifyRequest, res: FastifyReply): Promise<void> {
        try {
            const [faculyties] = await FacultyListModel.getAll();

            sendSuccessResponse(res, true, "student sessions", { faculyties: faculyties }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching student sessions", 500);
        }
    },
};