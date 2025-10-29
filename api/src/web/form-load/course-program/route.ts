import { FastifyInstance } from "fastify";
import { courseProgramController } from "./controller";

const ctr = courseProgramController;

export const courseProgramRoutes = async (fastify: FastifyInstance)=>{
    fastify.get('/list', ctr.getAll);
}