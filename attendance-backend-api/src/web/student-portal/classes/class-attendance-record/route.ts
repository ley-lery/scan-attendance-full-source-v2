import { FastifyInstance } from "fastify";
import { classAttendanceRecordController } from "./controller";

export const classAttendanceRecordRoutes = async (fastify: FastifyInstance)=>{
    fastify.get('/list', classAttendanceRecordController.getAll);
    fastify.post('/detail', classAttendanceRecordController.getDetail);
}