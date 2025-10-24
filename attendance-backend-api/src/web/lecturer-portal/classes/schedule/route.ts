import { FastifyInstance } from "fastify";
import { LectuerScheduleController } from "./controller";

const ctr = LectuerScheduleController;

export const lecturerScheduleRoutes = async (fastify: FastifyInstance)=>{
    fastify.get('/list', ctr.getAll);
    fastify.post('/filter', ctr.filter);
    fastify.get('/formload', ctr.formLoad);
}