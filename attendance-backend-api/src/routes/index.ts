import { FastifyInstance } from "fastify";
import { authRoutes } from "../web/auth/user/route";
import { authenticateToken } from "../middlewares/auth.middleware";
import { facultyRoutes, fieldRoutes, courseRoutes, programRoutes, lecturerRoutes, lecturerCourseRoutes, studentRoutes, studentClassRoutes, classRoutes, roleRoutes, rolePermissionRoutes, userRoleRoutes, permissionRoutes, userPermissionRoutes, auditLogRoutes, userRoutes, studentLeaveReqRoutes, scheduleRoutes} from "../web/admin-portal";
import { sStudentLeaveReqRoutes, sStudentLeaveHistoryRoutes, studentScheduleRoutes } from "../web/student-portal";
import { markAttStudentRoutes, lLecturerCourseRoutes } from "../web/lecturer-portal/indext";

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

    // ====== Admin Portal Routes =====
    fastify.register(authRoutes, { prefix: "v1/api/attendance/auth" });
    fastify.register(facultyRoutes, { prefix: "v1/api/attendance/faculty" });
    fastify.register(fieldRoutes, { prefix: "v1/api/attendance/field" });
    fastify.register(courseRoutes, { prefix: "v1/api/attendance/course" });
    fastify.register(programRoutes, { prefix: "v1/api/attendance/program" });
    fastify.register(lecturerRoutes, { prefix: "v1/api/attendance/lecturer" });
    fastify.register(lecturerCourseRoutes, { prefix: "v1/api/attendance/lecturercourse" });
    fastify.register(studentRoutes, { prefix: "v1/api/attendance/student" });
    fastify.register(classRoutes, { prefix: "v1/api/attendance/class" });
    fastify.register(studentClassRoutes, { prefix: "v1/api/attendance/studentclass" });
    fastify.register(roleRoutes, { prefix: "v1/api/attendance/role" });
    fastify.register(rolePermissionRoutes, { prefix: "v1/api/attendance/rolepermission" });
    fastify.register(userRoleRoutes, { prefix: "v1/api/attendance/userrole" });
    fastify.register(permissionRoutes, { prefix: "v1/api/attendance/permission" });
    fastify.register(userPermissionRoutes, { prefix: "v1/api/attendance/userpermission" });
    fastify.register(auditLogRoutes, { prefix: "v1/api/attendance/auditlog" });
    fastify.register(userRoutes, { prefix: "v1/api/attendance/user" });
    fastify.register(studentLeaveReqRoutes, { prefix: "v1/api/attendance/student/leavereq" });
    fastify.register(scheduleRoutes, { prefix: "v1/api/attendance/schedule" });

    // ====== Lecturer Portal Routes =====
    fastify.register(markAttStudentRoutes, { prefix: "v1/api/attendance/lecturer/markattstudent" });
    fastify.register(lLecturerCourseRoutes, { prefix: "v1/api/attendance/lecturer/course" });

    // ====== Student Portal Routes =====   
    fastify.register(sStudentLeaveReqRoutes, { prefix: "v1/api/attendance/student/leave" });
    fastify.register(sStudentLeaveHistoryRoutes, { prefix: "v1/api/attendance/student/leavehistory" });
    fastify.register(studentScheduleRoutes, { prefix: "v1/api/attendance/student/schedule" });
}
