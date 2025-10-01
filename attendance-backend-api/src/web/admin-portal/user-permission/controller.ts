import { FastifyReply, FastifyRequest } from "fastify";
import { handleError, sendSuccessResponse } from "../../../utils/response";
import { SearchParams, UserPermission } from "../../../types/interface";
import { UserPermissionModel } from "./model";
import { UserModel } from "../user/model";
import { PermissionModel } from "../permission/model";
import { AuthUserPayload, RequestWithUser } from "../../../middlewares/auth.middleware";

export const UserPermissionController = {
   
    async toggle(req: FastifyRequest, res: FastifyReply): Promise<void> {

        const data = req.body as { user: number; permissions: number[] };

        try {
    
            // Validate input
            if (!Array.isArray(data.permissions)) {
                res.status(400).send({
                    success: false,
                    message: "Permissions must be an array of permission IDs"
                });
                return;
            }
    
            const result = await UserPermissionModel.toggle(data);
    
            // Parse messages if string
            const messages = typeof result.messages === "string" 
                ? JSON.parse(result.messages) 
                : result.messages;
    
            // sendSuccessResponse(res, true, "User permission applied successfully", messages);

            res.status(200).send({
                success: true,
                message: "User permission applied successfully",
                messages: messages
            });
    
        } catch (e) {
            handleError(res, e as Error, "Error toggling user permission", 500);
        }
    },

    async getByUserId(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const { id } = req.params as { id: number };
        try {
            const [result] = await UserPermissionModel.getByUserId(id);
            sendSuccessResponse(res, true, "User permission get by user id successfully", {permissions: result}, 200);
        } catch (e) {
            handleError(res, e as Error, "Error getting user permission by user id", 500);
        }
    },

    async search(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const { keyword = "", page = 1, limit = 10 } = req.query as SearchParams;
        try {
            const [ rows, [{total} = {total : 0} ]] = await UserPermissionModel.search(keyword, page, limit);
            if (!rows?.length) {
                res.send({ message: "No user-permission found" });
                return;
            }
            sendSuccessResponse(res, true, "Search result user-permission", { rows: rows, total: total }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error searching user-permission", 500);
        }
    },

    async getPermissionCurrentUser(req: RequestWithUser, res: FastifyReply): Promise<void> {
        
        const userPayload = req.user as AuthUserPayload;

        try {
            if (!userPayload?.user_id) {
                return sendSuccessResponse(res, false, "Invalid user token", null, 401);
            }
            const [rows] = await UserPermissionModel.getPermissionCurrentUser(userPayload.user_id);
            if (!rows?.length) {
                res.status(404).send({ message: "No users found" });
                return;
            }
            sendSuccessResponse(res, true, "user list", { rows: rows }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching users", 500);
        }
    },

    async formLoad(req: FastifyRequest, res: FastifyReply): Promise<void> {
        try {
            const [users] = await UserModel.getAll();
            const [permissions] = await PermissionModel.getFull();
            sendSuccessResponse(res, true, "Form load", { users: users, permissions: permissions }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error loading form", 500);
        }
    },
};
