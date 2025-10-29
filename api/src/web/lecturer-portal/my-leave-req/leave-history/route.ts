import { FastifyInstance } from "fastify";
import { LectureLeaveHistoryController } from "./controller";

const controller = LectureLeaveHistoryController;

export const lLecturerLeaveHistoryRoutes = async (fastify: FastifyInstance)=>{
    fastify.get('/list', controller.getAll);
    fastify.get('/', controller.getById);
    fastify.get('/formload', controller.formLoad);
    fastify.post('/filter', controller.filter);
}