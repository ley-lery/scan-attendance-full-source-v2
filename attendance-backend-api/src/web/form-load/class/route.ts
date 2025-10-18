import { FastifyInstance } from "fastify";
import { classListController } from "./controller";

const ctr = classListController;

export const classListRoutes = async (fastify: FastifyInstance)=>{
    fastify.get('/list', ctr.getAll);
}