import { FastifyInstance } from "fastify";
import { StudentController } from "./controller";

export const studentRoutes = async (fastify: FastifyInstance)=>{
    fastify.get('/search', StudentController.search);
    fastify.get('/list', StudentController.getAll);
    fastify.get('/:id', StudentController.getById);
    fastify.post('/', StudentController.create);
    fastify.put('/:id', StudentController.update);
    fastify.delete('/:id', StudentController.delete);
}