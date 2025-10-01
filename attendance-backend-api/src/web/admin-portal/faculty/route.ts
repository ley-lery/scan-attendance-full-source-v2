import { FastifyInstance } from "fastify";
import { facultyController } from "./controller";

export const facultyRoutes = async (fastify: FastifyInstance)=>{
    fastify.get('/search', facultyController.search);
    fastify.get('/list', facultyController.getAll);
    fastify.get('/:id', facultyController.getById);
    fastify.post('/', facultyController.create);
    fastify.put('/:id', facultyController.update);
    fastify.delete('/:id', facultyController.delete);
}