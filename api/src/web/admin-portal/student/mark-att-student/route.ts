import { FastifyInstance } from "fastify";
import { MarkAttStudentController } from "./controller";

export const adminMarkAttStudentRoutes = async (fastify: FastifyInstance)=>{
    fastify.get('/list', MarkAttStudentController.getAll);
    fastify.post('/marksignle', MarkAttStudentController.markSingleRecord);
    fastify.post('/markmulti', MarkAttStudentController.markMultiRecord);
    fastify.get('/formload', MarkAttStudentController.formLoad);
    fastify.post('/filter', MarkAttStudentController.filter);
    fastify.post('/studentsession', MarkAttStudentController.getStudentSessionDetail);
    fastify.post('/filterfullsessions', MarkAttStudentController.filterFullSessions);
    fastify.get('/fullsessions', MarkAttStudentController.getFullSessions);
    fastify.post('/markbulk', MarkAttStudentController.markBulkRecord);
}