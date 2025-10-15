import { FastifyReply, FastifyRequest } from "fastify";
import { handleError, sendSuccessResponse } from "../../../../index";
import { SearchParams } from "../../../../types/interface";
import { UserModel } from "./model";

const model = UserModel;

export const UserController = {
    async getAll(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const { page = 1, limit = 10 } = req.query as { page?: number; limit?: number };
        try {
            const [rows, [{ total } = { total: 0 }]] = await model.getAll(page, limit);
            if (!rows?.length) {
                res.send({ message: "No users found" });
                return;
            }
            sendSuccessResponse(res, true, "users list", { rows: rows, total: total }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching users", 500);
        }
    },
    async getById(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const { id } = req.params as { id: number };
        try {
            if (!id) {
                res.status(400).send({ message: "User not found!" });
                return;
            }
            const [rows] = await model.getById(id);
            if (!rows?.length) {
                res.send({ message: "No users found" });
                return;
            }
            sendSuccessResponse(res, true, "user list", { rows: rows }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching users", 500);
        }
    },


    async search(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const { keyword = "", page = 1, limit = 10 } = req.query as SearchParams;
        try {
            const [ rows, [{total} = {total : 0} ]] = await model.search(keyword, page, limit);
            if (!rows?.length) {
                res.send({ message: "No users found" });
                return;
            }
            sendSuccessResponse(res, true, "Search result users", { rows: rows, total: total }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error searching users", 500);
        }
    },
};
