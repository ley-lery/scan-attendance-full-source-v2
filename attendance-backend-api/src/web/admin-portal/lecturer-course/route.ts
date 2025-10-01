import { FastifyInstance } from "fastify";
import { LecturerCourseController } from "./controller";

export const lecturerCourseRoutes = async (fastify: FastifyInstance)=>{
    fastify.get('/search', LecturerCourseController.search);
    fastify.get('/list', LecturerCourseController.getAll);
    fastify.get('/:id', LecturerCourseController.getById);
    fastify.post('/', LecturerCourseController.create);
    fastify.put('/:id', LecturerCourseController.update);
    fastify.delete('/:id', LecturerCourseController.delete);
    fastify.get('/formload', LecturerCourseController.formLoad);
}