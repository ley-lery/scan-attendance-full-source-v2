import { FastifyReply, FastifyRequest } from "fastify";
import { handleError, sendSuccessResponse } from "../../../../utils/response";
import { AdminMarkAttStudentModel } from "./model";
import { FacultyListModel, FieldListModel, ClassListModel, CourseListModel, StudentListModel } from "../../../form-load";
interface ParameterData {
    faculty: number | null,
    field: number | null,
    classId: number | null,
    course: number | null,
    student: number | null,
    promotionNo: number | null,
    termNo: number,
    programType: string | null,
    gender: string | null,
    studentStatus: string | null,
    searchKeyword: string | null,
    sessionNo: string | null,
    page: number,
    limit: number
}

const sessions: { value: string; label: string }[] = [];
for (let i = 1; i <= 60; i++) {
    sessions.push({ value: `s${i}`, label: `Session ${i}` });
}
const programTypes: { value: string; label: string }[] = [];
programTypes.push({ value: "Bachelor", label: "Bachelor" });
programTypes.push({ value: "Associate", label: "Associate" });

const promotionNos: { value: string; label: string }[] = [];
for (let i = 1; i <= 22; i++) {
    promotionNos.push({ value: `${i}`, label: `Promotion ${i}` });
}
const termNos: { value: string; label: string }[] = [];
for (let i = 1; i <= 8; i++) {
    termNos.push({ value: `${i}`, label: `Term ${i}` });
}
const studentStatus: { value: string; label: string }[] = [];
studentStatus.push({ value: "Active", label: "Active" });
studentStatus.push({ value: "Inactive", label: "Inactive" });

const genders: { value: string; label: string }[] = [];
genders.push({ value: "Male", label: "Male" });
genders.push({ value: "Female", label: "Female" });

const model = AdminMarkAttStudentModel;
    
export const MarkAttStudentController = {

    async getAll(req: FastifyRequest, res: FastifyReply): Promise<void> {
        try {
            const result = await model.getAll();
            const rows = result[0];

            const total = result[0][0].total;

            sendSuccessResponse(res, true, "students list", { rows: rows, total:total }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching students", 500);
        }
    },
    async getStudentSessionDetail(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const data = req.body as any;
        
        try {
            const [rows] = await model.getStudentSessionDetail(data);
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
    async filter(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const { faculty, field, classId, course, student, promotionNo, termNo, programType, gender, studentStatus, searchKeyword, sessionNo, page, limit } = req.body as ParameterData;
        const data = {
            faculty, field, classId, course, student, promotionNo, termNo, programType, gender, studentStatus, searchKeyword, sessionNo, page, limit
        }
        try {
            const result = await model.filter(data);
            console.log(result[1][0].total, 'result')

            const rows = result[0];
            const total = result[1][0].total;

            if (!rows?.length) {
                res.send({ message: "No student sessions found" });
                return;
            }

            sendSuccessResponse(res, true, "student sessions", { rows: rows, total:total }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching student sessions", 500);
        }
    },

    async markSingleRecord(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const data = req.body as any;
        try {
            
            const [result] = await model.markSingleRecord(data);
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
            
            const [result] = await model.markMultiRecord(data);

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
    async formLoad(req: FastifyRequest, res: FastifyReply): Promise<void> {
        try {
            const [faculyties] = await FacultyListModel.getAll();
            const [fields] = await FieldListModel.getAll();
            const [classes] = await ClassListModel.getAll();
            const [courses] = await CourseListModel.getAll();
            const [students] = await StudentListModel.getAll();

            sendSuccessResponse(res, true, "student sessions", { faculyties: faculyties, fields: fields, classes: classes, courses: courses, students: students, sessions: sessions, promotionNo: promotionNos, termNo: termNos, studentStatus: studentStatus, programType: programTypes, gender: genders }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching student sessions", 500);
        }
    },

};