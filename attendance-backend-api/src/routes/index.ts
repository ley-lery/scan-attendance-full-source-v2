import { FastifyInstance } from "fastify";
import { authRoutes } from "../web/auth/user/route";
import { lecturerRoutes } from "../web/lecturer-management/lecturer/route";
import { lectrerCourseRoutes } from "../web/lecturer-management/lecturer-course/route";
import { facultyRoutes } from "../web/program-management/faculty/route";
import { fieldRoutes } from "../web/program-management/field/route";
import { courseRoutes } from "../web/program-management/course/route";
import { programRoutes } from "../web/program-management/program/route";
import { authenticateToken } from "../middlewares/auth.middleware";
import { routeAppRoutes } from "../web/router/route";

export default async function (fastify: FastifyInstance) {

    // ====== Public routes do not require authentication =====
    fastify.addHook("onRequest", async (request, reply) => {
        const publicRoutes = ["/v1/api/attendance/auth/user/signin", "/v1/api/attendance/auth/user/signup"];
        const requestPath = request.url || "";
        if (publicRoutes.includes(requestPath)) {
            return;
        }
        await authenticateToken(request, reply);
    });

    // ====== Registering routes with prefixes and Reguired authendication =====
    fastify.register(facultyRoutes, { prefix: "v1/api/attendance/faculty" });
    fastify.register(fieldRoutes, { prefix: "v1/api/attendance/field" });
    fastify.register(authRoutes, { prefix: "v1/api/attendance/auth" });
    fastify.register(courseRoutes, { prefix: "v1/api/attendance/course" });
    fastify.register(programRoutes, { prefix: "v1/api/attendance/program" });
    fastify.register(lecturerRoutes, { prefix: "v1/api/attendance/lecturer" });
    fastify.register(lectrerCourseRoutes, { prefix: "v1/api/attendance/lecturercourse" });
    fastify.register(routeAppRoutes, { prefix: "v1/api/attendance/router" });

}
