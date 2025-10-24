import { FastifyInstance } from "fastify";
import { MyClassAttendanceReportController } from "./controller";

const ctr = MyClassAttendanceReportController;

export const lMyClassAttendanceReportRoutes = async (fastify: FastifyInstance)=>{
    fastify.get('/list', ctr.getAll);
    fastify.post('/filter', ctr.filter);
    fastify.get('/formload', ctr.formLoad);
}