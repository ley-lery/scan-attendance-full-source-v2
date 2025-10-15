import { FastifyReply } from "fastify";
import { StudentLeaveHistoryModel } from "./model";
import { sendSuccessResponse } from "../../../../utils/response";
import { handleError } from "../../../../utils/response";
import { AuthUserPayload, RequestWithUser } from "../../../../middlewares/auth.middleware";
import { FacultyModel } from "../../../admin-portal/academic/faculty/model";
import { FieldModel } from "../../../admin-portal/academic/field/model";
import { ClassModel } from "../../../admin-portal/academic/classes/manage-class/model";
import { LecturerModel } from "../../../admin-portal/lecturer/manage-lecturer/model";
import { StudentLeaveRequestModel } from "../leave-req/model";
import { StudentLeaveFilter } from "../../../../types/interface";
import { ClassStudentModel } from "../../classes/class-student/model";

export const StudentLeaveHistoryController = {

    async getAll(req: RequestWithUser, res: FastifyReply): Promise<void> {
        const { assign_to } = req.user as AuthUserPayload;
        const { page = 1, limit = 10 } = req.query as { page?: number; limit?: number };
        try {

            const rows = await StudentLeaveHistoryModel.getAll(assign_to, page, limit);

            if (!rows?.length) {
                res.status(404).send({ message: "No leave history found" });
                return;
            }

            // Stored procedure returns total as separate select, handle it
            const total = rows[1][0]?.total || 0;

            sendSuccessResponse(res, true, "Leave history list", { rows: rows[0], total }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching student leave history", 500);
        }
    },

    async getById(req: RequestWithUser, res: FastifyReply): Promise<void> {
        const { assign_to } = req.user as AuthUserPayload;
        const { id } = req.params as { id: number };
        try {
            const rows = await StudentLeaveHistoryModel.getById(id, assign_to);

            if (!rows?.length) {
                res.status(404).send({ message: "Leave history not found" });
                return;
            }

            sendSuccessResponse(res, true, "Leave history details", { row: rows[0] }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching leave history by ID", 500);
        }
    },

    async formLoad(req: RequestWithUser, res: FastifyReply): Promise<void> {
        const { assign_to } = req.user as AuthUserPayload;
        try {
            const [[states]] = await StudentLeaveRequestModel.state(assign_to);
            const [faculty] = await FacultyModel.getAll();
            const [field] = await FieldModel.getAll();
            const [lecturer] = await LecturerModel.getAll();
            const [classes] = await ClassStudentModel.getAll(assign_to);
            const status = [
                { id: 'Pending', label: 'Pending' },
                { id: 'Approved', label: 'Approved' },
                { id: 'Rejected', label: 'Rejected' },
                { id: 'Cancelled', label: 'Cancelled' },
            ]

            sendSuccessResponse(res, true, "Student Leave History form load.", { states: states, faculties: faculty, fields: field, lecturers: lecturer, classes: classes, status: status }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching student leave history form load", 500);
        }
    },

    async filter(req: RequestWithUser, res: FastifyReply): Promise<void> {
        const { assign_to } = req.user as AuthUserPayload;
        const { classId, status, date, startDate, endDate, page, limit } = req.body as StudentLeaveFilter;

        const updateData = {
            classId,
            student: assign_to,
            status,
            date,
            startDate,
            endDate,
            page,
            limit,
        };
        console.log(updateData, "student filtered");

        try {
            const rows = await StudentLeaveHistoryModel.filter(updateData);

            if (!rows?.length) {
                res.status(404).send({ message: "No leave history found" });
                return;
            }

            // Stored procedure returns total as separate select, handle it
            const total = rows[1][0]?.total || 0;

            sendSuccessResponse(res, true, "Leave history list", { rows: rows[0], total }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching student leave history", 500);
        }
    },
};
