import { FastifyInstance } from "fastify";
import { LectuerCourseController } from "./controller";

export const lecturerCourseRoutes = async (fastify: FastifyInstance)=>{
    fastify.get('/list', LectuerCourseController.getAll);
}