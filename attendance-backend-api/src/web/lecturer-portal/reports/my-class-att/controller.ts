import { FastifyReply } from "fastify";
import { handleError, sendSuccessResponse, AuthUserPayload, RequestWithUser } from "../../../../index";
import { MyClassAttendanceReportModel } from "./model";
import { LecturerClassListModel, LecturerCourseListModel } from "../../../form-load";

type FilterData = {
    classId: number,
    course: number,
    startDate: Date | string,
    endDate: Date | string,
} // 8 parameters



const model = MyClassAttendanceReportModel;

export const MyClassAttendanceReportController = {

    async getAll(req: RequestWithUser, res: FastifyReply): Promise<void> {
        try {
            const [rows] = await model.getAll();
            
            if (!rows?.length) {
                res.send({ message: "No my class attendance report found" });
                return;
            }

            sendSuccessResponse(res, true, "my class attendance report list", { rows: rows }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching my class attendance report", 500);
        }
    },
    async filter(req: RequestWithUser, res: FastifyReply): Promise<void> {
        const userPayload = req.user as AuthUserPayload;
        const data = req.body as FilterData;
       
        try {
            const [rows] = await model.filter(userPayload.assign_to, data);
            
            if (!rows?.length) {
                res.send({ message: "No my class attendance report found" });
                return;
            }

            sendSuccessResponse(res, true, "my class attendance report list", { rows: rows }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching my class attendance report", 500);
        }
    },
 

    async formLoad(req: RequestWithUser, res: FastifyReply): Promise<void> {
        const userPayload = req.user as AuthUserPayload;
        try {
            const [classes] = await LecturerClassListModel.fullList(userPayload.assign_to);
            const [courses] = await LecturerCourseListModel.fullList(userPayload.assign_to);

            sendSuccessResponse(res, true, "Form load", { classes: classes, courses: courses }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error loading form", 500);
        }
    }

};