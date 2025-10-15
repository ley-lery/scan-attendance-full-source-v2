import { FastifyInstance } from "fastify";
import { ClassController } from "./controller";

const ctr = ClassController;

export const classRoutes = async (fastify: FastifyInstance)=>{
    fastify.get('/search', ctr.search);
    fastify.get('/list', ctr.getAll);
    fastify.get('/:id', ctr.getById);
    fastify.post('/', ctr.create);
    fastify.put('/:id', ctr.update);
    fastify.delete('/:id', ctr.delete);
    fastify.get('/formload', ctr.formLoad);
}