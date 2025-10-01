import { FastifyInstance } from "fastify";
import { UserController } from "./controller";

export const userRoutes = async (fastify: FastifyInstance) => {
    fastify.get('/list', UserController.getAll);
    fastify.get('/:id', UserController.getById);
    fastify.get('/search', UserController.search);
};
