import { FastifyInstance } from "fastify";
import { StudentLeaveReqReportController } from "./controller";

const ctr = StudentLeaveReqReportController;

export const lStudentLeaveReqReportRoutes = async (fastify: FastifyInstance)=>{
    fastify.get('/list', ctr.getAll);
    fastify.post('/filter', ctr.filter);
    fastify.get('/formload', ctr.formLoad);
}