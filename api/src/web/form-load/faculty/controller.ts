import { FastifyReply, FastifyRequest } from "fastify";
import { handleError, sendSuccessResponse } from "../../../../src/index";
import { FacultyListModel } from "./model";

const model = FacultyListModel;

export const facultyListController = {

    async getAll(req: FastifyRequest, res: FastifyReply): Promise<void> {
        try {
            const [rows] = await model.getAll();

            if (!rows?.length) {
                res.send({ message: "No facultys found" });
                return;
            }

            sendSuccessResponse(res, true, "facultys list", { rows: rows }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching facultys", 500);
        }
    },

};