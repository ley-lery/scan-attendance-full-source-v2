import { FastifyInstance } from "fastify";
import { LecturerLeaveController } from "./controller";

const ctr = LecturerLeaveController;

export const lecturerLeaveReqRoutes = async (fastify: FastifyInstance)=>{
    fastify.get('/list', ctr.getAll);
    fastify.get('/:id', ctr.getById);
    fastify.put('/approve/:id', ctr.approveLeave);
    fastify.put('/reject/:id', ctr.rejectLeave);
    fastify.get('/formload', ctr.formLoad);
    fastify.post('/batch', ctr.batchLeave);
    // fastify.post('/filter', ctr.filter);
}