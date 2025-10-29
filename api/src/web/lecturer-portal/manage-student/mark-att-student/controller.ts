import { FastifyReply, FastifyRequest } from "fastify";
import { handleError, sendSuccessResponse } from "../../../../utils/response";
import { MarkAttStudentModel } from "./model";
import { AuthUserPayload, RequestWithUser } from "../../../../middlewares/auth.middleware";
import { LecturerCourseModel } from "../../my-course/model";

type DataFilter = {
    course: number
    session: number
    classStudentStatus: string | null
    transferred: number | null
    page: number
    limit: number
}

type DataUpdateStatus = {
    classStudents: number[]
    status: string
    changedByUser: number
    clientIp: string
    sessionInfo: string
}

const sessions: { value: string; label: string }[] = [];
for (let i = 1; i <= 60; i++) {
    sessions.push({ value: `s${i}`, label: `Session ${i}` });
}

const classStudentStatus: { value: string; label: string }[] = [];
classStudentStatus.push({ value: "Active", label: "Active" });
classStudentStatus.push({ value: "Inactive", label: "Inactive" });
classStudentStatus.push({ value: "Complete", label: "Complete" });

const transferred: { value: number; label: string }[] = [];
transferred.push({ value: 0, label: "All" });
transferred.push({ value: 1, label: "Not Transferred" });
transferred.push({ value: 2, label: "Transferred" });


export const MarkAttStudentController = {

    async getAll(req: RequestWithUser, res: FastifyReply): Promise<void> {
        const userPayload = req.user as AuthUserPayload;
        const {page, limit} = req.query as {page: number, limit: number};
        try {
            const [rows, [{ total } = { total: 0 }]] = await MarkAttStudentModel.getAll(userPayload.assign_to, page, limit);
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
        const data = req.body as DataFilter;
        
        try {
            const [rows, [{ total } = { total: 0 }]] = await MarkAttStudentModel.filter(userPayload.assign_to, data);
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

            const messages = JSON.parse(result?.messages);
            if (messages && messages.length > 0 && messages[0].code === 0) {
                sendSuccessResponse(res, true, messages, null, 200);
            }else{
                res.send({ message: messages[0].message || "Error mark attendance to student" });
            }
        } catch (e: any) {
            console.log(e)
            handleError(res, e as Error, "Error marking multi records", 500);
        }
    },
   

    async formLoad(req: RequestWithUser, res: FastifyReply): Promise<void> {
        const userPayload = req.user as AuthUserPayload;
        
        try {
            const [courses] = await LecturerCourseModel.getAll(userPayload.assign_to);

            sendSuccessResponse(res, true, "Form load", { courses: courses, sessions: sessions, classStudentStatus: classStudentStatus, transferred: transferred }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error loading form", 500);
        }
    }

};