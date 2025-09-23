import { FastifyReply, FastifyRequest } from "fastify";
import { handleError, sendSuccessResponse, showValidation } from "../../../utils/response";
import { validateProgramData } from "../../../utils/validation";
import { Program, SearchParams } from "../../../types/interface";
import { ProgramModel } from "./model";
import { FacultyModel } from "../faculty/model";
import { FieldModel } from "../field/model";
import { CourseModel } from "../course/model";


export const ProgramController = {
    async search(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const { keyword = "", page = 1, limit = 10 } = req.query as SearchParams;
        try {
            const [rows, [{total}={total : 0}]] = await ProgramModel.search(keyword, page, limit);
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
            const [faculties, fields, courses] = await Promise.all([
                FacultyModel.getAll(),
                FieldModel.getAll(),
                CourseModel.getAll()
            ]);

            sendSuccessResponse(res, true, "Program form data", { faculties: faculties[0], fields: fields[0], courses: courses[0]  }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error loading program form data", 500);
        }
    },

    async getAll(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const { page = 1, limit = 10 } = req.query as { page?: number; limit?: number };
        try {
            const [rows, [{ total } = { total: 0 }]] = await ProgramModel.getAll(page, limit);

            // Check if rows are empty
            if (!rows?.length) {
                res.status(404).send({ message: "No Programs found" });
                return;
            }
            // Send success response with rows and total count
            sendSuccessResponse(res, true, "Programs list", { rows: rows, total:total }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching programs", 500);
        }
    },

    async getById(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const { id } = req.params as { id: number };
        try {
            const [rows] = await ProgramModel.getById(id);

            // Check if rows are empty
            if (!rows?.length) {
                res.status(404).send({ message: "Program not found" });
                return;
            }
            // Send success response 
            sendSuccessResponse(res, true, "program details", { row: rows[0] }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching program by ID", 500);
        }
    },

    async create(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const data = req.body as Program;
        try {
            // Validate the data before proceeding
            validateProgramData(data);
            
            const [result] = await ProgramModel.create(data);
            
            const messages = JSON.parse(result?.messages);
            if (messages && messages.length > 0 && messages[0].code === 0) {
                sendSuccessResponse(res, true, messages, null, 200);
            }else{
                res.status(400).send({ message: messages[0].message || "Error updating program" });
            }
        } catch (e: any) {
            showValidation(res, e);
            handleError(res, e as Error, "Error creating program", 500);
        }
    },

    async update(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const { id } = req.params as { id: number };
        const data = req.body as Program;
        try {
            // Validate the data before proceeding
            validateProgramData(data);

            const [result] = await ProgramModel.update(id, data);
            const messages = JSON.parse(result?.messages) ;
            if (messages && messages.length > 0 && messages[0].code === 0) {
                sendSuccessResponse(res, true, messages, null, 200);
            }else{
                res.status(400).send({ message: messages[0].message || "Error updating program" });
            }
            
        } catch (e: any) {
            showValidation(res, e);
            handleError(res, e as Error, "Error updating program", 500);
        }
    },

    async delete(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const { id } = req.params as { id: number };
        try {
            // Validate the ID before proceeding
            if (!Number.isFinite(id)) {
                res.status(400).send({ message: "program not found!" });
                return;
            }
            const [result] = await ProgramModel.delete(id);
            const rawMessages = result?.messages;
            const parsedMessages = typeof rawMessages === "string" ? JSON.parse(rawMessages) : [];
            sendSuccessResponse(res, true, parsedMessages, null, 200);
        } catch (e: any) {
            handleError(res, e as Error, "Error deleting program", 500);
        }
    }
};