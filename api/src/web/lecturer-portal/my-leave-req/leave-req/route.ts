import { FastifyInstance } from "fastify";
import { LecturerLeaveRequestController } from "./controller";
const controller = LecturerLeaveRequestController;
export const lLecturerLeaveReqRoutes = async (fastify: FastifyInstance)=>{
    fastify.get('/list', controller.getAll);
    fastify.get('/:id', controller.getById);
    fastify.post('/', controller.createReq);
    fastify.post('/cancel', controller.cancelReq);
    fastify.get('/state', controller.state);
}