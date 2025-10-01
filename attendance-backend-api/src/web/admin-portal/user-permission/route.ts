import { FastifyInstance } from "fastify";
import { UserPermissionController } from "./controller";

export const userPermissionRoutes = async (fastify: FastifyInstance) => {
    fastify.post('/', UserPermissionController.toggle);
    fastify.get('/:id', UserPermissionController.getByUserId);
    fastify.get('/search', UserPermissionController.search);
    fastify.get('/formload', UserPermissionController.formLoad);
    fastify.get('/current', UserPermissionController.getPermissionCurrentUser);
};
