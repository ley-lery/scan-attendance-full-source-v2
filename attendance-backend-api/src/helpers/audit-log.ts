import { FastifyRequest } from "fastify";
import { AuthUserPayload, RequestWithUser } from "../middlewares/auth.middleware";

// Helper function to get client IP
function getClientIP(req: FastifyRequest) {
    return req.headers['x-forwarded-for'] ||
           req.headers['x-real-ip'] ||
           req.socket.remoteAddress ||
           req.ip ||
           'unknown';
}

// Helper function to generate session info
function getSessionInfo(req: RequestWithUser) {
    const userPayload = req.user as AuthUserPayload;
    const userId = userPayload.user_id;
    return `fastify_${userId || 'anonymous'}_${Date.now()}`;
}

export { getClientIP, getSessionInfo };