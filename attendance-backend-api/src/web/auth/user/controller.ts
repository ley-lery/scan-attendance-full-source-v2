import {FastifyReply, FastifyRequest} from "fastify";
import { User, UserSignUp } from "../../../types/interface";
import { AuthModel } from "./model";
import { handleError, sendSuccessResponse } from "../../../utils/response";
import { AuthUserPayload, RequestWithUser } from "../../../middlewares/auth.middleware";
import { CONFIG } from "../../../config/env";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { UserPermissionModel } from "../../admin-portal/user-permission/model";

export const  AuthController = {
    async userSignUp(req:FastifyRequest, res: FastifyReply) {
        const data = req.body as User;
        try {
        
            // const emailExists = await AuthModel.userAlreadyExist(data.email);
        
            // if(emailExists[0][0].email_exists === 1) {
            //     sendSuccessResponse(res, false, "Email already exists", null, 409);
            //     return ;
            // }
        
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
                    assign_type: userPayload.assign_type,
                    assign_to: userPayload.assign_to
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

            const userPermission = await UserPermissionModel.getByUserId(userId);

            const user = userProfile[0] && userProfile[0][0];
            if (!user) {
                return sendSuccessResponse(res, false, "User not found", null, 404);
            }

            const { password, ...userData } = user;

            sendSuccessResponse(res, true, "User profile retrieved successfully", { user: {userData, permissions: userPermission} }, 200);
        } catch (e) {
            handleError(res, e as Error, 'Error retrieving user profile', 500);
        }
    },

    async signUp(req: FastifyRequest, res: FastifyReply) {
        const data = req.body as UserSignUp;
        try {
            const [result] = await AuthModel.signUp(data);
            console.log(result, "result");
            const messages = JSON.parse(result?.messages) ;
            if (messages && messages.length > 0 && messages[0].code === 0) {
                sendSuccessResponse(res, true, messages, null, 200);
            }else{   
                res.status(400).send({ message: messages[0].message || "Error updating class" });
            }
        } catch (e) {
            handleError(res, e as Error, 'Error signing up user', 500);
        }
    },

}
