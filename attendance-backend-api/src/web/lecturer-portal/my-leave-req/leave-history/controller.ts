import { FastifyReply } from "fastify";
import { sendSuccessResponse } from "../../../../utils/response";
import { handleError } from "../../../../utils/response";
import { AuthUserPayload, RequestWithUser } from "../../../../middlewares/auth.middleware";
import { LectureLeaveHistoryModel } from "./model";
import { LectureLeaveFilter } from "../../../../types/interface";

const model = LectureLeaveHistoryModel;

export const LectureLeaveHistoryController = {

    async getAll(req: RequestWithUser, res: FastifyReply): Promise<void> {
        const { assign_to } = req.user as AuthUserPayload;
        const { page = 1, limit = 10 } = req.query as { page?: number; limit?: number };
        try {

            const rows = await model.getAll(assign_to, page, limit);

            if (!rows?.length) {
                res.status(404).send({ message: "No leave history found" });
                return;
            }

            // Stored procedure returns total as separate select, handle it
            const total = rows[1][0]?.total || 0;

            sendSuccessResponse(res, true, "Leave history list", { rows: rows[0], total }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching student leave history", 500);
        }
    },

    async getById(req: RequestWithUser, res: FastifyReply): Promise<void> {
        const { assign_to } = req.user as AuthUserPayload;
        const { id } = req.params as { id: number };
        try {
            const rows = await model.getById(id, assign_to);

            if (!rows?.length) {
                res.status(404).send({ message: "Leave history not found" });
                return;
            }

            sendSuccessResponse(res, true, "Leave history details", { row: rows[0] }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching leave history by ID", 500);
        }
    },

    async formLoad(req: RequestWithUser, res: FastifyReply): Promise<void> {
        const { assign_to } = req.user as AuthUserPayload;
        try {
            const [[states]] = await model.state(assign_to);
            const status = [
                { id: 'Pending', label: 'Pending' },
                { id: 'Approved', label: 'Approved' },
                { id: 'Rejected', label: 'Rejected' },
                { id: 'Cancelled', label: 'Cancelled' },
            ]

            sendSuccessResponse(res, true, "Student Leave History form load.", { states: states, status: status }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching student leave history form load", 500);
        }
    },

    async filter(req: RequestWithUser, res: FastifyReply): Promise<void> {
        const { assign_to: lecturerId } = req.user as AuthUserPayload;
        const data = req.body as LectureLeaveFilter;
        console.log(data, "data");

        try {
            const rows = await model.filter(lecturerId, data);

            if (!rows?.length) {
                res.send({ message: "No leave history found" });
                return;
            }

            const total = rows[1][0]?.total || 0;

            sendSuccessResponse(res, true, "Leave history list", { rows: rows[0], total }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching student leave history", 500);
        }
    },
};
