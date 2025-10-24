import { FastifyReply, FastifyRequest } from "fastify";
import { handleError, sendSuccessResponse } from "../../../../../utils/response";
import { SearchParams, Student } from "../../../../../types/interface";
import { ClassStudentModel } from "./model";
import { ClassModel } from "../manage-class/model";
import { StudentModel } from "../../../student/manage-student/model";
import { AuthUserPayload, RequestWithUser } from "../../../../../middlewares/auth.middleware";
import { getClientIP, getSessionInfo } from "../../../../../helpers/audit-log";

const model = ClassStudentModel;

export const ClassStudentController = {

    async getAll(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const { page = 1, limit = 10 } = req.query as { page?: number; limit?: number };
        try {
            const [rows, [{ total } = { total: 0 }]] = await model.getAll(page, limit);

            if (!rows?.length) {
                res.send({ message: "No students class found" });
                return;
            }

            sendSuccessResponse(res, true, "students class list", { rows: rows, total:total }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching students class", 500);
        }
    },

    async getById(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const { id } = req.params as { id: number };
        try {
            const [rows] = await model.getById(id);

            if (!rows?.length) {
                res.send({ message: "student class not found" });
                return;
            }
            sendSuccessResponse(res, true, "Student class details", { row: rows[0] }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching student class by ID", 500);
        }
    },

    async create(req: RequestWithUser, res: FastifyReply): Promise<void> {
        const data = req.body as any;
        const userPayload = req.user as AuthUserPayload;
        
        const updatedData = {
            ...data,
            changedByUser: String(userPayload.user_id),
            clientIp: String(getClientIP(req)),
            sessionInfo: String(getSessionInfo(req))
        };
        console.log(updatedData, 'Create');
        try {
            
            const [result] = await model.createMultiple(updatedData);
            
            const messages = JSON.parse(result?.messages);
            if (messages && messages.length > 0 && messages[0].code === 0) {
                sendSuccessResponse(res, true, messages, null, 200);
            }else{
                res.status(400).send({ message: messages[0].message || "Error updating student class" });
            }
        } catch (e: any) {
            handleError(res, e as Error, "Error creating student class", 500);
        }
    },

    async update(req: RequestWithUser, res: FastifyReply): Promise<void> {
        const { id } = req.params as { id: number };
        const data = req.body as any;
        const userPayload = req.user as AuthUserPayload;
        
        const updatedData = {
            ...data,
            changedByUser: String(userPayload.user_id),
            clientIp: String(getClientIP(req)),
            sessionInfo: String(getSessionInfo(req))
        };
        try {

            const [result] = await model.update(id, updatedData);
            const messages = JSON.parse(result?.messages) ;
            if (messages && messages.length > 0 && messages[0].code === 0) {
                sendSuccessResponse(res, true, messages, null, 200);
            }else{
                res.status(400).send({ message: messages[0].message || "Error updating student class" });
            }
            
        } catch (e: any) {
            handleError(res, e as Error, "Error updating student class", 500);
        }
    },

    async delete(req: RequestWithUser, res: FastifyReply): Promise<void> {
        const { id } = req.params as { id: number };
        const userPayload = req.user as AuthUserPayload;
        
        const updatedData: Student = {
            changedByUser: String(userPayload.user_id),
            clientIp: String(getClientIP(req)),
            sessionInfo: String(getSessionInfo(req))
        };
        
        try {
            if (!id) {
                res.send({ message: "student class not found!" });
                return;
            }
            const [result] = await model.delete(id, updatedData);
            const rawMessages = result?.messages;
            const parsedMessages = typeof rawMessages === "string" ? JSON.parse(rawMessages) : [];
            sendSuccessResponse(res, true, parsedMessages, null, 200);
        } catch (e: any) {
            handleError(res, e as Error, "Error deleting student class", 500);
        }
    },

    async search(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const { keyword = "", page = 1, limit = 10 } = req.query as SearchParams;
        try {
            const [ rows, [{total} = {total : 0} ]] = await model.search(keyword, page, limit);
            if (!rows?.length) {
                res.send({ message: "No student class found" });
                return;
            }
            sendSuccessResponse(res, true, "Search result student class", { rows: rows, total: total }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error searching student class", 500);
        }
    },

    async formLoad(req: FastifyRequest, res: FastifyReply): Promise<void> {
        try {
            const [classList] = await ClassModel.getAll();
            const [studentList] = await StudentModel.getAll();

            sendSuccessResponse(res, true, "Form load", { classList: classList, studentList: studentList }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error loading form", 500);
        }
    }

};