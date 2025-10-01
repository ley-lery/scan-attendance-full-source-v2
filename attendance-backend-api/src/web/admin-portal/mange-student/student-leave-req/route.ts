import { FastifyInstance } from "fastify";
import { StudentLeaveController } from "./controller";

export const studentLeaveReqRoutes = async (fastify: FastifyInstance)=>{
    fastify.get('/list', StudentLeaveController.getAll);
    fastify.get('/:id', StudentLeaveController.getById);
    fastify.put('/approve/:id', StudentLeaveController.approveLeave);
    fastify.put('/reject/:id', StudentLeaveController.rejectLeave);
    fastify.post('/filter', StudentLeaveController.filter);
    fastify.get('/formload', StudentLeaveController.formLoad);
    fastify.post('/batch', StudentLeaveController.batchLeave);
}