import { FastifyReply, FastifyRequest } from "fastify";
import { handleError, sendSuccessResponse, showValidation } from "../../../utils/response";
import { validateFieldData } from "../../../utils/validation";
import { Field, SearchParams } from "../../../types/interface";
import { FieldModel } from "./model";
import { FacultyModel } from "../faculty/model";


export const FieldController = {

    async search(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const { keyword = "", page = 1, limit = 10 } = req.query as SearchParams;
        try {
            const [rows, [{total}={total : 0}]] = await FieldModel.search(keyword, page, limit);
            if (!rows?.length) {
                res.send({ message: "No field found" });
                return;
            }
            sendSuccessResponse(res, true, "Search result fidld", { rows: rows, total: total }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error searching field", 500);
        }
    },

    async formLoad(req: FastifyRequest, res: FastifyReply): Promise<void> {
        try {
            const [rows] = await FacultyModel.getAll();
            sendSuccessResponse(res, true, "Field form data", { faculties: rows }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error loading field form data", 500);
        }
    },

    async getAll(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const { page = 1, limit = 10 } = req.query as { page?: number; limit?: number };
        try {
            const [rows, [{ total } = { total: 0 }]] = await FieldModel.getAll(page, limit);

            // Check if rows are empty
            if (!rows?.length) {
                res.status(404).send({ message: "No fields found" });
                return;
            }
            // Send success response with rows and total count
            sendSuccessResponse(res, true, "fields list", { rows: rows, total:total }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching fields", 500);
        }
    },

    async getById(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const { id } = req.params as { id: number };
        try {
            const [rows] = await FieldModel.getById(id);

            // Check if rows are empty
            if (!rows?.length) {
                res.status(404).send({ message: "field not found" });
                return;
            }
            // Send success response 
            sendSuccessResponse(res, true, "field details", { row: rows[0] }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching field by ID", 500);
        }
    },

    async create(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const data = req.body as Field;
        try {
            // Validate the data before proceeding
            validateFieldData(data);
            
            const [result] = await FieldModel.create(data);
            
            const messages = JSON.parse(result?.messages);
            if (messages && messages.length > 0 && messages[0].code === 0) {
                sendSuccessResponse(res, true, messages, null, 200);
            }else{
                res.status(400).send({ message: messages[0].message || "Error updating field" });
            }
        } catch (e: any) {
            showValidation(res, e);
            handleError(res, e as Error, "Error creating field", 500);
        }
    },

    async update(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const { id } = req.params as { id: number };
        const data = req.body as Field;
        try {
            // Validate the data before proceeding
            validateFieldData(data);

            const [result] = await FieldModel.update(id, data);
            const messages = JSON.parse(result?.messages) ;
            if (messages && messages.length > 0 && messages[0].code === 0) {
                sendSuccessResponse(res, true, messages, null, 200);
            }else{
                res.status(400).send({ message: messages[0].message || "Error updating field" });
            }
            
        } catch (e: any) {
            showValidation(res, e);
            handleError(res, e as Error, "Error updating field", 500);
        }
    },

    async delete(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const { id } = req.params as { id: number };
        try {
            // Validate the ID before proceeding
            if (!Number.isFinite(id)) {
                res.status(400).send({ message: "field not found!" });
                return;
            }
            const [result] = await FieldModel.delete(id);
            const rawMessages = result?.messages;
            const parsedMessages = typeof rawMessages === "string" ? JSON.parse(rawMessages) : [];
            sendSuccessResponse(res, true, parsedMessages, null, 200);
        } catch (e: any) {
            handleError(res, e as Error, "Error deleting field", 500);
        }
    }
};