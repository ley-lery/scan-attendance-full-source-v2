import { FastifyReply, FastifyRequest } from "fastify";
import { handleError, sendSuccessResponse, getClientIP, getSessionInfo, AuthUserPayload, RequestWithUser  } from "../../../../index";
import {Program, SearchParams } from "../../../../types/interface";
import { ProgramModel } from "./model";
import { FacultyModel } from "../faculty/model";
import { FieldModel } from "../field/model";
import { CourseModel } from "../course/model";

const model = ProgramModel;

export const ProgramController = {

    async getAll(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const { page = 1, limit = 10 } = req.query as { page?: number; limit?: number };
        try {
            const [rows, [{ total } = { total: 0 }]] = await model.getAll(page, limit);

            if (!rows?.length) {
                res.send({ message: "No programs found" });
                return;
            }

            sendSuccessResponse(res, true, "programs list", { rows: rows, total:total }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching courses", 500);
        }
    },

    async getById(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const { id } = req.params as { id: number };
        try {
            const [rows] = await model.getById(id);

            console.log(rows, "rows");

            if (!rows?.length) {
                res.send({ message: "program not found" });
                return;
            }
            sendSuccessResponse(res, true, "Program details", { row: rows[0] }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching program by ID", 500);
        }
    },

    async create(req: RequestWithUser, res: FastifyReply): Promise<void> {
        const data = req.body as Program;
        const userPayload = req.user as AuthUserPayload;
        
        const updatedData: Program = {
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
                res.send({ message: messages[0].message || "Error updating program" });
            }
        } catch (e: any) {
            handleError(res, e as Error, "Error creating program", 500);
        }
    },

    async update(req: RequestWithUser, res: FastifyReply): Promise<void> {
        const { id } = req.params as { id: number };
        const data = req.body as Program;
        const userPayload = req.user as AuthUserPayload;
        
        const updatedData: Program = {
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
                res.send({ message: messages[0].message || "Error updating program" });
            }
            
        } catch (e: any) {
            handleError(res, e as Error, "Error updating program", 500);
        }
    },

    async delete(req: RequestWithUser, res: FastifyReply): Promise<void> {
        const { id } = req.params as { id: number };
        const userPayload = req.user as AuthUserPayload;

        const updatedData: Program = {
            changedByUser: String(userPayload.user_id),
            clientIp: String(getClientIP(req)),
            sessionInfo: String(getSessionInfo(req))
        };
        
        try {
            if (!id) {
                res.status(400).send({ message: "program not found!" });
                return;
            }
            const [result] = await model.delete(id, updatedData);
            const rawMessages = result?.messages;
            const parsedMessages = typeof rawMessages === "string" ? JSON.parse(rawMessages) : [];
            sendSuccessResponse(res, true, parsedMessages, null, 200);
        } catch (e: any) {
            handleError(res, e as Error, "Error deleting program", 500);
        }
    },

    async search(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const { keyword = "", page = 1, limit = 10 } = req.query as SearchParams;
        try {
            const [ rows, [{total} = {total : 0} ]] = await model.search(keyword, page, limit);
            if (!rows?.length) {
                res.send({ message: "No program found" });
                return;
            }
            sendSuccessResponse(res, true, "Search result program", { rows: rows, total: total }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error searching program", 500);
        }
    },

    async formLoad(req: FastifyRequest, res: FastifyReply): Promise<void> {
        try {
            const [faculty] = await FacultyModel.getAll();
            const [field] = await FieldModel.getAll();
            const [course] = await CourseModel.getAll();

            sendSuccessResponse(res, true, "Form load", { faculties: faculty, fields: field, courses: course }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error loading form", 500);
        }
    }
};