import { FastifyInstance } from "fastify";
import { StudentLeaveHistoryController } from "./controller";

export const sStudentLeaveHistoryRoutes = async (fastify: FastifyInstance)=>{
    fastify.get('/list', StudentLeaveHistoryController.getAll);
    fastify.get('/', StudentLeaveHistoryController.getById);
    fastify.get('/formload', StudentLeaveHistoryController.formLoad);
    fastify.post('/filter', StudentLeaveHistoryController.filter);
}