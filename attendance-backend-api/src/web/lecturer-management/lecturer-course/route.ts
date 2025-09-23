import {FastifyInstance} from "fastify";
import { ctr } from "./controller";

export const lectrerCourseRoutes = async (fastify: FastifyInstance)=>{
    fastify.get('/search', ctr.search);
    fastify.get('/formload', ctr.formLoad);
    fastify.get('/list', ctr.getAll);
    fastify.get('/:id', ctr.getById);
    fastify.post('/', ctr.create);
    fastify.put('/:id', ctr.update);
    fastify.delete('/:id', ctr.delete);
}