import {FastifyInstance} from "fastify";
import { CourseController } from "./controller";

export const courseRoutes = async (fastify: FastifyInstance)=>{
    fastify.get('/search', CourseController.search);
    fastify.get('/list', CourseController.getAll);
    fastify.get('/:id', CourseController.getById);
    fastify.post('/', CourseController.create);
    fastify.put('/:id', CourseController.update);
    fastify.delete('/:id', CourseController.delete);
}