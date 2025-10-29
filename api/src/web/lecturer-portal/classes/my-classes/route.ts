import { FastifyInstance } from "fastify";
import { LecturerMyClassesController } from "./controller";

const ctr = LecturerMyClassesController;

export const lecturerMyClassesRoutes = async (fastify: FastifyInstance)=>{
    fastify.get('/list', ctr.getAll);
    fastify.post('/filter', ctr.filter);
    fastify.get('/formload', ctr.formLoad);
}