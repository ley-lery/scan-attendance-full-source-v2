import { FastifyInstance } from "fastify";
import { attendanceSummaryController } from "./controller";

const controller = attendanceSummaryController;
export const attendanceSummaryRoutes = async (fastify: FastifyInstance)=>{
    fastify.get('/list', controller.getAll);
    fastify.post('/filter', controller.filter);
    fastify.get('/formload', controller.formLoad);
}