import { FastifyInstance } from "fastify";
import { userListController } from "./controller";

const ctr = userListController;

export const userListRoutes = async (fastify: FastifyInstance)=>{
    fastify.get('/list', ctr.getAll);
}