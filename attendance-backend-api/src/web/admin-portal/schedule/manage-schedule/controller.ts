import { FastifyReply, FastifyRequest } from "fastify";
import { handleError, sendSuccessResponse } from "../../../../utils/response";
import { Schedule } from "../../../../types/interface";
import { ScheduleModel } from "./model";
import { AuthUserPayload, RequestWithUser } from "../../../../middlewares/auth.middleware";
import { ClassModel } from "../../class/model";
import { CourseModel } from "../../course/model";
import { LecturerModel } from "../../lecturer/model";


export const ScheduleController = {

    async getClassSchedule(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const { classId } = req.params as { classId: number };
        try {
            const [rows, [{ total } = { total: 0 }]] = await ScheduleModel.getClassSchedule(classId);

            if (!rows?.length) {
                res.status(404).send({ message: "No class found" });
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
            const [ rows ] = await ScheduleModel.getStudentSchedule(userPayload.user_id);

            if (!rows?.length) {
                res.status(404).send({ message: "No schedule found" });
                return;
            }
            sendSuccessResponse(res, true, "Student schedule", { rows: rows }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching student schedule", 500);
        }
    },

    async getAllClassSchedule(req: RequestWithUser, res: FastifyReply): Promise<void> {
        const { page = 1, limit = 10 } = req.query as { page?: number; limit?: number };
        try {   
            const [rows, [{ total } = { total: 0 }]] = await ScheduleModel.getAllClassSchedule(page, limit);

            if (!rows?.length) {
                res.status(404).send({ message: "No class schedule found" });
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
            const [result] = await ScheduleModel.createSchedule(data);
            
            const messages = JSON.parse(result?.messages);
            const successMessage = messages.find((item: any) => item.code === 0)?.message;

            console.log(successMessage); 


           
            if (successMessage) {
                sendSuccessResponse(res, true, successMessage || "Class schedule created successfully.", null, 200);
            } else {
                res.status(400).send({ message: successMessage || "Error creating schedule" });
            }
        } catch (e: any) {
            handleError(res, e as Error, "Error creating schedule", 500);
        }
    },
        
    
    async updateSchedule(req: RequestWithUser, res: FastifyReply): Promise<void> {
        const data = req.body as Schedule;
        const { id } = req.params as { id: number };
     
        try {
            
            const [result] = await ScheduleModel.update(id, data);
            
            const messages = JSON.parse(result?.messages);
            if (messages && messages.length > 0 && messages[0].code === 0) {
                sendSuccessResponse(res, true, messages, null, 200);
            }else{
                res.status(400).send({ message: messages[0].message || "Error updating schedule" });
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