import { FastifyInstance } from "fastify";
import { lecturerCourseListController } from "./controller";

const ctr = lecturerCourseListController;

export const lecturerCourseListRoutes = async (fastify: FastifyInstance)=>{
    fastify.get('/list', ctr.getAll);
}