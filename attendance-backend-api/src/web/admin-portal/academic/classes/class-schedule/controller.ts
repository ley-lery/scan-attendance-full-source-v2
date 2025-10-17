import { FastifyReply, FastifyRequest } from "fastify";
import { handleError, sendSuccessResponse, AuthUserPayload, RequestWithUser } from "../../../../../../src/index";
import { ScheduleModel } from "./model";
import { CourseModel } from "../../course/model";
import { ClassModel } from "../manage-class/model";
import { LecturerModel } from "../../../lecturer/manage-lecturer/model";
import { Schedule, ScheduleUpdate } from "../../../../../types/interface";

const model = ScheduleModel;

export const ScheduleController = {

    async getClassSchedule(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const { classId } = req.params as { classId: number };
        try {
            const [rows, [{ total } = { total: 0 }]] = await model.getClassSchedule(classId);

            if (!rows?.length) {
                res.send({ message: "No class found" });
                return;
            }

            sendSuccessResponse(res, true, "Class list", { rows: rows, total:total }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching students", 500);
        }
    },

    async getStudentSchedule(req: RequestWithUser, res: FastifyReply): Promise<void> {
        const userPayload = req.user as AuthUserPayload;
        try {   
            const [ rows ] = await model.getStudentSchedule(userPayload.user_id);

            if (!rows?.length) {
                res.send({ message: "No schedule found" });
                return;
            }
            sendSuccessResponse(res, true, "Student schedule", { rows: rows, statistics: rows[0] }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching student schedule", 500);
        }
    },

    async getAllClassSchedule(req: RequestWithUser, res: FastifyReply): Promise<void> {
        const { page = 1, limit = 10 } = req.query as { page?: number; limit?: number };
        try {   
            const [rows, [{ total } = { total: 0 }]] = await model.getAllClassSchedule(page, limit);

            if (!rows?.length) {
                res.send({ message: "No class schedule found" });
                return;
            }

            sendSuccessResponse(res, true, "Class schedule list", { rows: rows, total:total }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching class schedule", 500);
        }
    },

    async createSchedule(req: RequestWithUser, res: FastifyReply): Promise<void> {
        const data = req.body as Schedule;
    
        try {
            const [result] = await model.createSchedule(data);
            
            const messages = JSON.parse(result?.messages);
            const successMessage = messages.find((item: any) => item.code === 0)?.message;

            if (successMessage) {
                sendSuccessResponse(res, true, successMessage || "Class schedule created successfully.", null, 200);
            } else {
                res.send({ message: successMessage || "Error creating schedule" });
            }
        } catch (e: any) {
            handleError(res, e as Error, "Error creating schedule", 500);
        }
    },
        
    
    async updateSchedule(req: RequestWithUser, res: FastifyReply): Promise<void> {
        const data = req.body as ScheduleUpdate;
        const { id } = req.params as { id: number };
     
        try {
            
            const [result] = await model.update(id, data);
            
            const messages = JSON.parse(result?.messages);
            if (messages && messages.length > 0 && messages[0].code === 0) {
                sendSuccessResponse(res, true, messages, null, 200);
            }else{
                res.send({ message: messages[0].message || "Error updating schedule" });
            }
        } catch (e: any) {
            handleError(res, e as Error, "Error updating schedule", 500);
        }
    },

    async formLoad(req: FastifyRequest, res: FastifyReply): Promise<void> {
        try {
            const [classes] = await ClassModel.getAll();
            const [courses] = await CourseModel.getAll();
            const [lecturers] = await LecturerModel.getAll();

            sendSuccessResponse(res, true, "Form load", { classes: classes, courses: courses, lecturers: lecturers }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error loading form", 500);
        }
    }
   

};