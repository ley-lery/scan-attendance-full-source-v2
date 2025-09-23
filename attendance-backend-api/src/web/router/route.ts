import { FastifyInstance } from "fastify";
import { authenticateToken } from "../../middlewares/auth.middleware";
import RouterAppApi from "./link";

export const routeAppRoutes = async (fastify: FastifyInstance): Promise<void> => {
  fastify.get("/routes", { preHandler: [authenticateToken] }, RouterAppApi.get);
};
