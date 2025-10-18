import { FastifyInstance } from "fastify";
import { courseListController } from "./controller";

const ctr = courseListController;

export const courseListRoutes = async (fastify: FastifyInstance)=>{
    fastify.get('/list', ctr.getAll);
}