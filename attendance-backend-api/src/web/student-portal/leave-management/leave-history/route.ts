import { FastifyInstance } from "fastify";
import { StudentLeaveRequestController } from "./controller";

export const studentLeaveHistoryRoutes = async (fastify: FastifyInstance)=>{
    fastify.post('/list', StudentLeaveRequestController.getAll);
    fastify.post('/byid', StudentLeaveRequestController.getById);
    fastify.post('/', StudentLeaveRequestController.createReq);
    fastify.post('/cancel', StudentLeaveRequestController.cancelReq);
}