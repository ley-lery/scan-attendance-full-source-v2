import { FastifyReply } from "fastify";
import { handleError, sendSuccessResponse, AuthUserPayload, RequestWithUser } from "../../../../index";
import { LecturerScheduleModel } from "./model";
import { LecturerClassListModel, LecturerCourseListModel } from "../../../form-load";
type FilterData = {
    programType: string;
    promotionNo: number;
    termNo: number;
    classId: number;
    course: number;
    dayOfWeek: string;
    status: string;
    startDate: Date;
    endDate: Date;
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


const model = LecturerScheduleModel;

export const LectuerScheduleController = {

    async getAll(req: RequestWithUser, res: FastifyReply): Promise<void> {
        const userPayload = req.user as AuthUserPayload;
        try {
            const result = await model.getAll(userPayload.assign_to);
            const rows = result[0];
            const statistics = result[1][0];
            
            if (!rows?.length) {
                res.send({ message: "No schedule of lecturer found" });
                return;
            }

            sendSuccessResponse(res, true, "schedule of lecturer list", { rows: rows, statistics: statistics }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching schedule of lecturer", 500);
        }
    },
    async filter(req: RequestWithUser, res: FastifyReply): Promise<void> {
        const userPayload = req.user as AuthUserPayload;
        const data = req.body as FilterData;
        try {
            const result = await model.filter(userPayload.assign_to, data);
            const rows = result[0];
            const statistics = result[1][0];
            
            if (!rows?.length) {
                res.send({ message: "No schedule of lecturer found" });
                return;
            }

            sendSuccessResponse(res, true, "schedule of lecturer list", { rows: rows, statistics: statistics }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching schedule of lecturer", 500);
        }
    },
    async formLoad(req: RequestWithUser, res: FastifyReply): Promise<void> {
        const userPayload = req.user as AuthUserPayload;
        try {
            const [classes] = await LecturerClassListModel.fullList(userPayload.assign_to);
            const [courses] = await LecturerCourseListModel.fullList(userPayload.assign_to);

            sendSuccessResponse(res, true, "Form load", { classes: classes, courses: courses, programType: programTypes, promotionNo: promotionNos, termNo: termNos, dayOfWeek: dayOfWeeks }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error loading form", 500);
        }
    }

};