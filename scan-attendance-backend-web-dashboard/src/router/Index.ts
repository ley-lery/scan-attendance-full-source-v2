import { lazy, type ComponentType } from "react";

// ======== Route Configuration Interface ==========
export interface RouteConfig {
  name: string;
  path: string;
  component?: ComponentType<any>;
  children?: RouteConfig[];
  redirect?: string;
}

// ========= Public routes Authentication views ==========
const Login = lazy(() => import("@/views/auth/login/Login"));
const Register = lazy(() => import("@/views/auth/register/Register"));

// ======== Redirect routes that do not require authentication ==========
export const redirectRoute: RouteConfig[] = [
  { name: "Login", path: "/login", component: Login },
  { name: "Register", path: "/register", component: Register },
];

// ============= Admin Portal Protected Routes ============= 
export const protectedRouteAdmin: RouteConfig[] = [
  {
    name: "Dashboard",
    path: "system/dashboard",
    component: lazy(() => import("@/views/admin-portal/dashboard/Index")),
  },
  // Academic Group
  {
    name: "Academic Faculty",
    path: "admin/academic/faculty",
    component: lazy(() => import("@/views/admin-portal/academic/faculty/Index")),
  },
  {
    name: "Academic Field",
    path: "admin/academic/field",
    component: lazy(() => import("@/views/admin-portal/academic/field/Index")),
  },
  {
    name: "Academic Course",
    path: "admin/academic/course",
    component: lazy(() => import("@/views/admin-portal/academic/course/Index")),
  },
  {
    name: "Academic Program",
    path: "admin/academic/program",
    component: lazy(() => import("@/views/admin-portal/academic/program/Index")),
  },
  {
    name: "Academic Class Manage Classes",
    path: "admin/academic/class/manage-classes",
    component: lazy(() => import("@/views/admin-portal/academic/class/mange-classes/Index")),
  },
  {
    name: "Academic Class Manage Students",
    path: "admin/academic/class/class-students",
    component: lazy(() => import("@/views/admin-portal/academic/class/class-student/Index")),
  },
  {
    name: "Academic Class Schedule",
    path: "admin/academic/class/class-schedule",
    component: lazy(() => import("@/views/admin-portal/academic/class/class-schedule/Index")),
  },
  // Lecturer Group
  {
    name: "Lecturer Manage Lecturers",
    path: "admin/lecturer/manage-lecturer",
    component: lazy(() => import("@/views/admin-portal/lecturer/manage-lecturer/Index")),
  },
  {
    name: "Lecturer Manage Courses",
    path: "admin/lecturer/lecturer-course",
    component: lazy(() => import("@/views/admin-portal/lecturer/lecturer-course/Index")),
  },
  {
    name: "Lecturer Leave Requests",
    path: "admin/lecturer/leave-req",
    component: lazy(() => import("@/views/admin-portal/lecturer/leave-req/Index")),
  },
  // Student Group
  {
    name: "Student Manage Students",
    path: "admin/student/manage-student",
    component: lazy(() => import("@/views/admin-portal/student/manage-student/Index")),
  },
  {
    name: "Student Leave Requests",
    path: "admin/student/leave-req",
    component: lazy(() => import("@/views/admin-portal/student/leave-req/Index")),
  },
  {
    name: "Student Mark Attendance",
    path: "admin/student/mark-attendance",
    component: lazy(() => import("@/views/admin-portal/student/mark-attendance-student/Index")),
  },
  // Users Group
  {
    name: "User Manage Users",
    path: "admin/users/user",
    component: lazy(() => import("@/views/admin-portal/manage-user/user/Index")),
  },
  {
    name: "User Manage Role",
    path: "admin/users/role",
    component: lazy(() => import("@/views/admin-portal/manage-user/role/Index")),
  },
  {
    name: "User Manage Permission",
    path: "admin/users/permission",
    component: lazy(() => import("@/views/admin-portal/manage-user/permission/Index")),
  },
  {
    name: "User Manage Role Permission",
    path: "admin/users/role-permission",
    component: lazy(() => import("@/views/admin-portal/manage-user/role-permission/Index")),
  },
  {
    name: "User Manage User Permission",
    path: "admin/users/user-permission",
    component: lazy(() => import("@/views/admin-portal/manage-user/user-permission/Index")),
  },
  {
    name: "User Manage User Role",
    path: "admin/users/user-role",
    component: lazy(() => import("@/views/admin-portal/manage-user/user-role/Index")),
  },
  // Reports Group
  {
    name: "Faculty Field Summary",
    path: "admin/reports/general-academic/faculty-field-summary",
    component: lazy(() => import("@/views/admin-portal/reports/general-academic/faculty-field-summary/Index")),
  },
  {
    name: "Total Faculties Fields",
    path: "admin/reports/general-academic/total-faculties-fields",
    component: lazy(() => import("@/views/admin-portal/reports/general-academic/total-faculties-fields/Index")),
  },
  {
    name: "Classes Per Faculty",
    path: "admin/reports/general-academic/classes-per-faculty",
    component: lazy(() => import("@/views/admin-portal/reports/general-academic/classes-per-faculty/Index")),
  },
  {
    name: "Attendance Summary",
    path: "admin/reports/attendance/summary",
    component: lazy(() => import("@/views/admin-portal/reports/attendance-report/summary/Index")),
  },
  // Audit Logs Group
  {
    name: "Audit Logs",
    path: "admin/system/audit-logs",
    component: lazy(() => import("@/views/admin-portal/system/audit-logs/Index")),
  },
];

