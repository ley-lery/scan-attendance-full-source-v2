import { FastifyInstance } from "fastify";
import { RoleController } from "./controller";

export const roleRoutes = async (fastify: FastifyInstance) => {
    fastify.get('/list', RoleController.getAll);
    fastify.get('/:id', RoleController.getById);
    fastify.post('/', RoleController.create);
    fastify.put('/:id', RoleController.update);
    fastify.delete('/:id', RoleController.delete);
    fastify.get('/search', RoleController.search); 
};
