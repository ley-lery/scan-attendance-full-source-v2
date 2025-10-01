import { FastifyReply, FastifyRequest } from "fastify";
import { StudentLeaveRequestModel } from "./model";
import { sendSuccessResponse } from "../../../../utils/response";
import { handleError } from "../../../../utils/response";
import { StudentLeaveRequest } from "../../../../types/interface";
import { AuthUserPayload, RequestWithUser } from "../../../../middlewares/auth.middleware";

export const StudentLeaveRequestController = {

    async state(req: RequestWithUser, res: FastifyReply): Promise<void> {
        const { assign_to } = req.user as AuthUserPayload;
        try {
            const rows = await StudentLeaveRequestModel.state(assign_to);

            if (!rows?.length) {
                res.status(404).send({ message: "Leave request not found" });
                return;
            }

            sendSuccessResponse(res, true, "Leave request details", { row: rows[0] }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching leave request by ID", 500);
        }
    },

    async getAll(req: RequestWithUser, res: FastifyReply): Promise<void> {
        const { assign_to } = req.user as AuthUserPayload;
        const { page = 1, limit = 10 } = req.query as { page?: number; limit?: number };
        try {

            const rows = await StudentLeaveRequestModel.getAll(assign_to, page, limit);

            if (!rows?.length) {
                res.status(404).send({ message: "No leave request found" });
                return;
            }

            // Stored procedure returns total as separate select, handle it
            const total = rows[1][0]?.total || 0;

            sendSuccessResponse(res, true, "Leave request list", { rows: rows[0], total }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching student leave requests", 500);
        }
    },

    async getById(req: RequestWithUser, res: FastifyReply): Promise<void> {
        const { assign_to } = req.user as AuthUserPayload;
        const { id } = req.params as { id: number };
        try {
            const rows = await StudentLeaveRequestModel.getById(id, assign_to);

            if (!rows?.length) {
                res.status(404).send({ message: "Leave request not found" });
                return;
            }

            sendSuccessResponse(res, true, "Leave request details", { row: rows[0] }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching leave request by ID", 500);
        }
    },

    async createReq(req: RequestWithUser, res: FastifyReply): Promise<void> {
        const { assign_to } = req.user as AuthUserPayload;
        const data = req.body as StudentLeaveRequest;

        const updateData = {
            studentId: assign_to,
            ...data,
        };
        try {
            const result = await StudentLeaveRequestModel.createReq(updateData);
    
            const messages = JSON.parse(result[0]?.messages || '[]');
    
            if (messages?.[0]?.code === 0) {
                sendSuccessResponse(res, true, messages[0].message, null, 200);
            } else {
                res.status(400).send({ message: messages?.[0]?.message || "Error creating leave request" });
            }
        } catch (e: any) {
            handleError(res, e as Error, "Error creating leave request", 500);
        }
    },

    async cancelReq(req: RequestWithUser, res: FastifyReply): Promise<void> {
        const { assign_to } = req.user as AuthUserPayload;
        const { id } = req.params as { id: number };
        try {
            const result = await StudentLeaveRequestModel.cancelReq(id, assign_to);

            const messages = JSON.parse(result?.messages);
            if (messages?.[0]?.code === 0) {
                sendSuccessResponse(res, true, messages[0].message, null, 200);
            } else {
                res.status(400).send({ message: messages?.[0]?.message || "Error canceling leave request" });
            }
        } catch (e: any) {
            handleError(res, e as Error, "Error canceling leave request", 500);
        }
    },
};