// ============= Lecturer Portal Protected Routes ============= 
export const protectedRouteLecturer: RouteConfig[] = [
  {
    name: "Lecturer Dashboard",
    path: "system/dashboard",
    component: lazy(() => import("@/views/lecturer-portal/dashboard/Index")),
  },
  {
    name: "Mark Student Attendance",
    path: "lecturer/student/mark-attendance-student",
    component: lazy(() => import("@/views/lecturer-portal/student/mark-attendance-student/Index")),
  },
  {
    name: "Student Leave Requests",
    path: "lecturer/leave-management/student/leave-req",
    component: lazy(() => import("@/views/lecturer-portal/leave-management/student/leave-req/Index")),
  },
  {
    name: "My Leave Requests",
    path: "lecturer/leave-management/my-leave-req",
    component: lazy(() => import("@/views/lecturer-portal/leave-management/my-leave-req/leave-req/Index")),
  },
  {
    name: "My Leave History",
    path: "lecturer/leave-management/leave-history",
    component: lazy(() => import("@/views/lecturer-portal/leave-management/my-leave-req/leave-history/Index")),
  },
];

// ============= Student Portal Protected Routes ============= 
export const protectedRouteStudent: RouteConfig[] = [
  {
    name: "Student Dashboard",
    path: "system/dashboard",
    component: lazy(() => import("@/views/student-portal/dashboard/Index")),
  },
  {
    name: "My Classes",
    path: "student/classes/my-classes",
    component: lazy(() => import("@/views/student-portal/classes/my-classes/Index")),
  },
  {
    name: "Class Schedule",
    path: "student/classes/class-schedule",
    component: lazy(() => import("@/views/student-portal/classes/class-schedule/Index")),
  },
  {
    name: "Class Attendance Record",
    path: "student/classes/class-attendance",
    component: lazy(() => import("@/views/student-portal/classes/class-attendace-record/Index")),
  },
  {
    name: "Leave Requests",
    path: "student/leave-management/leave-req",
    component: lazy(() => import("@/views/student-portal/leave-management/leave-req/Index")),
  },
  {
    name: "Leave History",
    path: "student/leave-management/leave-history",
    component: lazy(() => import("@/views/student-portal/leave-management/leave-history/Index")),
  },
  {
    name: "Personal Info",
    path: "student/profile/personal-info",
    component: lazy(() => import("@/views/student-portal/profile/personal-info/Index")),
  },
  {
    name: "Change Password",
    path: "student/profile/change-password",
    component: lazy(() => import("@/views/student-portal/profile/change-password/Index")),
  },
  {
    name: "Help Center FAQ",
    path: "student/support/help-center-fqa",
    component: lazy(() => import("@/views/student-portal/support/help-center-fqa/Index")),
  },
  {
    name: "Contact Admin",
    path: "student/support/contact-admin",
    component: lazy(() => import("@/views/student-portal/support/contact-admin/Index")),
  },
];

// Memoized route getter with role-based mapping
const ROUTE_MAP: Record<string, RouteConfig[]> = {
  Admin: protectedRouteAdmin,
  Lecturer: protectedRouteLecturer,
  Student: protectedRouteStudent,
};

export const getProtectedRoutes = (role: string | undefined): RouteConfig[] => {
  return role ? (ROUTE_MAP[role] ?? []) : [];
};

const RouteConfigExport = {
  redirectRoute,
  protectedRouteAdmin,
  protectedRouteLecturer,
  protectedRouteStudent,
};

export default RouteConfigExport;