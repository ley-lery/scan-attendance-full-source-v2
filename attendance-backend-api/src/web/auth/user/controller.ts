import {FastifyReply, FastifyRequest} from "fastify";
import { User } from "../../../types/interface";
import { AuthModel } from "./model";
import { handleError, sendSuccessResponse } from "../../../utils/response";
import { AuthUserPayload, RequestWithUser } from "../../../middlewares/auth.middleware";
import { CONFIG } from "../../../config/env";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const  AuthController = {
    async userSignUp(req:FastifyRequest, res: FastifyReply) {
        const data = req.body as User;
        try {
        
            const emailExists = await AuthModel.userAlreadyExist(data.email);
        
            if(emailExists[0][0].email_exists === 1) {
                sendSuccessResponse(res, false, "Email already exists", null, 409);
                return ;
            }
        
            const sigUp = await AuthModel.userSignUp(data);
            const result = sigUp[1];
            if(result.email_exists) {
                return sendSuccessResponse(res, false, "Email already exists", null, 409);
            }

            sendSuccessResponse(res, true, "User signed up successfully", {row: result}, 201);
        
        }catch (e) {
            handleError(res, e as Error, 'Error signing up user', 500);
        }
    },
    async userSignIn(req: FastifyRequest, res: FastifyReply) {
        const { email, password } = req.body as { email: string, password: string };
        try {
            const user = await AuthModel.userSignIn(email);
            const result = user[0][0]; 

            if (!result) {
                return sendSuccessResponse(res, false, "User not found", null, 404);
            }

            const passwordMatch = bcrypt.compareSync(password, result.password);
            if (!passwordMatch) {
                return sendSuccessResponse(res, false, "Invalid email or password", null, 401);
            }

            // Destructure and remove password
            const { password: _, ...userPayload } = result;

            // Create JWT token
            const token = jwt.sign(
                {
                    user_id: userPayload.user_id,
                    email: userPayload.email,
                    username: userPayload.username,
                    assign_type: userPayload.assign_type
                },
                CONFIG.JWT_SECRET,
                { expiresIn: '7d' }
            );

            // Return token + user data
            sendSuccessResponse(res, true, "User signed in successfully", { user: userPayload, token: token }, 200);
        } catch (e) {
            handleError(res, e as Error, 'Error signing in user', 500);
        }
    },
    async userProfile(req: RequestWithUser, res: FastifyReply) {
        try {
            const userPayload = req.user as AuthUserPayload;
            if (!userPayload || !userPayload.user_id) {
                return sendSuccessResponse(res, false, "Invalid user token", null, 401);
            }
            const userId = userPayload.user_id;
            const userProfile = await AuthModel.userProfile(userId);

            const user = userProfile[0] && userProfile[0][0];
            if (!user) {
                return sendSuccessResponse(res, false, "User not found", null, 404);
            }

            // Remove sensitive fields
            const { password, ...userData } = user;

            sendSuccessResponse(res, true, "User profile retrieved successfully", { user: {userData, branches: ['PP', 'SR']} }, 200);
        } catch (e) {
            handleError(res, e as Error, 'Error retrieving user profile', 500);
        }
    },
    async selectBranch(req: RequestWithUser, res: FastifyReply) {
        const { branchCode } = req.body as { branchCode: string };
        try {
            const userPayload = req.user as AuthUserPayload;
            if (!userPayload?.user_id) {
                return sendSuccessResponse(res, false, "Invalid user token", null, 401);
            }
            // Generate new token with selectedBranch included
            const newToken = jwt.sign(
                {
                    user_id: userPayload.user_id,
                    email: userPayload.email,
                    username: userPayload.username,
                    assign_type: userPayload.assign_type,
                    branch: branchCode
                },
                CONFIG.JWT_SECRET,
                { expiresIn: '7d' }
            );
            sendSuccessResponse(res, true, "Branch selected and token updated", { token: newToken }, 200);
        } catch (e) {
            handleError(res, e as Error, 'Error selecting branch', 500);
        }
    }

}
