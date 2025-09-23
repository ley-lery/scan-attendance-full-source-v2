import { FastifyInstance } from "fastify";
import { AuthController } from "./controller";
import { authenticateToken } from "../../../middlewares/auth.middleware";

export const authRoutes = async (fastify: FastifyInstance): Promise<void> =>{
    fastify.post('/user/signup', AuthController.userSignUp);
    fastify.post('/user/signin', AuthController.userSignIn);
    fastify.get('/user/profile', { preHandler: authenticateToken }, AuthController.userProfile);
    fastify.post('/user/selectbranch', { preHandler: authenticateToken }, AuthController.selectBranch);
}