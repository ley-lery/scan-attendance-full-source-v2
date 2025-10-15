import { FastifyReply, FastifyRequest } from "fastify";
import { handleError, sendSuccessResponse } from "../../../../utils/response";
import { ApproveLeave, BatchLeave, StudentLeaveRequest } from "../../../../types/interface";
import { LecturerLeaveModel } from "./model";
import { AuthUserPayload, RequestWithUser } from "../../../../middlewares/auth.middleware";
import { FacultyModel } from "../../academic/faculty/model";
import { FieldModel } from "../../academic/field/model";
import { StudentModel } from "../../student/manage-student/model";
import { ClassModel } from "../../academic/classes/manage-class/model";
import { UserModel } from "../../manage-user/user/model";

const model = LecturerLeaveModel;

export const LecturerLeaveController = {

    async getAll(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const { page = 1, limit = 10 } = req.query as { page?: number; limit?: number };
        try {
            const [rows, [{ total } = { total: 0 }]] = await model.getAll(page, limit);

            if (!rows?.length) {
                res.status(404).send({ message: "No lecturer leave found" });
                return;
            }

            sendSuccessResponse(res, true, "lecturer leave list", { rows: rows, total:total }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching lecturer", 500);
        }
    },

    async getById(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const { id } = req.params as { id: number };
        try {
            const [rows] = await model.getById(id);

            if (!rows?.length) {
                res.status(404).send({ message: "lecturer leave not found" });
                return;
            }
            sendSuccessResponse(res, true, "lecturer leave details", { row: rows[0] }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching lecturer leave by ID", 500);
        }
    },

    async approveLeave(req: RequestWithUser, res: FastifyReply): Promise<void> {
        const { id } = req.params as { id: number };
        const data = req.body as { adminNote: string };
        const userPayload = req.user as AuthUserPayload;

        const approveData: ApproveLeave = {
            leaveId: id,
            approveByUser: userPayload.user_id,
            adminNote: data.adminNote
        };
        
        
        try {
            const [result] = await model.approveLeave(approveData);
            console.log(approveData, "approveData");
            const messages = JSON.parse(result?.messages);
            if (messages && messages.length > 0 && messages[0].code === 0) {
                sendSuccessResponse(res, true, messages, null, 200);
            }else{
                res.status(400).send({ message: messages[0].message || "Error approve lecturer leave" });
            }
        } catch (e: any) {
            handleError(res, e as Error, "Error approve lecturer leave", 500);
        }
    },

    async rejectLeave(req: RequestWithUser, res: FastifyReply): Promise<void> {
        const { id } = req.params as { id: number };
        const data = req.body as { adminNote: string };
        const userPayload = req.user as AuthUserPayload;
        
        const rejectData: ApproveLeave = {
            leaveId: id,
            approveByUser: userPayload.user_id,
            adminNote: data.adminNote
        };
        try {

            const [result] = await model.rejectLeave(rejectData);
            const messages = JSON.parse(result?.messages) ;
            if (messages && messages.length > 0 && messages[0].code === 0) {
                sendSuccessResponse(res, true, messages, null, 200);
            }else{  
                res.status(400).send({ message: messages[0].message || "Error reject lecturer leave" });
            }
            
        } catch (e: any) {
            handleError(res, e as Error, "Error reject lecturer leave", 500);
        }
    },

    async batchLeave(req: RequestWithUser, res: FastifyReply): Promise<void> {
        const data = req.body as BatchLeave;
        const userPayload = req.user as AuthUserPayload;
        
        const batchData: BatchLeave = {
            leaveIds: data.leaveIds,
            action: data.action,
            approveByUser: userPayload.user_id,
            adminNote: data.adminNote
        };
        try {
            const [result] = await model.batchLeave(batchData);
            const messages = JSON.parse(result?.messages) ;
            if (messages && messages.length > 0 && messages[0].code === 0) {
                sendSuccessResponse(res, true, messages, null, 200);
            }else{  
                res.status(400).send({ message: messages[0].message || "Error batch lecturer leave" });
            }
            
        } catch (e: any) {
            handleError(res, e as Error, "Error batch lecturer leave", 500);
        }
    },

    // async filter(req: FastifyRequest, res: FastifyReply): Promise<void> {
    //     const data = req.body as StudentLeaveRequest;
    //     try {
    //         const [results] = await model.filter(data);
    //         console.log(results, "results")
    
    //         // results[0] = rows, results[1] = total count
    //         const rows = results[0] || [];
    //         const [{ total } = { total: 0 }] = results[1] || [];
    
    //         if (!rows.length) {
    //             res.send({ message: "No lecturer leave found" });
    //             return;
    //         }
    
    //         sendSuccessResponse(res, true, "lecturer leave list", { rows, total }, 200);
    
    //     } catch (e: any) {
    //         handleError(res, e as Error, "Error filter lecturer leave", 500);
    //     }
    // },
    
    async formLoad(req: FastifyRequest, res: FastifyReply): Promise<void> {
        try {
            const [faculty] = await FacultyModel.getAll();
            const [field] = await FieldModel.getAll();
            const [student] = await StudentModel.getAll();
            const [classes] = await ClassModel.getAll();
            const [users] = await UserModel.getAll();
            const status = [
                { value: "Approved", label : "Approved" },
                { value: "Rejected", label : "Rejected" },
                { value: "Pending", label : "Pending" },
                { value: "Cancelled", label : "Cancelled" }
            ]

            sendSuccessResponse(res, true, "Form load", { faculties: faculty, fields: field, lecturer: student, classes: classes, users: users, status: status }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error loading form", 500);
        }
    }

};