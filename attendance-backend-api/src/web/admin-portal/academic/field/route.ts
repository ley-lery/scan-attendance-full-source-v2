import { FastifyInstance } from "fastify";
import { FieldController } from "./controller";

const ctr = FieldController;

export const fieldRoutes = async (fastify: FastifyInstance)=>{
    fastify.get('/search', ctr.search);
    fastify.get('/list', ctr.getAll);
    fastify.get('/:id', ctr.getById);
    fastify.post('/', ctr.create);
    fastify.put('/:id', ctr.update);
    fastify.delete('/:id', ctr.delete);
}