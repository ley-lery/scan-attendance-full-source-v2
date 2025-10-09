/* eslint-disable @typescript-eslint/no-explicit-any */
import { lazy } from "react";

// ========= Public routes Authentication views ==========
const Login = lazy(() => import("@/views/auth/login/Login"));
const Register = lazy(() => import("@/views/auth/register/Register"));

// ======== Admin Portal Views Start ==========
const AdminDashboard = lazy(() => import("@/views/admin-portal/dashboard/Index"));
const AcademicFaculty = lazy(() => import("@/views/admin-portal/academic/faculty/Index"));
const AcademicField = lazy(() => import("@/views/admin-portal/academic/field/Index"));
const AcademicCourse = lazy(() => import("@/views/admin-portal/academic/course/Index"));
const AcademicProgram = lazy(() => import("@/views/admin-portal/academic/program/Index"));
const AcademicClassManageClasses = lazy(() => import("@/views/admin-portal/academic/class/mange-classes/Index"));
const AcademicClassManageStudents = lazy(() => import("@/views/admin-portal/academic/class/class-student/Index"));
const AcademicClassSchedule = lazy(() => import("@/views/admin-portal/academic/class/class-schedule/Index"));
const LecturerManageLecturers = lazy(() => import("@/views/admin-portal/lecturer/manage-lecturer/Index"));
const LecturerLecturerCourses = lazy(() => import("@/views/admin-portal/lecturer/lecturer-course/Index"));
const LecturerLeaveReq = lazy(() => import("@/views/admin-portal/lecturer/leave-req/Index"));
const StudentManageStudents = lazy(() => import("@/views/admin-portal/student/manage-student/Index"));
const StudentLeaveReq = lazy(() => import("@/views/admin-portal/student/leave-req/Index"));
const UserMangeUser = lazy(() => import("@/views/admin-portal/manage-user/user/Index"));
const UserMangeRole = lazy(() => import("@/views/admin-portal/manage-user/role/Index"));
const UserMangePermission = lazy(() => import("@/views/admin-portal/manage-user/permission/Index"));
const UserMangeRolePermission = lazy(() => import("@/views/admin-portal/manage-user/role-permission/Index"));
const UserMangeUserPermission = lazy(() => import("@/views/admin-portal/manage-user/user-permission/Index"));
const UserMangeUserRole = lazy(() => import("@/views/admin-portal/manage-user/user-role/Index"));
const SystemAuditLogs = lazy(() => import("@/views/admin-portal/system/audit-logs/Index"));



// ======== Admin Portal Views End ==========

// ======== Lecturer Portal Views ==========
const LecturerDashboard = lazy(() => import("@/views/lecturer-portal/dashboard/Index"));
const LecturerAttendanceStudent = lazy(() => import("@/views/lecturer-portal/student/mark-attendance-student/Index"));

// ======== Lecturer Portal Views End ==========


// ======== Student Portal Views Start ==========
const StudentDashboard = lazy(() => import("@/views/student-portal/dashboard/Index"));
const StudentLeave = lazy(() => import("@/views/student-portal/leave-management/leave-req/Index"));
const StudentLeaveHistory = lazy(() => import("@/views/student-portal/leave-management/leave-history/Index"));
const StudentClassSchedule = lazy(() => import("@/views/student-portal/classes/class-schedule/Index"));
// ======== Student Portal Views End ==========

// ======== Route Configuration Interface ==========
export interface RouteConfig {
  name: string;
  path: string;
  component?: React.ComponentType<any>;
  children?: RouteConfig[];
  redirect?: string;
}

// ======== Redirect routes that do not require authentication ==========
export const redirectRoute: RouteConfig[] = [
  {
    name: "Login",
    path: "/login",
    component: Login,
  },
  {
    name: "Register",
    path: "/register",
    component: Register,
  },
  
];

// Protected routes that require authentication

