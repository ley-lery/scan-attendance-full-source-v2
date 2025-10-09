import { FastifyInstance } from "fastify";
import { ScheduleController } from "./controller";

export const studentScheduleRoutes = async (fastify: FastifyInstance)=>{
    fastify.get('/list', ScheduleController.getStudentSchedule);
}