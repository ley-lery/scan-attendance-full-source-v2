import { FastifyReply, FastifyRequest } from "fastify";
import { handleError, sendSuccessResponse, AuthUserPayload, RequestWithUser, getClientIP, getSessionInfo } from "../../../../index";
import { Role, SearchParams } from "../../../../types/interface";
import { RoleModel } from "./model";

const model = RoleModel;

export const RoleController = {
    async getAll(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const { page = 1, limit = 10 } = req.query as { page?: number; limit?: number };
        try {
            const [rows, [{ total } = { total: 0 }]] = await model.getAll(page, limit);
            if (!rows?.length) {
                res.send({ message: "No roles found" });
                return;
            }
            sendSuccessResponse(res, true, "roles list", { rows: rows, total: total }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching roles", 500);
        }
    },

    async getById(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const { id } = req.params as { id: number };
        try {
            const [rows] = await model.getById(id);
            if (!rows?.length) {
                res.send({ message: "Role not found" });
                return;
            }
            sendSuccessResponse(res, true, "role details", { row: rows[0] }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching role by ID", 500);
        }
    },

    async create(req: RequestWithUser, res: FastifyReply): Promise<void> {
        const data = req.body as Role;
        const userPayload = req.user as AuthUserPayload;
        
        const updatedData: Role = {
            ...data,
            changedByUser: String(userPayload.user_id),
            clientIp: String(getClientIP(req)),
            sessionInfo: String(getSessionInfo(req))
        };

        try {
            const [result] = await model.create(updatedData);
            const messages = JSON.parse(result?.messages);
            if (messages && messages.length > 0 && messages[0].code === 0) {
                sendSuccessResponse(res, true, messages, null, 200);
            } else {
                res.send({ message: messages[0].message || "Error creating role" });
            }
        } catch (e: any) {
            handleError(res, e as Error, "Error creating role", 500);
        }
    },

    async update(req: RequestWithUser, res: FastifyReply): Promise<void> {
        const { id } = req.params as { id: number };
        const data = req.body as Role;
        const userPayload = req.user as AuthUserPayload;
        
        const updatedData: Role = {
            ...data,
            changedByUser: String(userPayload.user_id),
            clientIp: String(getClientIP(req)),
            sessionInfo: String(getSessionInfo(req))
        };
        try {
            const [result] = await model.update(id, updatedData);
            const messages = JSON.parse(result?.messages);
            if (messages && messages.length > 0 && messages[0].code === 0) {
                sendSuccessResponse(res, true, messages, null, 200);
            } else {
                res.send({ message: messages[0].message || "Error updating role" });
            }
        } catch (e: any) {
            handleError(res, e as Error, "Error updating role", 500);
        }
    },

    async delete(req: RequestWithUser, res: FastifyReply): Promise<void> {
        const { id } = req.params as { id: number };
        const userPayload = req.user as AuthUserPayload;
        
        const updatedData: Role = {
            changedByUser: String(userPayload.user_id),
            clientIp: String(getClientIP(req)),
            sessionInfo: String(getSessionInfo(req))
        };
        try {
            if (!id) {
                res.send({ message: "Role not found!" });
                return;
            }
            const [result] = await model.delete(id, updatedData);
            const rawMessages = result?.messages;
            const parsedMessages = typeof rawMessages === "string" ? JSON.parse(rawMessages) : [];
            sendSuccessResponse(res, true, parsedMessages, null, 200);
        } catch (e: any) {
            handleError(res, e as Error, "Error deleting role", 500);
        }
    },
    async search(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const { keyword = "", page = 1, limit = 10 } = req.query as SearchParams;
        try {
            const [ rows, [{total} = {total : 0} ]] = await model.search(keyword, page, limit);
            if (!rows?.length) {
                res.send({ message: "No role found" });
                return;
            }
            sendSuccessResponse(res, true, "Search result role", { rows: rows, total: total }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error searching role", 500);
        }
    },
};
