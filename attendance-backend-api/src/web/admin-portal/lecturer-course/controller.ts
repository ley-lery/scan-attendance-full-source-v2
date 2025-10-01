import { FastifyReply, FastifyRequest } from "fastify";
import { handleError, sendSuccessResponse, showValidation } from "../../../utils/response";
import { validateLecturerCourseData } from "../../../utils";
import { LecturerCourse, SearchParams } from "../../../types/interface";
import { LecturerCourseModel } from "./model";
import { LecturerModel } from "../lecturer/model";
import { CourseModel } from "../course/model";
import { AuthUserPayload, RequestWithUser } from "../../../middlewares/auth.middleware";
import { getClientIP, getSessionInfo } from "../../../helpers/audit-log";


export const LecturerCourseController = {

    async getAll(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const { page = 1, limit = 10 } = req.query as { page?: number; limit?: number };
        try {
            const [rows, [{ total } = { total: 0 }]] = await LecturerCourseModel.getAll(page, limit);

            if (!rows?.length) {
                res.status(404).send({ message: "No lecturers course found" });
                return;
            }

            sendSuccessResponse(res, true, "Lecturers course list", { rows: rows, total:total }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching lecturers course", 500);
        }
    },

    async getById(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const { id } = req.params as { id: number };
        try {
            const [rows] = await LecturerCourseModel.getById(id);

            if (!rows?.length) {
                res.status(404).send({ message: "lecturer course not found" });
                return;
            }
            sendSuccessResponse(res, true, "Lecturer course details", { row: rows[0] }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching lecturer course by ID", 500);
        }
    },

    async create(req: RequestWithUser, res: FastifyReply): Promise<void> {
        const data = req.body as LecturerCourse;
        const userPayload = req.user as AuthUserPayload;
        
        const updatedData: LecturerCourse = {
            ...data,
            changedByUser: String(userPayload.user_id),
            clientIp: String(getClientIP(req)),
            sessionInfo: String(getSessionInfo(req))
        };
        try {
            
            const [result] = await LecturerCourseModel.create(updatedData);
            
            const messages = JSON.parse(result?.messages);
            if (messages && messages.length > 0 && messages[0].code === 0) {
                sendSuccessResponse(res, true, messages, null, 200);
            }else{
                res.status(400).send({ message: messages[0].message || "Error updating lecturer course" });
            }
        } catch (e: any) {
            handleError(res, e as Error, "Error creating lecturer course", 500);
        }
    },

    async update(req: RequestWithUser, res: FastifyReply): Promise<void> {
        const { id } = req.params as { id: number };
        const data = req.body as LecturerCourse;
        const userPayload = req.user as AuthUserPayload;
        
        const updatedData: LecturerCourse = {
            ...data,
            changedByUser: String(userPayload.user_id),
            clientIp: String(getClientIP(req)),
            sessionInfo: String(getSessionInfo(req))
        };
        try {
            const [result] = await LecturerCourseModel.update(id, updatedData);
            const messages = JSON.parse(result?.messages) ;
            if (messages && messages.length > 0 && messages[0].code === 0) {
                sendSuccessResponse(res, true, messages, null, 200);
            }else{
                res.status(400).send({ message: messages[0].message || "Error updating lecturer course" });
            }
            
        } catch (e: any) {
            handleError(res, e as Error, "Error updating lecturer course", 500);
        }
    },

    async delete(req: RequestWithUser, res: FastifyReply): Promise<void> {
        const { id } = req.params as { id: number };
        const userPayload = req.user as AuthUserPayload;
        
        const updatedData: LecturerCourse = {
            changedByUser: String(userPayload.user_id),
            clientIp: String(getClientIP(req)),
            sessionInfo: String(getSessionInfo(req))
        };
        try {
            if (!id) {
                res.status(400).send({ message: "lecturer course not found!" });
                return;
            }
            const [result] = await LecturerCourseModel.delete(id, updatedData);
            const rawMessages = result?.messages;
            const parsedMessages = typeof rawMessages === "string" ? JSON.parse(rawMessages) : [];
            sendSuccessResponse(res, true, parsedMessages, null, 200);
        } catch (e: any) {
            handleError(res, e as Error, "Error deleting lecturer course", 500);
        }
    },

    async search(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const { keyword = "", page = 1, limit = 10 } = req.query as SearchParams;
        try {
            const [ rows, [{total} = {total : 0} ]] = await LecturerCourseModel.search(keyword, page, limit);
            if (!rows?.length) {
                res.send({ message: "No lecturer course found" });
                return;
            }
            sendSuccessResponse(res, true, "Search result lecturer course", { rows: rows, total: total }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error searching lecturer course", 500);
        }
    },

    async formLoad(req: FastifyRequest, res: FastifyReply): Promise<void> {
        try {
            const [lecturerList] = await LecturerModel.getAll();
            const [courseList] = await CourseModel.getAll();

            sendSuccessResponse(res, true, "Form load", { lecturerList: lecturerList, courseList: courseList }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error loading form", 500);
        }
    }

};