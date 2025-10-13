import { FastifyReply, FastifyRequest } from "fastify";
import { handleError, sendSuccessResponse } from "../../../../utils/response";
import { AuthUserPayload, RequestWithUser } from "../../../../index";
import { ClassAttendanceRecordModel } from "./model";

const model = ClassAttendanceRecordModel;

export const classAttendanceRecordController = {

    async getAll(req: RequestWithUser, res: FastifyReply): Promise<void> {
        const { page = 1, limit = 10 } = req.query as { page?: number; limit?: number };
        const userPayload = req.user as AuthUserPayload;
        try {
            const [rows, [{ total } = { total: 0 }]] = await model.getAll(userPayload.assign_to, page, limit);

            if (!rows?.length) {
                res.send({ message: "No class attendance record found" });
                return;
            }

            sendSuccessResponse(res, true, "class attendance record list", { rows: rows, total:total }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching class attendance record", 500);
        }
    },

    async getDetail(req: RequestWithUser, res: FastifyReply): Promise<void> {
        const data = req.body as { classId: number; course: number };
        const userPayload = req.user as AuthUserPayload;
        try {
            const result = await model.getDetail(userPayload.assign_to, data);
            
            const classSummary = result[0][0];
            const studentSessions = result[1][0];

            if (!result?.length) {
                res.send({ message: "No class attendance record found" });
                return;
            }

            sendSuccessResponse(res, true, "class attendance record list", { class_summary: classSummary, student_sessions: studentSessions }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching class attendance record", 500);
        }
    },

};