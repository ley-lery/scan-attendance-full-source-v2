import jwt, { JwtPayload } from "jsonwebtoken";
import { FastifyReply, FastifyRequest } from "fastify";
import { CONFIG } from "../config/env";
import { AuthModel } from "../web/auth/user/model";

interface AuthUserPayload extends JwtPayload {
    user_id: number;
    email: string;
    username: string;
    assign_type: string;
    assign_to: number;
}

interface RequestWithUser extends FastifyRequest {
    user?: AuthUserPayload;
}

const authenticateToken = async (req: RequestWithUser, res: FastifyReply): Promise<void> => {
    const authHeader = req.headers.authorization || '';
    if (!authHeader.startsWith('Bearer ')) {
        res.status(401).send({ success: false, message: "Access Denied: Invalid token format" });
        return;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        res.status(401).send({ success: false, message: 'Access Denied: No token provided' });
        return;
    }

    try {
        if (!CONFIG.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined");
        }

        // First verify JWT signature and expiration
        const decoded = jwt.verify(token, CONFIG.JWT_SECRET) as AuthUserPayload;
        
        // Then check if session exists and is valid in database
        const [result] = await AuthModel.checkSession(token);
        
        // Parse the messages from the output parameter
        const messages = JSON.parse(result.messages);
        
        if (messages[0].code !== 0) {
            res.status(401).send({ success: false, message: messages[0].message });
            return;
        }
        
        // Attach user to request
        req.user = decoded;
    } catch (error) {
        console.error("Token verification failed:", error);
        
        // Provide more specific error messages
        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).send({ success: false, message: 'Access Denied: Token expired' });
        } else if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).send({ success: false, message: 'Access Denied: Invalid token' });
        } else {
            res.status(401).send({ success: false, message: 'Access Denied: Authentication failed' });
        }
        return;
    }
};

const authorizeRoles = (roles: string[]) => {
    return async (req: RequestWithUser, res: FastifyReply, next: Function): Promise<void> => {
        if (!req.user) {
            res.status(401).send({ success: false, message: "Access Denied: Not authenticated" });
            return;
        }

        if (!roles.includes(req.user.assign_type)) {
            res.status(403).send({ success: false, message: "Forbidden: Insufficient permissions" });
            return;
        }
        next();
    };
};

export { authenticateToken, AuthUserPayload, RequestWithUser, authorizeRoles };