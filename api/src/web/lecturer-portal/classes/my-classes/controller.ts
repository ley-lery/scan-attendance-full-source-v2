import { FastifyReply, FastifyRequest } from "fastify";
import { handleError, sendSuccessResponse, AuthUserPayload, RequestWithUser } from "../../../../index";
import { LecturerMyClassesModel } from "./model";
import { ClassListModel, FacultyListModel, FieldListModel, LecturerClassListModel, LecturerCourseListModel } from "../../../form-load";

type FilterData = {
    lecturer: number,
    faculty: number,
    field: number,
    programType: string,
    promotionNo: number,
    termNo: number,
    classId: number,
    status: string,
    startDate: Date,
    endDate: Date, 
    search: string
}

const programTypes: { value: string; label: string }[] = [];
programTypes.push({ value: "Bachelor", label: "Bachelor" });
programTypes.push({ value: "Associate", label: "Associate" });

const promotionNos: { value: string; label: string }[] = [];
for (let i = 1; i <= 22; i++) {
    promotionNos.push({ value: `${i}`, label: `Promotion ${i}` });
}
const termNos: { value: string; label: string }[] = [];
for (let i = 1; i <= 8; i++) {
    termNos.push({ value: `${i}`, label: `Term ${i}` });
}

const dayOfWeeks: { value: string; label: string }[] = [];
dayOfWeeks.push({ value: "Monday", label: "Monday" });
dayOfWeeks.push({ value: "Tuesday", label: "Tuesday" });
dayOfWeeks.push({ value: "Wednesday", label: "Wednesday" });
dayOfWeeks.push({ value: "Thursday", label: "Thursday" });
dayOfWeeks.push({ value: "Friday", label: "Friday" });
dayOfWeeks.push({ value: "Saturday", label: "Saturday" });
dayOfWeeks.push({ value: "Sunday", label: "Sunday" });

const model = LecturerMyClassesModel;

export const LecturerMyClassesController = {

    async getAll(req: RequestWithUser, res: FastifyReply): Promise<void> {
        const userPayload = req.user as AuthUserPayload;
        try {
            const [rows] = await model.getAll(userPayload.assign_to);
            
            if (!rows?.length) {
                res.send({ message: "No classes of lecturer found" });
                return;
            }

            sendSuccessResponse(res, true, "classes of lecturer list", { rows: rows }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching classes of lecturer", 500);
        }
    },
    
    async filter(req: RequestWithUser, res: FastifyReply): Promise<void> {
        const userPayload = req.user as AuthUserPayload;
        const data = req.body as FilterData;
        try {
            const [rows] = await model.filter(userPayload.assign_to, data);
            
            if (!rows?.length) {
                res.send({ message: "No classes of lecturer found" });
                return;
            }

            sendSuccessResponse(res, true, "classes of lecturer list", { rows: rows }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching classes of lecturer", 500);
        }
    },

    async formLoad(req: RequestWithUser, res: FastifyReply): Promise<void> {
        const userPayload = req.user as AuthUserPayload;
        try {
            const [classes] = await LecturerClassListModel.fullList(userPayload.assign_to);
            const [courses] = await LecturerCourseListModel.fullList(userPayload.assign_to);

            sendSuccessResponse(res, true, "Form load", { classes: classes, courses: courses, programTypes: programTypes, promotionNos: promotionNos, termNos: termNos, dayOfWeeks: dayOfWeeks }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error loading form", 500);
        }
    }

};