import { FastifyReply, FastifyRequest } from "fastify";
import { handleError, sendSuccessResponse, showValidation } from "../../../utils/response";
import { validateLecturerCourseData } from "../../../utils/validation";
import {  LecturerCourse, SearchParams } from "../../../types/interface";
import { LecturerCourseModel } from "./model";
import { LecturerModel } from "../lecturer/model";
import { CourseModel } from "../../program-management/course/model";


export const ctr = {

    async search(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const { keyword = "", page = 1, limit = 10 } = req.query as SearchParams;
        try {
            const [rows, [{total}={total : 0}]] = await LecturerCourseModel.search(keyword, page, limit);
            if (!rows?.length) {
                res.send({ message: "No lecturer course found" });
                return;
            }
            sendSuccessResponse(res, true, "Search result lecturer course", { rows: rows, total: total }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error searching Lecturer course", 500);
        }
    },

    async formLoad(req: FastifyRequest, res: FastifyReply): Promise<void> {
           try {
               const [lecturers, courses] = await Promise.all([
                   LecturerModel.getAll(),
                   CourseModel.getAll()
               ]);
   
               sendSuccessResponse(res, true, "Lecturer course form data", { lecturers: lecturers[0], courses: courses[0]  }, 200);
           } catch (e) {
               handleError(res, e as Error, "Error loading lecturer course form data", 500);
           }
       },

    async getAll(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const { page = 1, limit = 10 } = req.query as { page?: number; limit?: number };
        try {
            const [rows, [{ total } = { total: 0 }]] = await LecturerCourseModel.getAll(page, limit);

            // Check if rows are empty
            if (!rows?.length) {
                res.status(404).send({ message: "No Lecturer course found" });
                return;
            }
            // Send success response with rows and total count
            sendSuccessResponse(res, true, "Lecturers course list", { rows: rows, total:total }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching Lecturer", 500);
        }
    },

    async getById(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const { id } = req.params as { id: number };
        try {
            const [rows] = await LecturerCourseModel.getById(id);

            // Check if rows are empty
            if (!rows?.length) {
                res.status(404).send({ message: "Lecturer course not found" });
                return;
            }
            // Send success response 
            sendSuccessResponse(res, true, "Lecturer course details", { row: rows[0] }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching Lecturer by ID", 500);
        }
    },

    async create(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const data = req.body as LecturerCourse;
        try {
            // Validate the data before proceeding
            validateLecturerCourseData(data);
            
            const [result] = await LecturerCourseModel.create(data);
            
            const messages = JSON.parse(result?.messages);
            if (messages && messages.length > 0 && messages[0].code === 0) {
                sendSuccessResponse(res, true, messages, null, 200);
            }else{
                res.status(400).send({ message: messages[0].message || "Error updating lecturer course" });
            }
        } catch (e: any) {
            showValidation(res, e);
            handleError(res, e as Error, "Error creating lecturer course", 500);
        }
    },

    async update(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const { id } = req.params as { id: number };
        const data = req.body as LecturerCourse;
        try {
            // Validate the data before proceeding
            validateLecturerCourseData(data);

            const [result] = await LecturerCourseModel.update(id, data);
            const messages = JSON.parse(result?.messages) ;
            if (messages && messages.length > 0 && messages[0].code === 0) {
                sendSuccessResponse(res, true, messages, null, 200);
            }else{
                res.status(400).send({ message: messages[0].message || "Error updating lecturer course" });
            }
            
        } catch (e: any) {
            showValidation(res, e);
            handleError(res, e as Error, "Error updating lecturer course", 500);
        }
    },

    async delete(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const { id } = req.params as { id: number };
        try {
            // Validate the ID before proceeding
            if (!Number.isFinite(id)) {
                res.status(400).send({ message: "lecturer course not found!" });
                return;
            }
            const [result] = await LecturerCourseModel.delete(id);
            const rawMessages = result?.messages;
            const parsedMessages = typeof rawMessages === "string" ? JSON.parse(rawMessages) : [];
            sendSuccessResponse(res, true, parsedMessages, null, 200);
        } catch (e: any) {
            handleError(res, e as Error, "Error deleting lecturer course", 500);
        }
    }
};