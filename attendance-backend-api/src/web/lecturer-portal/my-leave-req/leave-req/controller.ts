import { FastifyReply } from "fastify";
import { LecturerLeaveRequestModel } from "./model";
import { sendSuccessResponse } from "../../../../utils/response";
import { handleError } from "../../../../utils/response";
import { LectureLeaveRequest } from "../../../../types/interface";
import { AuthUserPayload, RequestWithUser } from "../../../../middlewares/auth.middleware";

const model = LecturerLeaveRequestModel;

export const LecturerLeaveRequestController = {

    async state(req: RequestWithUser, res: FastifyReply): Promise<void> {
        const { assign_to: lecturerId } = req.user as AuthUserPayload;
        try {
            const rows = await model.state(lecturerId);

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
        const { assign_to: lecturerId } = req.user as AuthUserPayload;
        const { page = 1, limit = 10 } = req.query as { page?: number; limit?: number };
        try {

            const rows = await model.getAll(lecturerId, page, limit);

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
        const { assign_to: lecturerId } = req.user as AuthUserPayload;
        const { id } = req.params as { id: number };
        try {
            const rows = await model.getById(id, lecturerId);

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
        const { assign_to: lecturerId } = req.user as AuthUserPayload;
        const data = req.body as LectureLeaveRequest;

        const updateData = {
            lecturerId,
            ...data,
        };
        try {
            const result = await model.createReq(updateData);
    
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
        const { assign_to: lecturerId } = req.user as AuthUserPayload;
        const { id } = req.body as { id: number };
        try {
            const [result] = await model.cancelReq(id, lecturerId);
            console.log(result, "result");

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
