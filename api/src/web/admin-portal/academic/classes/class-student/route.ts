import { FastifyInstance } from "fastify";
import { ClassStudentController } from "./controller";

const ctr = ClassStudentController;

export const studentClassRoutes = async (fastify: FastifyInstance)=>{
    fastify.get('/search', ctr.search);
    fastify.get('/list', ctr.getAll);
    fastify.get('/:id', ctr.getById);
    fastify.post('/', ctr.create);
    fastify.put('/:id', ctr.update);
    fastify.delete('/:id', ctr.delete);
    fastify.get('/formload', ctr.formLoad);
    fastify.get('/listload', ctr.listLoad);
    fastify.post('/updatestatus', ctr.updateStatus);
    fastify.post('/filter', ctr.filter);
}