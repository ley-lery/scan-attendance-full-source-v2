import { FastifyInstance } from "fastify";
import { AuditLogController } from "./controller";

export const auditLogRoutes = async (fastify: FastifyInstance) => {
    fastify.get('/list', AuditLogController.getAll);
    fastify.get('/:id', AuditLogController.getById);
    fastify.get('/search', AuditLogController.search);
    fastify.post('/filter', AuditLogController.filter);
    fastify.get('/formload', AuditLogController.formLoad);
};
