import { FastifyInstance } from "fastify";
import { ClassController } from "./controller";

export const classRoutes = async (fastify: FastifyInstance)=>{
    fastify.get('/search', ClassController.search);
    fastify.get('/list', ClassController.getAll);
    fastify.get('/:id', ClassController.getById);
    fastify.post('/', ClassController.create);
    fastify.put('/:id', ClassController.update);
    fastify.delete('/:id', ClassController.delete);
    fastify.get('/formload', ClassController.formLoad);
}