import { FastifyInstance } from "fastify";
import { LecturerTeachingSummaryReportController } from "./controller";

const ctr = LecturerTeachingSummaryReportController;

export const lLecturerTeachingSummaryReportRoutes = async (fastify: FastifyInstance)=>{
    fastify.get('/list', ctr.getAll);
    fastify.post('/filter', ctr.filter);
    fastify.get('/formload', ctr.formLoad);
}