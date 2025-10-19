import { FastifyInstance } from "fastify";
import { MarkAttStudentController } from "./controller";

export const markAttStudentRoutes = async (fastify: FastifyInstance)=>{
    fastify.get('/list', MarkAttStudentController.getAll);
    fastify.post('/marksignle', MarkAttStudentController.markSingleRecord);
    fastify.post('/markmulti', MarkAttStudentController.markMultiRecord);
    fastify.get('/formload', MarkAttStudentController.formLoad);
    fastify.post('/studentsession', MarkAttStudentController.getStudentSessionDetail);
    fastify.post('/filter', MarkAttStudentController.filter);
}