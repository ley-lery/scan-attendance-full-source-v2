import { FastifyReply, FastifyRequest } from "fastify";
import { handleError, sendSuccessResponse } from "../../../../../index";
import { AttendanceSummaryModel } from "./model";
import { ClassModel } from "../../../academic/classes/manage-class/model";
import { StudentModel } from "../../../student/manage-student/model";
import { FacultyModel } from "../../../academic/faculty/model";
import { FieldModel } from "../../../academic/field/model";
import { CourseModel } from "../../../academic/course/model";

const model = AttendanceSummaryModel;
export const attendanceSummaryController = {

    async getAll(req: FastifyRequest, res: FastifyReply): Promise<void> {
        try {
            const [rows] = await model.getAll();

            if (!rows?.length) {
                res.send({ message: "No attendance summary found" });
                return;
            }

            sendSuccessResponse(res, true, "attendance summary list", { rows: rows }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching attendance summary", 500);
        }
    },
    async filter(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const data = req.body as any;
        try {
            const result = await model.filter(data);
            console.log(result[2][0], 'result');
            const rows = result[0];
            const state = result[1][0];
            const total = result[2][0];

            if (!rows?.length) {
                res.send({ message: "No attendance summary found" });
                return;
            }

            sendSuccessResponse(res, true, "attendance summary filtered", { rows: rows, total:total , state:state }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching attendance summary", 500);
        }
    },
    // async filter(req: FastifyRequest, res: FastifyReply): Promise<void> {
    //     const data = req.body as any;
    //     try {
    //         const [rows, [{ total } = { total: 0 }]] = await model.filter(data);

    //         if (!rows?.length) {
    //             res.send({ message: "No attendance summary found" });
    //             return;
    //         }

    //         sendSuccessResponse(res, true, "attendance summary filtered", { rows: rows, total:total }, 200);
    //     } catch (e) {
    //         handleError(res, e as Error, "Error fetching attendance summary", 500);
    //     }
    // },

    async formLoad(req: FastifyRequest, res: FastifyReply): Promise<void> {
        try {
            const [classes] = await ClassModel.getAll();
            const [courses] = await CourseModel.getAll();
            const [students] = await StudentModel.getAll();
            const [faculties] = await FacultyModel.getAll();
            const [fields] = await FieldModel.getAll();
            
            sendSuccessResponse(res, true, "Form Load", { classes: classes, courses: courses, students: students, faculties: faculties, fields: fields }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching form load", 500);
        }
    },

};