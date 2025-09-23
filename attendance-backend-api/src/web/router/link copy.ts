import { FastifyReply } from "fastify";
import { RequestWithUser } from "../../middlewares/auth.middleware";

const allRoutes = [
  {
    name: "Admin Portal",
    path: "/admin",
    role: "admin",
    children: [
      { name: "Dashboard", path: "dashboard", component: "AdminDashboard" },
      { name: "Class Schedule", path: "class-schedule", component: "ClassSchedule" },
      { name: "Student Attendance", path: "student-attendance", component: "StudentAttendance" },
      {
        name: "Leave Requests",
        path: "leave-req",
        children: [
          { name: "Lecturer Leave Requests", path: "lecturer-leave-req", component: "LecturerLeaveReq" },
          { name: "Student Leave Requests", path: "student-leave-req", component: "StudentLeaveReq" },
        ],
      },
      { name: "Substitute Teaching", path: "substitute-teaching", component: "SubstituteTeaching" },
      { name: "Extra Time Requests", path: "extra-time-req", component: "ExtraTimeReq" },
      { name: "Report", path: "report", component: "Report" },
      { name: "User Management", path: "user-management", component: "UserManage" },
    ],
  },
  {
    name: "Lecturer Portal",
    path: "/lecturer",
    role: "lecturer",
    children: [
      { name: "Dashboard", path: "dashboard", component: "LecturerDashboard" },
      { name: "Schedule", path: "schedule", component: "LecturerClassSchedule" },
      { name: "Teaching Hours", path: "teaching-hours-summary", component: "TeachingHours" },
      { name: "Attendance Sheet", path: "attendance-sheet", component: "AttendanceSheet" },
      { name: "Leave Request", path: "leave-req", component: "LecturerLeave" },
      { name: "Review Student Leave", path: "review-student-leave-req", component: "ReviewStuLeaveReq" },
    ],
  },
  {
    name: "Student Portal",
    path: "/student",
    role: "student",
    children: [
      { name: "Dashboard", path: "dashboard", component: "StudentDashboard" },
      { name: "Schedule", path: "schedule", component: "StudentClassSchedule" },
      { name: "Attendance by Subject", path: "view-attendance-by-subject", component: "ViewAttBySubject" },
      { name: "Leave Request", path: "leave-req", component: "StudentLeave" },
      { name: "Leave Status", path: "view-leave-status", children: [
        { name: "View Leave Status", path: "view-leave-success", component: "ViewLeaveSuccess" },
        { name: "View Leave Rejected", path: "view-leave-rejected", component: "ViewLeaveRejected" },
        { name: "View Leave Pending", path: "view-leave-pending", component: "ViewLeavePending" },
      ] 
    },
    ],
  },
];

const routes = {
  protectedRouteAdmin : [
    {
      name: "Dashboard",
      path: "system/dashboard",
      component: "AdminDashboard",
    },
    {
      name: "Class Schedule",
      path: "admin/class-schedule",
      component: "ClassSchedule",
    },
    {
      name: "Student Attendance",
      path: "admin/student-attendance",
      component: "StudentAttendance",
    },
    {
      name: "Leave Requests",
      path: "admin/leave-req",
      children:[
        {
          name: "Lecturer Leave Requests",
          path: "lecturer-leave-req",
          component: "LecturerLeaveReq",
        },
        {
          name: "Student Leave Requests",
          path: "student-leave-req",
          component: "StudentLeaveReq",
        },
      ]
    },
    {
      name: "Substitute Teaching",
      path: "admin/substitute-teaching",
      component: "SubstituteTeaching",
    },
    {
      name: "Extra Time Requests",
      path: "admin/extra-time-req",
      component: "ExtraTimeReq",
    },
    {
      name: "Report",
      path: "admin/report",
      component: "Report",
    },
    {
      name: "User Management",
      path: "admin/user-management",
      component: "UserManage",
    }
  ],
  protectedRouteLecturer : [
    {
      name: "Lecturer Dashboard",
      path: "system/dashboard",
      component: "LecturerDashboard",
    },
    {
      name: "Class Schedule",
      path: "lecturer/class-schedule",
      component: "LecturerClassSchedule",
    },
    {
      name: "Teaching Hours Summary",
      path: "lecturer/teaching-hours-summary",
      component: "TeachingHours",
    },
    {
      name: "Attendance Sheet",
      path: "lecturer/attendance-sheet",
      component: "AttendanceSheet",
    },
    {
      name: "Leave Requests",
      path: "lecturer/leave-req",
      component: "LecturerLeave",
    },
    {
      name: "Review Student Leave Requests",
      path: "lecturer/review-student-leave-req",
      component: "ReviewStuLeaveReq",
    },
  ],
  protectedRouteStudent : [
    {
      name: "Student Dashboard",
      path: "system/dashboard",
      component: "StudentDashboard",
    },
    {
      name: "Class Schedule",
      path: "student/class-schedule",
      component: "StudentClassSchedule",
    },
    {
      name: "View Attendance By Subject",
      path: "student/view-attendance-by-subject",
      component: "ViewAttBySubject",
    },
    {
      name: "Leave Requests",
      path: "student/leave-req",
      component: "StudentLeave",
    },
    {
      name: "View Leave Status",
      path: "student/view-leave-status",
      component: "ViewLeaveStatus",
    },
    {
      name: "QR Code List",
      path: "student/qr-code-list",
      component: "QrCodeList",
    },
  ],
}


const RouterAppApi = {
  async get(req: RequestWithUser, res: FastifyReply) {
    try {
      const userRole = (req.user?.assign_type || "").toLowerCase();

      if (!userRole) {
        return res.status(401).send({ error: "Unauthorized: no role in token" });
      }

      const matchedRoutes = allRoutes.filter(r => r.role.toLowerCase() === userRole);

      if (matchedRoutes.length === 0) {
        return res.status(403).send({ error: "Access denied: No route for this role", role: userRole });
      }

      res.status(200).send({ routes: matchedRoutes[0] }); // Return only the matched route
    } catch (error) {
      console.error("Error in GET /router/routes:", error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  },
};


export default RouterAppApi;
