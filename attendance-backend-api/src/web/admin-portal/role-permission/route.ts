import { FastifyInstance } from "fastify";
import { RolePermissionController } from "./controller";

export const rolePermissionRoutes = async (fastify: FastifyInstance) => {
    fastify.post('/', RolePermissionController.toggle);
    fastify.get('/:id', RolePermissionController.getByRoleId);
    fastify.get('/search', RolePermissionController.search);
    fastify.get('/formload', RolePermissionController.formLoad);
    fastify.get('/current', RolePermissionController.getPermissionCurrentUser);
};
