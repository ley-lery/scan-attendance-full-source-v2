import { FastifyInstance } from "fastify";
import { StudentLeaveController } from "./controller";

const ctr = StudentLeaveController;

export const studentLeaveReqRoutes = async (fastify: FastifyInstance)=>{
    fastify.get('/list', ctr.getAll);
    fastify.get('/:id', ctr.getById);
    fastify.put('/approve/:id', ctr.approveLeave);
    fastify.put('/reject/:id', ctr.rejectLeave);
    fastify.post('/filter', ctr.filter);
    fastify.get('/formload', ctr.formLoad);
    fastify.post('/batch', ctr.batchLeave);
}