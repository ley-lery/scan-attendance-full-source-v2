import { FastifyReply, FastifyRequest } from "fastify";
import { handleError, sendSuccessResponse } from "../../../index";
import { StudentListModel } from "./model";

const model = StudentListModel;

export const studentListController = {

    async getAll(req: FastifyRequest, res: FastifyReply): Promise<void> {
        try {
            const [rows] = await model.getAll();

            if (!rows?.length) {
                res.send({ message: "No students found" });
                return;
            }

            sendSuccessResponse(res, true, "students list", { rows: rows }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching students", 500);
        }
    },

};