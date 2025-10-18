import { FastifyInstance } from "fastify";
import { studentListController } from "./controller";

const ctr = studentListController;

export const studentListRoutes = async (fastify: FastifyInstance)=>{
    fastify.get('/list', ctr.getAll);
}