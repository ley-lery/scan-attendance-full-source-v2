import { FastifyInstance } from "fastify";
import { AuthController } from "./controller";
import { authenticateToken } from "../../../middlewares/auth.middleware";

export const authRoutes = async (fastify: FastifyInstance): Promise<void> =>{
    fastify.post('/user/signup', AuthController.signUp);
    fastify.post('/user/signin', AuthController.signIn);
    fastify.post('/user/signout', { preHandler: authenticateToken }, AuthController.signOut);
    fastify.get('/user/profile', { preHandler: authenticateToken }, AuthController.userProfile);
}