import { FastifyReply, FastifyRequest } from "fastify";
import { StudentLeaveRequestModel } from "./model";
import { sendSuccessResponse } from "../../../../utils/response";
import { handleError } from "../../../../utils/response";
import { StudentLeaveRequest } from "../../../../types/interface";

export const StudentLeaveRequestController = {

    async getAll(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const { studentId, offset = 0, limit = 10 } = req.body as { studentId: number; offset?: number; limit?: number };
        try {

            const rows = await StudentLeaveRequestModel.getAll(studentId, offset, limit);

            console.log(rows[1][0], "rows");

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

    async getById(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const { studentId, id } = req.body as { studentId: number, id: number };
        try {
            const rows = await StudentLeaveRequestModel.getById(id, studentId);

            console.log(rows, "rows");

            if (!rows?.length) {
                res.status(404).send({ message: "Leave request not found" });
                return;
            }

            sendSuccessResponse(res, true, "Leave request details", { row: rows[0] }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching leave request by ID", 500);
        }
    },

    async createReq(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const data = req.body as StudentLeaveRequest;
        try {
            const result = await StudentLeaveRequestModel.createReq(data);
    
            console.log(result, "result");
    
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

    async cancelReq(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const { studentId, id } = req.body as { studentId: number, id: number };
        try {
            const result = await StudentLeaveRequestModel.cancelReq(id, studentId);

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
