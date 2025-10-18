import { FastifyInstance } from "fastify";
import { facultyListController } from "./controller";

const ctr = facultyListController;

export const facultyListRoutes = async (fastify: FastifyInstance)=>{
    fastify.get('/list', ctr.getAll);
}