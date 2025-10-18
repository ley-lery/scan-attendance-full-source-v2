import { FastifyReply, FastifyRequest } from "fastify";
import { handleError, sendSuccessResponse } from "../../../index";
import { ClassListModel } from "./model";

const model = ClassListModel;

export const classListController = {

    async getAll(req: FastifyRequest, res: FastifyReply): Promise<void> {
        try {
            const [rows] = await model.getAll();

            if (!rows?.length) {
                res.send({ message: "No classes found" });
                return;
            }

            sendSuccessResponse(res, true, "classes list", { rows: rows }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching classes", 500);
        }
    },

};