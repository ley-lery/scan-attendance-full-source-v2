import { FastifyReply, FastifyRequest } from "fastify";
import { handleError, sendSuccessResponse } from "../../../index";
import { UserListModel } from "./model";

const model = UserListModel;

export const userListController = {

    async getAll(req: FastifyRequest, res: FastifyReply): Promise<void> {
        try {
            const [rows] = await model.getAll();

            if (!rows?.length) {
                res.send({ message: "No users found" });
                return;
            }

            sendSuccessResponse(res, true, "users list", { rows: rows }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching users", 500);
        }
    },

};