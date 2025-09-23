import { FastifyReply, FastifyRequest } from "fastify";
import { handleError, sendSuccessResponse, showValidation } from "../../../utils/response";
import { validateCourseData } from "../../../utils/validation";
import { Course, SearchParams } from "../../../types/interface";
import { CourseModel } from "./model";
import { FacultyModel } from "../faculty/model";


export const CourseController = {

    async search(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const { keyword = "", page = 1, limit = 10 } = req.query as SearchParams;
        try {
            const [rows, [{total}={total : 0}]] = await CourseModel.search(keyword, page, limit);
            if (!rows?.length) {
                res.send({ message: "No course found" });
                return;
            }
            sendSuccessResponse(res, true, "Search result fidld", { rows: rows, total: total }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error searching course", 500);
        }
    },

    async getAll(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const { page = 1, limit = 10 } = req.query as { page?: number; limit?: number };
        try {
            const [rows, [{ total } = { total: 0 }]] = await CourseModel.getAll(page, limit);

            // Check if rows are empty
            if (!rows?.length) {
                res.status(404).send({ message: "No courses found" });
                return;
            }

            // Send success response with rows and total count
            sendSuccessResponse(res, true, "Courses list", { rows: rows, total:total }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching courses", 500);
        }
    },

    async getById(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const { id } = req.params as { id: number };
        try {
            const [rows] = await CourseModel.getById(id);

            // Check if rows are empty
            if (!rows?.length) {
                res.status(404).send({ message: "course not found" });
                return;
            }
            // Send success response 
            sendSuccessResponse(res, true, "Course details", { row: rows[0] }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching course by ID", 500);
        }
    },

    async create(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const data = req.body as Course;
        try {
            // Validate the data before proceeding
            validateCourseData(data);
            
            const [result] = await CourseModel.create(data);
            
            const messages = JSON.parse(result?.messages);
            if (messages && messages.length > 0 && messages[0].code === 0) {
                sendSuccessResponse(res, true, messages, null, 200);
            }else{
                res.status(400).send({ message: messages[0].message || "Error updating course" });
            }
        } catch (e: any) {
            showValidation(res, e);
            handleError(res, e as Error, "Error creating course", 500);
        }
    },

    async update(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const { id } = req.params as { id: number };
        const data = req.body as Course;
        try {
            // Validate the data before proceeding
            validateCourseData(data);

            const [result] = await CourseModel.update(id, data);
            const messages = JSON.parse(result?.messages) ;
            if (messages && messages.length > 0 && messages[0].code === 0) {
                sendSuccessResponse(res, true, messages, null, 200);
            }else{
                res.status(400).send({ message: messages[0].message || "Error updating course" });
            }
            
        } catch (e: any) {
            showValidation(res, e);
            handleError(res, e as Error, "Error updating course", 500);
        }
    },

    async delete(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const { id } = req.params as { id: number };
        try {
            const [result] = await CourseModel.delete(id);
            const rawMessages = result?.messages;
            const parsedMessages = typeof rawMessages === "string" ? JSON.parse(rawMessages) : [];
            sendSuccessResponse(res, true, parsedMessages, null, 200);
        } catch (e: any) {
            handleError(res, e as Error, "Error deleting course", 500);
        }
    }
};