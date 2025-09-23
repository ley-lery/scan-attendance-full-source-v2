import { FastifyReply, FastifyRequest } from "fastify";
import { handleError, sendSuccessResponse, showValidation } from "../../../utils/response";
import { validateFacultyData } from "../../../utils/validation";
import { Faculty, SearchParams } from "../../../types/interface";
import { FacultyModel } from "./model";


export const FacultyController = {

    async search(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const { keyword = "", page = 1, limit = 10 } = req.query as SearchParams;
        try {
            const [rows, [{ total } = { total: 0 }]] = await FacultyModel.search(keyword, page, limit);

            if (!rows.length) {
                res.send({ message: "No faculty found" });
                return;
            }

            sendSuccessResponse(res, true, "Search result found", { rows, total }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error searching faculty", 500);
        }
    },

    async getAll(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const { page = 1, limit = 10 } = req.query as { page?: number; limit?: number };
        try {
            const [rows, [{ total } = { total: 0 }]] = await FacultyModel.getAll(page, limit);

            // Check if rows are empty
            if (!rows?.length) {
                res.status(404).send({ message: "No facultys found" });
                return;
            }
            // Send success response with rows and total count
            sendSuccessResponse(res, true, "facultys list", { rows: rows, total:total }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching facultys", 500);
        }
    },

    async getById(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const { id } = req.params as { id: number };
        try {
            const [rows] = await FacultyModel.getById(id);

            // Check if rows are empty
            if (!rows?.length) {
                res.status(404).send({ message: "Faculty not found" });
                return;
            }
            // Send success response 
            sendSuccessResponse(res, true, "Faculty details", { row: rows[0] }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching faculty by ID", 500);
        }
    },

    async create(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const data = req.body as Faculty;
        try {
            // Validate the data before proceeding
            validateFacultyData(data);
            
            const [result] = await FacultyModel.create(data);
            
            const messages = JSON.parse(result?.messages);
            if (messages && messages.length > 0 && messages[0].code === 0) {
                sendSuccessResponse(res, true, messages, null, 200);
            }else{
                res.status(400).send({ message: messages[0].message || "Error updating faculty" });
            }
        } catch (e: any) {
            showValidation(res, e);
            handleError(res, e as Error, "Error creating faculty", 500);
        }
    },

    async update(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const { id } = req.params as { id: number };
        const data = req.body as Faculty;
        try {
            // Validate the data before proceeding
            validateFacultyData(data);

            const [result] = await FacultyModel.update(id, data);
            const messages = JSON.parse(result?.messages) ;
            if (messages && messages.length > 0 && messages[0].code === 0) {
                sendSuccessResponse(res, true, messages, null, 200);
            }else{
                res.status(400).send({ message: messages[0].message || "Error updating faculty" });
            }
            
        } catch (e: any) {
            showValidation(res, e);
            handleError(res, e as Error, "Error updating faculty", 500);
        }
    },

    async delete(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const { id } = req.params as { id: number };
        try {
            // Validate the ID before proceeding
            if (!Number.isFinite(id)) {
                res.status(400).send({ message: "Faculty not found!" });
                return;
            }
            const [result] = await FacultyModel.delete(id);
            const rawMessages = result?.messages;
            const parsedMessages = typeof rawMessages === "string" ? JSON.parse(rawMessages) : [];
            sendSuccessResponse(res, true, parsedMessages, null, 200);
        } catch (e: any) {
            handleError(res, e as Error, "Error deleting faculty", 500);
        }
    }
};