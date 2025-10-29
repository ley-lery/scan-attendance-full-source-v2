import { FastifyInstance } from "fastify";
import { LecturerManageStudentLeaveController } from "./controller";

const controller = LecturerManageStudentLeaveController;

export const lecturerManageStudentLeaveRoutes = async (fastify: FastifyInstance)=>{
    fastify.get('/list', controller.getAll);
    fastify.get('/:id', controller.getById);
    fastify.put('/approve/:id', controller.approveLeave);
    fastify.put('/reject/:id', controller.rejectLeave);
    fastify.post('/filter', controller.filter);
    fastify.get('/formload', controller.formLoad);
    fastify.post('/batch', controller.batchLeave);
}