// ============= Admin Portal Protected Routes ============= 
export const protectedRouteAdmin: RouteConfig[] = [
  {
    name: "Dashboard",
    path: "system/dashboard",
    component: AdminDashboard,
  },

  // Academic Group
  {
    name: "Academic Faculty",
    path: "admin/academic/faculty",
    component: AcademicFaculty,
  },
  {
    name: "Academic Field",
    path: "admin/academic/field",
    component: AcademicField,
  },
  {
    name: "Academic Course",
    path: "admin/academic/course",
    component: AcademicCourse,
  },
  {
    name: "Academic Program",
    path: "admin/academic/program",
    component: AcademicProgram,
  },
  {
    name: "Academic Class Manage Classes",
    path: "admin/academic/class/manage-classes",
    component: AcademicClassManageClasses,
  },
  {
    name: "Academic Class Manage Students",
    path: "admin/academic/class/class-students",
    component: AcademicClassManageStudents,
  },
  {
    name: "Lecturer Manage Lecturers",
    path: "admin/lecturer/manage-lecturer",
    component: LecturerManageLecturers,
  },
  {
    name: "Lecturer Manage Courses",
    path: "admin/lecturer/lecturer-course",
    component: LecturerLecturerCourses,
  },
  {
    name: "Lecturer Leave Requests",
    path: "admin/lecturer/leave-req",
    component: LecturerLeaveReq,
  },
  {
    name: "Academic Class Schedule",
    path: "admin/academic/class/class-schedule",
    component: AcademicClassSchedule,
  },

  // Student Group
  {
    name: "Student Manage Students",
    path: "admin/student/manage-student",
    component: StudentManageStudents,
  },
  {
    name: "Student Leave Requests",
    path: "admin/student/leave-req",
    component: StudentLeaveReq,
  },
  
  // Users Group
  {
    name: "User Manage Users",
    path: "admin/users/user",
    component: UserMangeUser,
  },
  {
    name: "User Mange Role",
    path: "admin/users/role",
    component: UserMangeRole,
  },
  {
    name: "User Mange Permission",
    path: "admin/users/permission",
    component: UserMangePermission,
  },
  {
    name: "User Mange Role Permission",
    path: "admin/users/role-permission",
    component: UserMangeRolePermission,
  },
  {
    name: "User Mange User Permission",
    path: "admin/users/user-permission",
    component: UserMangeUserPermission,
  },
  {
    name: "User Mange User Role",
    path: "admin/users/user-role",
    component: UserMangeUserRole,
  },

  // Audit Logs Group
  {
    name: "Audit Logs",
    path: "admin/system/audit-logs",
    component: SystemAuditLogs,
  },

];

// ============= Lecturer Portal Protected Routes ============= 
export const protectedRouteLecturer: RouteConfig[] = [
  {
    name: "Lecturer Dashboard",
    path: "system/dashboard",
    component: LecturerDashboard,
  },
  {
    name: "Mark Student Attendance",
    path: "lecturer/student/mark-attendance-student",
    component: LecturerAttendanceStudent,
  }
 
];

// ============= Student Portal Protected Routes ============= 
export const protectedRouteStudent: RouteConfig[] = [
  {
    name: "Student Dashboard",
    path: "system/dashboard",
    component: StudentDashboard,
  },
  {
    name: "Leave Requests",
    path: "student/leave-management/leave-req",
    component: StudentLeave,
  },
  {
    name: "Leave History",
    path: "student/leave-management/leave-history",
    component: StudentLeaveHistory,
  },
  {
    name: "Student Class Schedule",
    path: "student/classes/class-schedule",
    component: StudentClassSchedule,
  },
];

const RouteConfigExport = {
  redirectRoute,
  protectedRouteAdmin,
  protectedRouteLecturer,
  protectedRouteStudent,
};

export const getProtectedRoutes = (role: string | undefined) => {
  switch (role) {
    case "Admin":
      return protectedRouteAdmin;
    case "Lecturer":
      return protectedRouteLecturer;
    case "Student":
      return protectedRouteStudent;
    default:
      return [];
  }
};

export default RouteConfigExport;