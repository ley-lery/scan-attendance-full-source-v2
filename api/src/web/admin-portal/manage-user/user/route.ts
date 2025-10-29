import { FastifyInstance } from "fastify";
import { UserController } from "./controller";

const ctr = UserController;

export const userRoutes = async (fastify: FastifyInstance) => {
    fastify.get('/list', ctr.getAll);
    fastify.get('/:id', ctr.getById);
    fastify.get('/search', ctr.search);
};
