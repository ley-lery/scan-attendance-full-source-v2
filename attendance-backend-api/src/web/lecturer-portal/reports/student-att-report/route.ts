import { FastifyInstance } from "fastify";
import { StudentAttendanceReportController } from "./controller";

const ctr = StudentAttendanceReportController;

export const studentAttendanceReportRoutes = async (fastify: FastifyInstance)=>{
    fastify.get('/list', ctr.getAll);
    fastify.post('/filter', ctr.filter);
    fastify.get('/formload', ctr.formLoad);
}