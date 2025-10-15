import { FastifyReply, FastifyRequest } from "fastify";
import { handleError, sendSuccessResponse, showValidation } from "../../../../utils/response";
import { Permission, SearchParams } from "../../../../types/interface";
import { PermissionModel } from "./model";
import { AuthUserPayload, RequestWithUser } from "../../../../middlewares/auth.middleware";
import { getClientIP, getSessionInfo } from "../../../../helpers/audit-log";

const model = PermissionModel;

export const PermissionController = {
    async getAll(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const { page = 1, limit = 10 } = req.query as { page?: number; limit?: number };
        try {
            const [rows, [{ total } = { total: 0 }]] = await model.getAll(page, limit);
            if (!rows?.length) {
                res.send({ message: "No permissions found" });
                return;
            }
            sendSuccessResponse(res, true, "permissions list", { rows: rows, total: total }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching permissions", 500);
        }
    },

    async getById(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const { id } = req.params as { id: number };
        try {
            const [rows] = await model.getById(id);
            if (!rows?.length) {
                res.send({ message: "Permission not found" });
                return;
            }
            sendSuccessResponse(res, true, "permission details", { row: rows[0] }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching permission by ID", 500);
        }
    },

    async create(req: RequestWithUser, res: FastifyReply): Promise<void> {
        const data = req.body as Permission;
        const userPayload = req.user as AuthUserPayload;
        
        const updatedData: Permission = {
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
                res.send({ message: messages[0].message || "Error creating permission" });
            }
        } catch (e: any) {
            handleError(res, e as Error, "Error creating permission", 500);
        }
    },
    async generate(req: RequestWithUser, res: FastifyReply): Promise<void> {
        const data = req.body as { table: string };
        const userPayload = req.user as AuthUserPayload;
        
        const updatedData: { changedByUser: string; clientIp: string; sessionInfo: string } = {
            changedByUser: String(userPayload.user_id),
            clientIp: String(getClientIP(req)),
            sessionInfo: String(getSessionInfo(req))
        };

        try {
            const [result] = await model.generate(data, updatedData);
            const messages = JSON.parse(result?.messages);
            if (messages && messages.length > 0 && messages[0].code === 0) {
                sendSuccessResponse(res, true, messages, null, 200);
            } else {
                res.send({ message: messages[0].message || "Error generating permission" });
            }
        } catch (e: any) {
            handleError(res, e as Error, "Error generating permission", 500);
        }
    },

    async update(req: RequestWithUser, res: FastifyReply): Promise<void> {
        const { id } = req.params as { id: number };
        const data = req.body as Permission;
        const userPayload = req.user as AuthUserPayload;
        
        const updatedData: Permission = {
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
                res.send({ message: messages[0].message || "Error updating permission" });
            }
        } catch (e: any) {
            handleError(res, e as Error, "Error updating permission", 500);
        }
    },

    async delete(req: RequestWithUser, res: FastifyReply): Promise<void> {
        const { id } = req.params as { id: number };
        const userPayload = req.user as AuthUserPayload;
        
        const updatedData: Permission = {
            changedByUser: String(userPayload.user_id),
            clientIp: String(getClientIP(req)),
            sessionInfo: String(getSessionInfo(req))
        };
        try {
            if (!id) {
                res.send({ message: "Permission not found!" });
                return;
            }
            const [result] = await model.delete(id, updatedData);
            const rawMessages = result?.messages;
            const parsedMessages = typeof rawMessages === "string" ? JSON.parse(rawMessages) : [];
            sendSuccessResponse(res, true, parsedMessages, null, 200);
        } catch (e: any) {
            handleError(res, e as Error, "Error deleting permission", 500);
        }
    },
    async search(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const { keyword = "", page = 1, limit = 10 } = req.query as SearchParams;
        try {
            const [ rows, [{total} = {total : 0} ]] = await model.search(keyword, page, limit);
            if (!rows?.length) {
                res.send({ message: "No permissions found" });
                return;
            }
            sendSuccessResponse(res, true, "Search result permissions", { rows: rows, total: total }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error searching permissions", 500);
        }
    },
};
