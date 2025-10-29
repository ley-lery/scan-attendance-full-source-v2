import { FastifyReply } from "fastify";
import { handleError, sendSuccessResponse } from "../../../utils/response";
import { LecturerCourseModel } from "./model";
import { AuthUserPayload, RequestWithUser } from "../../../middlewares/auth.middleware";


export const LectuerCourseController = {

    async getAll(req: RequestWithUser, res: FastifyReply): Promise<void> {
        const userPayload = req.user as AuthUserPayload;
        const { page = 1, limit = 10 } = req.query as { page?: number; limit?: number };
        try {
            const [rows, [{ total } = { total: 0 }]] = await LecturerCourseModel.getAll(userPayload.assign_to, page, limit);
            
            if (!rows?.length) {
                res.send({ message: "No course of lecturer found" });
                return;
            }

            sendSuccessResponse(res, true, "course of lecturer list", { rows: rows, total:total }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching course of lecturer", 500);
        }
    },

};