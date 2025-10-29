import { FastifyReply, FastifyRequest } from "fastify";
import { handleError, sendSuccessResponse } from "../../../../src/index";
import { FieldListModel } from "./model";

const model = FieldListModel;

export const fieldListController = {

    async getAll(req: FastifyRequest, res: FastifyReply): Promise<void> {
        try {
            const [rows] = await model.getAll();

            if (!rows?.length) {
                res.send({ message: "No fields found" });
                return;
            }

            sendSuccessResponse(res, true, "fields list", { rows: rows }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching fields", 500);
        }
    },

};