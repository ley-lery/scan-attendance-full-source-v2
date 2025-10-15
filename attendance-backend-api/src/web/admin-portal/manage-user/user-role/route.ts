import { FastifyInstance } from "fastify";
import { UserRoleController } from "./controller";

const ctr = UserRoleController;

export const userRoleRoutes = async (fastify: FastifyInstance) => {
    fastify.get('/list', ctr.getAll);
    fastify.get('/:id', ctr.getById);
    fastify.post('/', ctr.create);
    fastify.put('/:id', ctr.update);
    fastify.delete('/:id', ctr.delete);
    fastify.get('/search', ctr.search);
    fastify.get('/formload', ctr.formLoad);
};
