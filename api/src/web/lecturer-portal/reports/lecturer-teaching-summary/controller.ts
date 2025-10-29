import { FastifyReply, FastifyRequest } from "fastify";
import { handleError, sendSuccessResponse, AuthUserPayload, RequestWithUser } from "../../../../index";
import { LecturerTeachingSummaryReportModel } from "./model";
import { LecturerCourseListModel } from "../../../form-load";
type FilterData = {
    courseId: number,
    startDate: Date | string,
    endDate: Date | string,
    search: string,
    page: number,
    limit: number
} // 7 parameters



const model = LecturerTeachingSummaryReportModel;

export const LecturerTeachingSummaryReportController = {

    async getAll(req: FastifyRequest, res: FastifyReply): Promise<void> {
        try {
            const [rows, [{ total } = { total: 0 }]] = await model.getAll();
            
            if (!rows?.length) {
                res.send({ message: "No lecturer teaching summary report found" });
                return;
            }

            sendSuccessResponse(res, true, "lecturer teaching summary report list", { rows: rows, total: total }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching lecturer teaching summary report", 500);
        }
    },
    async filter(req: RequestWithUser, res: FastifyReply): Promise<void> {
        const userPayload = req.user as AuthUserPayload;
        const data = req.body as FilterData;
        console.log({
            lecturerId: userPayload.assign_to,
            data: data
        }, "data");
        try {
            const [rows, [{ total } = { total: 0 }]] = await model.filter(userPayload.assign_to, data);
            
            if (!rows?.length) {
                res.send({ message: "No lecturer teaching summary report found" });
                return;
            }

            sendSuccessResponse(res, true, "lecturer teaching summary report list", { rows: rows, total: total }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching lecturer teaching summary report", 500);
        }
    },

    async formLoad(req: RequestWithUser, res: FastifyReply): Promise<void> {
        const userPayload = req.user as AuthUserPayload;
        try {
            const [courses] = await LecturerCourseListModel.fullList(userPayload.assign_to);

            sendSuccessResponse(res, true, "Form load", { courses: courses }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error loading form", 500);
        }
    }

};