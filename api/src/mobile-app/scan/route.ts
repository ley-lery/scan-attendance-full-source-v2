import { FastifyInstance } from "fastify";
import { scanController } from "./controller";

const ctr = scanController;

export const scanRoutes = async (fastify: FastifyInstance)=>{
    fastify.get('/:classId', ctr.getClass);
    fastify.post('/process', ctr.getSessionAndProcess);
}