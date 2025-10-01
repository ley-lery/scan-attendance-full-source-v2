import { FastifyInstance } from "fastify";
import { LecturerController } from "./controller";

export const lecturerRoutes = async (fastify: FastifyInstance)=>{
    fastify.get('/search', LecturerController.search);
    fastify.get('/list', LecturerController.getAll);
    fastify.get('/:id', LecturerController.getById);
    fastify.post('/', LecturerController.create);
    fastify.put('/:id', LecturerController.update);
    fastify.delete('/:id', LecturerController.delete);
}