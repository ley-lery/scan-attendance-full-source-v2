import { FastifyInstance } from "fastify";
import { ScheduleController } from "./controller";

const ctr = ScheduleController;

export const scheduleRoutes = async (fastify: FastifyInstance)=>{
    fastify.post('/', ctr.createSchedule);
    fastify.put('/:id', ctr.updateSchedule);
    fastify.get('/list', ctr.getAllClassSchedule);
    fastify.get('/formload', ctr.formLoad);

}