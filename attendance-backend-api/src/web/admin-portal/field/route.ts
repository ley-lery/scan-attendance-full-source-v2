import { FastifyInstance } from "fastify";
import { FieldController } from "./controller";

export const fieldRoutes = async (fastify: FastifyInstance)=>{
    fastify.get('/search', FieldController.search);
    fastify.get('/list', FieldController.getAll);
    fastify.get('/:id', FieldController.getById);
    fastify.post('/', FieldController.create);
    fastify.put('/:id', FieldController.update);
    fastify.delete('/:id', FieldController.delete);
}