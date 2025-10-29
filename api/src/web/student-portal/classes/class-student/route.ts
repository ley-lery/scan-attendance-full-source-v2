import { FastifyInstance } from "fastify";
import { classStudentController } from "./controller";

const controller = classStudentController

export const sClassStudentRoutes = async (fastify: FastifyInstance)=>{
    fastify.get('/list', controller.getAll);
    fastify.get('/:id', controller.getById);
}