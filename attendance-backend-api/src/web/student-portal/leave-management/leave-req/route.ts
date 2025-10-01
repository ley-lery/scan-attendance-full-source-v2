import { FastifyInstance } from "fastify";
import { StudentLeaveRequestController } from "./controller";

export const sStudentLeaveReqRoutes = async (fastify: FastifyInstance)=>{
    fastify.get('/list', StudentLeaveRequestController.getAll);
    fastify.get('/', StudentLeaveRequestController.getById);
    fastify.post('/', StudentLeaveRequestController.createReq);
    fastify.put('/cancel', StudentLeaveRequestController.cancelReq);
    fastify.get('/state', StudentLeaveRequestController.state);
}