import { FastifyInstance } from "fastify";
import { RolePermissionController } from "./controller";

const ctr = RolePermissionController;

export const rolePermissionRoutes = async (fastify: FastifyInstance) => {
    fastify.post('/', ctr.toggle);
    fastify.get('/:id', ctr.getByRoleId);
    fastify.get('/search', ctr.search);
    fastify.get('/formload', ctr.formLoad);
    fastify.get('/current', ctr.getPermissionCurrentUser);
};
