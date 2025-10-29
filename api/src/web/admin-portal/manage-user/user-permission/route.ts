import { FastifyInstance } from "fastify";
import { UserPermissionController } from "./controller";

const ctr = UserPermissionController;

export const userPermissionRoutes = async (fastify: FastifyInstance) => {
    fastify.post('/', ctr.toggle);
    fastify.get('/:id', ctr.getByUserId);
    fastify.get('/search', ctr.search);
    fastify.get('/formload', ctr.formLoad);
    fastify.get('/current', ctr.getPermissionCurrentUser);
};
