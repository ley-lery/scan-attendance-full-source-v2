import { FastifyInstance } from "fastify";
import { PermissionController } from "./controller";

const ctr = PermissionController;

export const permissionRoutes = async (fastify: FastifyInstance) => {
    fastify.get('/list', ctr.getAll);
    fastify.get('/:id', ctr.getById);
    fastify.post('/', ctr.create);
    fastify.post('/generate', ctr.generate);
    fastify.put('/:id', ctr.update);
    fastify.delete('/:id', ctr.delete);
    fastify.get('/search', ctr.search);
};
