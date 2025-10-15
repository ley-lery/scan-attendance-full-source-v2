import { FastifyInstance } from "fastify";
import { RoleController } from "./controller";

const ctr = RoleController;

export const roleRoutes = async (fastify: FastifyInstance) => {
    fastify.get('/list', ctr.getAll);
    fastify.get('/:id', ctr.getById);
    fastify.post('/', ctr.create);
    fastify.put('/:id', ctr.update);
    fastify.delete('/:id', ctr.delete);
    fastify.get('/search', ctr.search); 
};
