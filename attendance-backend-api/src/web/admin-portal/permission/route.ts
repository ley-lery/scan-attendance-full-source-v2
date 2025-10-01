import { FastifyInstance } from "fastify";
import { PermissionController } from "./controller";

export const permissionRoutes = async (fastify: FastifyInstance) => {
    fastify.get('/list', PermissionController.getAll);
    fastify.get('/:id', PermissionController.getById);
    fastify.post('/', PermissionController.create);
    fastify.post('/generate', PermissionController.generate);
    fastify.put('/:id', PermissionController.update);
    fastify.delete('/:id', PermissionController.delete);
    fastify.get('/search', PermissionController.search);
};
