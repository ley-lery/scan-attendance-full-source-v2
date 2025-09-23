import {FastifyInstance} from "fastify";
import { ProgramController } from "./controller";

export const programRoutes = async (fastify: FastifyInstance)=>{
    fastify.get('/search', ProgramController.search);
    fastify.get('/formload', ProgramController.formLoad);
    fastify.get('/list', ProgramController.getAll);
    fastify.get('/:id', ProgramController.getById);
    fastify.post('/', ProgramController.create);
    fastify.put('/:id', ProgramController.update);
    fastify.delete('/:id', ProgramController.delete);
}