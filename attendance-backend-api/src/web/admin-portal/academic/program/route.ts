import { FastifyInstance } from "fastify";
import { ProgramController } from "./controller";

const ctr = ProgramController;

export const programRoutes = async (fastify: FastifyInstance)=>{
    fastify.get('/search', ctr.search);
    fastify.get('/list', ctr.getAll);
    fastify.get('/:id', ctr.getById);
    fastify.post('/', ctr.create);
    fastify.put('/:id', ctr.update);
    fastify.delete('/:id', ctr.delete);
    fastify.get('/formLoad', ctr.formLoad);
}