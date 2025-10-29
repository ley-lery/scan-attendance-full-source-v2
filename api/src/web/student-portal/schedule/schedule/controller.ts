import { FastifyReply } from "fastify";
import { handleError, sendSuccessResponse } from "../../../../utils/response";
import { ScheduleModel } from "./model";
import { AuthUserPayload, RequestWithUser } from "../../../../middlewares/auth.middleware";


export const ScheduleController = {

    async getStudentSchedule(req: RequestWithUser, res: FastifyReply): Promise<void> {
        const userPayload = req.user as AuthUserPayload;
        try {   
            const result = await ScheduleModel.getStudentSchedule(userPayload.assign_to);
            const rows = result[0];
            const statistics = result[1][0];

            if (!rows?.length) {
                res.status(404).send({ message: "No schedule found" });
                return;
            }
            sendSuccessResponse(res, true, "Student schedule", { rows: rows, statistics: statistics }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching student schedule", 500);
        }
    },

};