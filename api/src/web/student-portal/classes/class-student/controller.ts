import { FastifyReply, FastifyRequest } from "fastify";
import { ClassStudentModel } from "./model";
import {AuthUserPayload, RequestWithUser, sendSuccessResponse, handleError } from "../../../../index";


const model = ClassStudentModel

export const classStudentController = {

    async getAll(req: RequestWithUser, res: FastifyReply): Promise<void> {
        const { page = 1, limit = 10 } = req.query as { page?: number; limit?: number };
        const userPayload = req.user as AuthUserPayload;
        
        try {
            const [rows, [{ total } = { total: 0 }]] = await model.getAll(userPayload.assign_to, page, limit);

            if (!rows?.length) {
                res.status(404).send({ message: "No class students found" });
                return;
            }

            sendSuccessResponse(res, true, "class students list", { rows: rows, total:total }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching class students", 500);
        }
    },

    async getById(req: RequestWithUser, res: FastifyReply): Promise<void> {
        const { id } = req.params as { id: number };
        const userPayload = req.user as AuthUserPayload;
        
        try {
            const [rows] = await model.getById(id, userPayload.assign_to);

            if (!rows?.length) {
                res.status(404).send({ message: "class student not found" });
                return;
            }
            sendSuccessResponse(res, true, "class student details", { row: rows[0] }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching class student by ID", 500);
        }
    },

};