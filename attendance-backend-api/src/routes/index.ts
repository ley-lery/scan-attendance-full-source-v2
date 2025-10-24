import { FastifyInstance } from "fastify";
import { authRoutes } from "../web/auth/user/route";
import { authenticateToken } from "../middlewares/auth.middleware";
import { facultyRoutes, fieldRoutes, courseRoutes, programRoutes, lecturerRoutes, lecturerCourseRoutes, studentRoutes, studentClassRoutes, classRoutes, roleRoutes, rolePermissionRoutes, userRoleRoutes, permissionRoutes, userPermissionRoutes, auditLogRoutes, userRoutes, studentLeaveReqRoutes, scheduleRoutes, rptAttSummaryRoutes, aLecturerLeaveReqRoutes, adminMarkAttStudentRoutes } from "../web/admin-portal";
import { sStudentLeaveReqRoutes, sStudentLeaveHistoryRoutes, studentScheduleRoutes, classAttendanceRecordRoutes, sClassStudentRoutes } from "../web/student-portal";
import { markAttStudentRoutes, lLecturerCourseRoutes, lecturerManageStudentLeaveRoutes, lLecturerLeaveReqRoutes, lLecturerLeaveHistoryRoutes, lLecturerScheduleRoutes, lLecturerMyClassesRoutes, lStudentAttendanceReportRoutes, lMyClassAttendanceReportRoutes, lStudentLeaveReqReportRoutes, lLecturerTeachingSummaryReportRoutes } from "../web/lecturer-portal/indext";

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
    fastify.register(studentClassRoutes, { preix: "v1/api/attendance/studentclass" });
    fastify.register(roleRoutes, { prefix: "v1/api/attendance/role" });
    fastify.register(rolePermissionRoutes, { prefix: "v1/api/attendance/rolepermission" });
    fastify.register(userRoleRoutes, { prefix: "v1/api/attendance/userrole" });
    fastify.register(permissionRoutes, { prefix: "v1/api/attendance/permission" });
    fastify.register(userPermissionRoutes, { prefix: "v1/api/attendance/userpermission" });
    fastify.register(auditLogRoutes, { prefix: "v1/api/attendance/auditlog" });
    fastify.register(userRoutes, { prefix: "v1/api/attendance/user" });
    fastify.register(studentLeaveReqRoutes, { prefix: "v1/api/attendance/student/leavereq" });
    fastify.register(scheduleRoutes, { prefix: "v1/api/attendance/schedule" });
    fastify.register(aLecturerLeaveReqRoutes, { prefix: "v1/api/attendance/admin/lecturer/leavereq" });
    fastify.register(adminMarkAttStudentRoutes, { prefix: "v1/api/attendance/admin/markattstudent" });

    // reports routes
    fastify.register(rptAttSummaryRoutes, { prefix: "v1/api/attendance/reports/attendance-report/summary" });

    // ====== Lecturer Portal Routes =====
    fastify.register(markAttStudentRoutes, { prefix: "v1/api/attendance/lecturer/markattstudent" });
    fastify.register(lLecturerCourseRoutes, { prefix: "v1/api/attendance/lecturer/course" });
    fastify.register(lecturerManageStudentLeaveRoutes, { prefix: "v1/api/attendance/lecturer/student/leavereq" });
    fastify.register(lLecturerLeaveReqRoutes, { prefix: "v1/api/attendance/lecturer/leavereq" });
    fastify.register(lLecturerLeaveHistoryRoutes, { prefix: "v1/api/attendance/lecturer/leavehistory" });
    fastify.register(lLecturerScheduleRoutes, { prefix: "v1/api/attendance/lecturer/schedule" });
    fastify.register(lLecturerMyClassesRoutes, { prefix: "v1/api/attendance/lecturer/myclasses" });
    fastify.register(lStudentAttendanceReportRoutes, { prefix: "v1/api/attendance/lecturer/report/studentatt" });
    fastify.register(lMyClassAttendanceReportRoutes, { prefix: "v1/api/attendance/lecturer/report/myclassatt" });
    fastify.register(lStudentLeaveReqReportRoutes, { prefix: "v1/api/attendance/lecturer/report/studentleavereq" });
    fastify.register(lLecturerTeachingSummaryReportRoutes, { prefix: "v1/api/attendance/lecturer/report/teachingsummary" });

    // ====== Student Portal Routes =====   
    fastify.register(sStudentLeaveReqRoutes, { prefix: "v1/api/attendance/student/leave" });
    fastify.register(sStudentLeaveHistoryRoutes, { prefix: "v1/api/attendance/student/leavehistory" });
    fastify.register(studentScheduleRoutes, { prefix: "v1/api/attendance/student/schedule" });
    fastify.register(classAttendanceRecordRoutes, { prefix: "v1/api/attendance/student/classattendance" });
    fastify.register(sClassStudentRoutes, { prefix: "v1/api/attendance/student/classstudent" });
}
