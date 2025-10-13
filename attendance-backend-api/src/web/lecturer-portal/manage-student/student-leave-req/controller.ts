import { FastifyReply, FastifyRequest } from "fastify";
import { handleError, sendSuccessResponse } from "../../../../utils/response";
import { LectureBatchLeave, LecturerMangeStudentLeave, LectureStudentLeveFilter, StudentLeaveRequest } from "../../../../types/interface";
import { LecturerManageStudentLeaveModel } from "./model";
import { AuthUserPayload, RequestWithUser } from "../../../../middlewares/auth.middleware";
import { LecturerCourseModel } from "../../my-course/model";

const model = LecturerManageStudentLeaveModel;

export const LecturerManageStudentLeaveController = {

    async getAll(req: RequestWithUser, res: FastifyReply): Promise<void> {
        const { page = 1, limit = 10 } = req.query as { page?: number; limit?: number };
        const { assign_to: lecturer } = req.user as AuthUserPayload;
        const { course } = req.body as {course: number};
        try {
            const [rows, [{ total } = { total: 0 }]] = await model.getAll(lecturer, { course }, page, limit);

            if (!rows?.length) {
                res.send({ message: "No students leave found" });
                return;
            }

            sendSuccessResponse(res, true, "students leave list", { rows: rows, total:total }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching students", 500);
        }
    },

    async getById(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const { id } = req.params as { id: number };
        try {
            const [rows] = await model.getById(id);

            if (!rows?.length) {
                res.status(404).send({ message: "student leave not found" });
                return;
            }
            sendSuccessResponse(res, true, "Student leave details", { row: rows[0] }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching student leave by ID", 500);
        }
    },

    async approveLeave(req: RequestWithUser, res: FastifyReply): Promise<void> {
        const { id } = req.params as { id: number };
        const data = req.body as { adminNote: string };
        const { assign_to: lecturer } = req.user as AuthUserPayload;

        const approveData: LecturerMangeStudentLeave = {
            leaveId: id,
            approveByLecturer: lecturer,
            adminNote: data.adminNote
        };
        
        
        try {
            const [result] = await model.approveLeave(approveData);
            console.log(approveData, "approveData");
            const messages = JSON.parse(result?.messages);
            if (messages && messages.length > 0 && messages[0].code === 0) {
                sendSuccessResponse(res, true, messages, null, 200);
            }else{
                res.status(400).send({ message: messages[0].message || "Error approve student leave" });
            }
        } catch (e: any) {
            handleError(res, e as Error, "Error approve student leave", 500);
        }
    },

    async rejectLeave(req: RequestWithUser, res: FastifyReply): Promise<void> {
        const { id } = req.params as { id: number };
        const data = req.body as { adminNote: string };
        const { assign_to: lecturer } = req.user as AuthUserPayload;
        
        const rejectData: LecturerMangeStudentLeave = {
            leaveId: id,
            approveByLecturer: lecturer,
            adminNote: data.adminNote
        };
        try {

            const [result] = await model.rejectLeave(rejectData);
            const messages = JSON.parse(result?.messages) ;
            if (messages && messages.length > 0 && messages[0].code === 0) {
                sendSuccessResponse(res, true, messages, null, 200);
            }else{  
                res.status(400).send({ message: messages[0].message || "Error reject student leave" });
            }
            
        } catch (e: any) {
            handleError(res, e as Error, "Error reject student leave", 500);
        }
    },

    async batchLeave(req: RequestWithUser, res: FastifyReply): Promise<void> {
        const data = req.body as LectureBatchLeave;
        const { assign_to: lecturer } = req.user as AuthUserPayload;
        
        const batchData: LectureBatchLeave = {
            leaveIds: data.leaveIds,
            action: data.action,
            approveByLecturer: lecturer,
            adminNote: data.adminNote
        };
        try {
            const [result] = await model.batchLeave(batchData);
            const messages = JSON.parse(result?.messages) ;
            if (messages && messages.length > 0 && messages[0].code === 0) {
                sendSuccessResponse(res, true, messages, null, 200);
            }else{  
                res.status(400).send({ message: messages[0].message || "Error batch student leave" });
            }
            
        } catch (e: any) {
            handleError(res, e as Error, "Error batch student leave", 500);
        }
    },

    async filter(req: RequestWithUser, res: FastifyReply): Promise<void> {
        const data = req.body as LectureStudentLeveFilter;
        const { assign_to: lecturer } = req.user as AuthUserPayload;

        try {
            const [results] = await model.filter(lecturer, data);
    
            const rows = results[0] || [];
            const [{ total } = { total: 0 }] = results[1] || [];
    
            if (!rows.length) {
                res.send({ message: "No students leave found" });
                return;
            }
    
            sendSuccessResponse(res, true, "students leave list", { rows, total }, 200);
    
        } catch (e: any) {
            handleError(res, e as Error, "Error filter student leave", 500);
        }
    },
    
    async formLoad(req: RequestWithUser, res: FastifyReply): Promise<void> {
        const { assign_to: lecturer } = req.user as AuthUserPayload;
        try {
            const [courses] = await LecturerCourseModel.getAll(lecturer);
            const status = [
                { value: "Approved", label : "Approved" },
                { value: "Rejected", label : "Rejected" },
                { value: "Pending", label : "Pending" },
                { value: "Cancelled", label : "Cancelled" }
            ]

            sendSuccessResponse(res, true, "Form load", { status: status, courses: courses }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error loading form", 500);
        }
    }

};