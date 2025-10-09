import { FastifyInstance } from "fastify";
import { ScheduleController } from "./controller";

export const scheduleRoutes = async (fastify: FastifyInstance)=>{
    fastify.post('/', ScheduleController.createSchedule);
    fastify.put('/:id', ScheduleController.updateSchedule);
    fastify.get('/list', ScheduleController.getAllClassSchedule);
    fastify.get('/formload', ScheduleController.formLoad);

}