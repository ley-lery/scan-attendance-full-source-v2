import { FastifyReply, FastifyRequest } from "fastify";
import { handleError, sendSuccessResponse, AuthUserPayload, RequestWithUser } from "../../../../index";
import { StudentAttendanceReportModel } from "./model";
import { ClassListModel, CourseListModel, CourseProgramListModel, FacultyListModel, FieldListModel, StudentListModel } from "../../../form-load";
type FilterData = {
    classId: number,
    course: number,
    student: number,
    faculty: number,
    field: number,
    programType: string,
    promotionNo: number,
    termNo: number,
    startDate: Date | string,
    endDate: Date | string,
    search: string,
    page: number,
    limit: number
} // 13 parameters or 13 ?

type FilterExportData = {
    classId: number,
    course: number,
    student: number,
    faculty: number,
    field: number,
    programType: string,
    promotionNo: number,
    termNo: number,
    startDate: Date | string,
    endDate: Date | string
} // 11 parameters or 11 
const model = StudentAttendanceReportModel;

export const StudentAttendanceReportController = {

    async getAll(req: FastifyRequest, res: FastifyReply): Promise<void> {
        try {
            const [rows, [{ total } = { total: 0 }]] = await model.getAll();
            
            if (!rows?.length) {
                res.send({ message: "No schedule of lecturer found" });
                return;
            }

            sendSuccessResponse(res, true, "student attendance report list", { rows: rows, total: total }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching student attendance report", 500);
        }
    },
    async filter(req: RequestWithUser, res: FastifyReply): Promise<void> {
        const userPayload = req.user as AuthUserPayload;
        const data = req.body as FilterData;
   
        try {
            const [rows, [{ total } = { total: 0 }]] = await model.filter(userPayload.assign_to, data);
            
            if (!rows?.length) {
                res.send({ message: "No schedule of lecturer found" });
                return;
            }

            sendSuccessResponse(res, true, "student attendance report list", { rows: rows, total: total }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching student attendance report", 500);
        }
    },

    async formLoad(req: FastifyRequest, res: FastifyReply): Promise<void> {
        try {
            const [faculties] = await FacultyListModel.getAll();
            const [fields] = await FieldListModel.getAll();
            const [classes] = await ClassListModel.getAll();
            const [courses] = await CourseListModel.getAll();
            const [students] = await StudentListModel.getAll();

            sendSuccessResponse(res, true, "Form load", { faculties: faculties, fields: fields, classes: classes, courses: courses, students: students }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error loading form", 500);
        }
    }

};