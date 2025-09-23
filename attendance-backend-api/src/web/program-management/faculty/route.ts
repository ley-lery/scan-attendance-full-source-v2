import {FastifyInstance} from "fastify";
import { FacultyController } from "./controller";

export const facultyRoutes = async (fastify: FastifyInstance)=>{
    fastify.get('/search', FacultyController.search);
    fastify.get('/list', FacultyController.getAll);
    fastify.get('/:id', FacultyController.getById);
    fastify.post('/', FacultyController.create);
    fastify.put('/:id', FacultyController.update);
    fastify.delete('/:id', FacultyController.delete);
}