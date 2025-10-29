import { FastifyInstance } from "fastify";
import { fieldListController } from "./controller";

const ctr = fieldListController;

export const fieldListRoutes = async (fastify: FastifyInstance)=>{
    fastify.get('/list', ctr.getAll);
}