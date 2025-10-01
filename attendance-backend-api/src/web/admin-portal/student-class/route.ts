import { FastifyInstance } from "fastify";
import { StudentClassController } from "./controller";

export const studentClassRoutes = async (fastify: FastifyInstance)=>{
    fastify.get('/search', StudentClassController.search);
    fastify.get('/list', StudentClassController.getAll);
    fastify.get('/:id', StudentClassController.getById);
    fastify.post('/', StudentClassController.create);
    fastify.put('/:id', StudentClassController.update);
    fastify.delete('/:id', StudentClassController.delete);
    fastify.get('/formload', StudentClassController.formLoad);
}