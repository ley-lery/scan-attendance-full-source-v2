import { FastifyReply } from "fastify";
import { RequestWithUser } from "../../middlewares/auth.middleware";

const menusByRole: Record<string, any[]> = {
  admin: [
    {
      icon: "GrDashboard",
      title: "Dashboard",
      items: [
        { icon: "CiViewBoard", name: "Overview", to: "/admin/dashboard" },
        { icon: "TbReportAnalytics", name: "Reports", to: "/admin/reports" }
      ]
    },
    {
      icon: "LiaUniversitySolid",
      title: "Management",
      items: [
        { icon: "CiCircleList", name: "Class Schedule", to: "/admin/class-schedule" },
        { icon: "CiCircleList", name: "Student Attendance", to: "/admin/student-attendance" },
        { icon: "CiCircleList", name: "Leave Requests", to: "/admin/leave-req" },
        { icon: "CiCircleList", name: "User Management", to: "/admin/user-management" }
      ]
    }
  ],
  lecturer: [
    {
      icon: "GrDashboard",
      title: "Teaching",
      items: [
        { icon: "CiViewBoard", name: "Teaching Schedule", to: "/lecturer/schedule" },
        { icon: "CiCircleList", name: "Attendance Sheet", to: "/lecturer/attendance" },
        { icon: "CiCircleList", name: "Leave Request", to: "/lecturer/leave-req" },
        { icon: "CiCircleList", name: "Student Leave Review", to: "/lecturer/review-leave" }
      ]
    }
  ],
  student: [
    {
      icon: "GrDashboard",
      title: "Dashboard",
      to: "/student/dashboard",
      items: []
    },
    {
      icon: "GrDashboard",
      title: "Schedule",
      to: "/student/schedule",
      items: []
    }
  ]
};

export const RouterMenu = {
  async getMenus(req: RequestWithUser, res: FastifyReply) {
    try {
      const role = (req.user?.assign_type || "").toLowerCase();

      if (!menusByRole[role]) {
        return res.status(403).send({
          error: "Access denied: No menu for this role",
          role
        });
      }

      res.status(200).send({ menus: menusByRole[role] });
    } catch (e) {
      res.status(500).send({ error: "Internal Server Error" });
    }
  }
};
