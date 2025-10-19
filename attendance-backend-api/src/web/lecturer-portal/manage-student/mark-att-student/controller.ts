import { FastifyReply, FastifyRequest } from "fastify";
import { handleError, sendSuccessResponse } from "../../../../utils/response";
import { MarkAttStudentModel } from "./model";
import { AuthUserPayload, RequestWithUser } from "../../../../middlewares/auth.middleware";
import { LecturerCourseModel } from "../../my-course/model";


const sessions: { value: string; label: string }[] = [];
for (let i = 1; i <= 60; i++) {
    sessions.push({ value: `s${i}`, label: `Session ${i}` });
}

export const MarkAttStudentController = {

    async getAll(req: RequestWithUser, res: FastifyReply): Promise<void> {
        const userPayload = req.user as AuthUserPayload;
        const {page, limit} = req.query as {page: number, limit: number};
        try {
            const [rows, [{ total } = { total: 0 }]] = await MarkAttStudentModel.getAll(userPayload.assign_to, page, limit);
            console.log(rows, "rows")
            if (!rows?.length) {
                res.send({ message: "No students found" });
                return;
            }

            sendSuccessResponse(res, true, "students list", { rows: rows, total:total }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching students", 500);
        }
    },
    async filter(req: RequestWithUser, res: FastifyReply): Promise<void> {
        const userPayload = req.user as AuthUserPayload;
        const data = req.body as any;
        
        try {
            const [rows, [{ total } = { total: 0 }]] = await MarkAttStudentModel.filter(userPayload.assign_to, data);
            console.log(rows, "rows")
            if (!rows?.length) {
                res.send({ message: "No students found" });
                return;
            }

            sendSuccessResponse(res, true, "students list", { rows: rows, total:total }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching students", 500);
        }
    },
    async getStudentSessionDetail(req: RequestWithUser, res: FastifyReply): Promise<void> {
        const userPayload = req.user as AuthUserPayload;
        const data = req.body as any;
        
        try {
            const [rows] = await MarkAttStudentModel.getStudentSessionDetail(userPayload.assign_to, data);
            console.log(rows, "rows")
            if (!rows?.length) {
                res.send({ message: "No student sessions found" });
                return;
            }

            sendSuccessResponse(res, true, "student sessions", { rows: rows[0] }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching student sessions", 500);
        }
    },

    async markSingleRecord(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const data = req.body as any;
        try {
            
            const [result] = await MarkAttStudentModel.markSingleRecord(data);
            console.log(result)
            const messages = JSON.parse(result?.messages);
            if (messages && messages.length > 0 && messages[0].code === 0) {
                sendSuccessResponse(res, true, messages, null, 200);
            }else{
                res.status(400).send({ message: messages[0].message || "Error mark attendance to student" });
            }
        } catch (e: any) {
            handleError(res, e as Error, "Error marking single record", 500);
        }
    },
    
    async markMultiRecord(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const data = req.body as any;
        try {
            
            const [result] = await MarkAttStudentModel.markMultiRecord(data);

            console.log(result)
            const messages = JSON.parse(result?.messages);
            if (messages && messages.length > 0 && messages[0].code === 0) {
                sendSuccessResponse(res, true, messages, null, 200);
            }else{
                res.send({ message: messages[0].message || "Error mark attendance to student" });
            }
        } catch (e: any) {
            handleError(res, e as Error, "Error marking multi records", 500);
        }
    },

    async formLoad(req: RequestWithUser, res: FastifyReply): Promise<void> {
        const userPayload = req.user as AuthUserPayload;
        
        try {
            const [courses] = await LecturerCourseModel.getAll(userPayload.assign_to);

            sendSuccessResponse(res, true, "Form load", { courses: courses, sessions: sessions }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error loading form", 500);
        }
    }

};