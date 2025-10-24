import { FastifyInstance } from "fastify";
import { classAttendanceRecordController } from "./controller";

const ctr = classAttendanceRecordController;

export const classAttendanceRecordRoutes = async (fastify: FastifyInstance)=>{
    fastify.get('/list', ctr.getAll);
    fastify.post('/detail', ctr.getDetail);
    fastify.post('/filter', ctr.filter);
    fastify.get('/formload', ctr.formLoad);
}