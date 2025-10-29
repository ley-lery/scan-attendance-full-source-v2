import { FastifyReply, FastifyRequest } from "fastify";
import { handleError, sendSuccessResponse, AuthUserPayload, RequestWithUser } from "../../../../index";
import { StudentLeaveReqReportModel } from "./model";
import { LecturerClassListModel, LecturerCourseListModel, StudentListModel } from "../../../form-load";

type FilterData = {
    classId: number,
    course: number,
    student: number,
    startDate: Date | string,
    endDate: Date | string,
    status: string,
    search: string,
    page: number,
    limit: number
} // 10 parameters

type FilterExportData = {
    classId: number,
    course: number,
    student: number,
    startDate: Date | string,
    endDate: Date | string,
    status: string
} // 7 parameters




const model = StudentLeaveReqReportModel;

export const StudentLeaveReqReportController = {

    async getAll(req: FastifyRequest, res: FastifyReply): Promise<void> {
        try {
            const [rows, [{ total } = { total: 0 }]] = await model.getAll();
            
            if (!rows?.length) {
                res.send({ message: "No student leave request report found" });
                return;
            }

            sendSuccessResponse(res, true, "student leave request report list", { rows: rows, total: total }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching student leave request report", 500);
        }
    },
    async filter(req: RequestWithUser, res: FastifyReply): Promise<void> {
        const userPayload = req.user as AuthUserPayload;
        const data = req.body as FilterData;
       
        try {
            const [rows, [{ total } = { total: 0 }]] = await model.filter(userPayload.assign_to, data);
            
            if (!rows?.length) {
                res.send({ message: "No student leave request report found" });
                return;
            }

            sendSuccessResponse(res, true, "student leave request report list", { rows: rows, total: total }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching student leave request report", 500);
        }
    },
    

    async formLoad(req: RequestWithUser, res: FastifyReply): Promise<void> {
        const userPayload = req.user as AuthUserPayload;
        try {
            const [classes] = await LecturerClassListModel.fullList(userPayload.assign_to);
            const [courses] = await LecturerCourseListModel.fullList(userPayload.assign_to);
            const [statuses] = await StudentListModel.getAll();    

            sendSuccessResponse(res, true, "Form load", { classes: classes, courses: courses, statuses: statuses }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error loading form", 500);
        }
    }

};