import { FastifyInstance } from "fastify";
import { LecturerController } from "./controller";

const ctr = LecturerController;

export const lecturerRoutes = async (fastify: FastifyInstance)=>{
    fastify.get('/search', ctr.search);
    fastify.get('/list', ctr.getAll);
    fastify.get('/:id', ctr.getById);
    fastify.post('/', ctr.create);
    fastify.put('/:id', ctr.update);
    fastify.delete('/:id', ctr.delete);
}