import { FastifyInstance } from "fastify";
import { UserRoleController } from "./controller";

export const userRoleRoutes = async (fastify: FastifyInstance) => {
    fastify.get('/list', UserRoleController.getAll);
    fastify.get('/:id', UserRoleController.getById);
    fastify.post('/', UserRoleController.create);
    fastify.put('/:id', UserRoleController.update);
    fastify.delete('/:id', UserRoleController.delete);
    fastify.get('/search', UserRoleController.search);
    fastify.get('/formload', UserRoleController.formLoad);
};
