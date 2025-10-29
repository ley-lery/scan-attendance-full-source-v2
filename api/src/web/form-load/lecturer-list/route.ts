import { FastifyInstance } from "fastify";
import { lecturerListController } from "./controller";

const ctr = lecturerListController;

export const lecturerListRoutes = async (fastify: FastifyInstance)=>{
    fastify.get('/list', ctr.getAll);
}