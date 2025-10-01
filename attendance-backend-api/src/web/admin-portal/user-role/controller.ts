import { FastifyReply, FastifyRequest } from "fastify";
import { handleError, sendSuccessResponse, showValidation } from "../../../utils/response";
import { SearchParams, UserRole } from "../../../types/interface";
import { UserRoleModel } from "./model";
import { UserModel } from "../user/model";
import { RoleModel } from "../role/model";

export const UserRoleController = {
    async getAll(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const { page = 1, limit = 10 } = req.query as { page?: number; limit?: number };
        try {
            const [rows, [{ total } = { total: 0 }]] = await UserRoleModel.getAll(page, limit);
            if (!rows?.length) {
                res.status(404).send({ message: "No user-roles found" });
                return;
            }
            sendSuccessResponse(res, true, "user-roles list", { rows: rows, total: total }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching user-roles", 500);
        }
    },
    async getById(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const { id } = req.params as { id: number };
        try {
            if (!id) {
                res.status(400).send({ message: "User-role not found!" });
                return;
            }
            const [rows] = await UserRoleModel.getById(id);
            if (!rows?.length) {
                res.status(404).send({ message: "No user-roles found" });
                return;
            }
            sendSuccessResponse(res, true, "user-roles list", { rows: rows }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching user-roles", 500);
        }
    },

    async create(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const data = req.body as UserRole;
        try {
            // Optionally add validation here
            const [result] = await UserRoleModel.create(data);
            const messages = JSON.parse(result?.messages);
            if (messages && messages.length > 0 && messages[0].code === 0) {
                sendSuccessResponse(res, true, messages, null, 200);
            } else {
                res.status(400).send({ message: messages[0].message || "Error creating user-role" });
            }
        } catch (e: any) {
            showValidation(res, e);
            handleError(res, e as Error, "Error creating user-role", 500);
        }
    },

    async update(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const { id } = req.params as { id: number };
        const data = req.body as UserRole;
        try {
            if (!id) {
                res.status(400).send({ message: "User-role not found!" });
                return;
            }
            const [result] = await UserRoleModel.update(id, data);
            const rawMessages = result?.messages;
            const parsedMessages = typeof rawMessages === "string" ? JSON.parse(rawMessages) : [];
            sendSuccessResponse(res, true, parsedMessages, null, 200);
        } catch (e: any) {
            handleError(res, e as Error, "Error updating user role", 500);
        }
    },

    async delete(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const { id } = req.params as { id: number };
        try {
            if (!id) {
                res.status(400).send({ message: "User role not found!" });
                return;
            }
            const [result] = await UserRoleModel.delete(id);
            const rawMessages = result?.messages;
            const parsedMessages = typeof rawMessages === "string" ? JSON.parse(rawMessages) : [];
            sendSuccessResponse(res, true, parsedMessages, null, 200);
        } catch (e: any) {
            handleError(res, e as Error, "Error deleting user role", 500);
        }
    },

    async search(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const { keyword = "", page = 1, limit = 10 } = req.query as SearchParams;
        try {
            const [ rows, [{total} = {total : 0} ]] = await UserRoleModel.search(keyword, page, limit);
            if (!rows?.length) {
                res.send({ message: "No user roles found" });
                return;
            }
            sendSuccessResponse(res, true, "Search result user roles", { rows: rows, total: total }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error searching user roles", 500);
        }
    },
    async formLoad(req: FastifyRequest, res: FastifyReply): Promise<void> {
        try {
            const [users] = await UserModel.getAll();
            const [roles] = await RoleModel.getAll();
            sendSuccessResponse(res, true, "Form load", { users: users, roles: roles }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error loading form", 500);
        }
    },
};
