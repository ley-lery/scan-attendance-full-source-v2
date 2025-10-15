/* eslint-disable @typescript-eslint/no-explicit-any */
import { lazy } from "react";

// ========= Public routes Authentication views ==========
const Login = lazy(() => import("@/views/auth/login/Login"));
const Register = lazy(() => import("@/views/auth/register/Register"));

// ======== Admin Portal Views Start ==========
const AdminDashboard = lazy(() => import("@/views/admin-portal/dashboard/Index"));
const ClassSchedule = lazy(() => import("@/views/admin-portal/manage-class-schedule/Index"));
const AdminLecturerAttendance = lazy(() => import("@/views/admin-portal/lecturer/attendance/Index"));
const AdminLectureExtraTimeReq = lazy(() => import("@/views/admin-portal/lecturer/extra-time-req/Index"));
const AdminLecturerLeaveReq = lazy(() => import("@/views/admin-portal/lecturer/leave-req/Index"));
const AdminStudentAttendance = lazy(() => import("@/views/admin-portal/student/attendance/Index"));
const AdminStudentLeaveReq = lazy(() => import("@/views/admin-portal/student/leave-req/Index"));
const Report = lazy(() => import("@/views/admin-portal/report/Index"));
const UserManage = lazy(() => import("@/views/admin-portal/user/Index"));

const AcademicCourse = lazy(() => import("@/views/admin-portal/academic/course/Index"));



// ======== Admin Portal Views End ==========

// ======== Lecturer Portal Views ==========
const LecturerDashboard = lazy(() => import("@/views/lecturer-portal/dashboard/Index"));
const LecturerClassSchedule = lazy(() => import("@/views/lecturer-portal/schedule/Index"));
const TeachingHours = lazy(() => import("@/views/lecturer-portal/teaching-hours-summary/Index"));
const LecturerAttendance = lazy(() => import("@/views/lecturer-portal/my-attendance/Index"));
const LecturerLeave = lazy(() => import("@/views/lecturer-portal/leave-req/Index"));
const LecturerExtraLeaveReq = lazy(() => import("@/views/lecturer-portal/extra-time-req/Index"));

const ReviewStuLeaveReq = lazy(() => import("@/views/lecturer-portal/review-student-leave-req/Index"));
const LecturerStudentRequest = lazy(() => import("@/views/lecturer-portal/student/leave-req/Index"));
const LecturerStudentAttendance = lazy(() => import("@/views/lecturer-portal/student/attendance/Index"));
// ======== Lecturer Portal Views End ==========

// ======== Student Portal Views Start ==========
const StudentDashboard = lazy(() => import("@/views/student-portal/dashboard/Index"));
const StudentClassSchedule = lazy(() => import("@/views/student-portal/shedule/Index"));
const ViewAttBySubject = lazy(() => import("@/views/student-portal/attendance/Index"));
const StudentLeave = lazy(() => import("@/views/student-portal/leave-management/leave-req/Index"));
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
  {
    name: "Academic Course",
    path: "admin/academic/course",
    component: AcademicCourse,
  },
  {
    name: "Class Schedule",
    path: "admin/class-schedule",
    component: ClassSchedule,
  },

  // Lecturer 
  {
    name: "Lecturer Attendance",
    path: "admin/lecturer/attendance",
    component: AdminLecturerAttendance,
  },
  {
    name: 'Lecturer Leave Requests',
    path: 'admin/leacturer/leave-req',   
    component: AdminLecturerLeaveReq,
  },
  {
    name: 'Lecturer Extra Time Request',
    path: 'admin/leacturer/extra-time-req',   
    component: AdminLectureExtraTimeReq,
  },
  
  // Student
  {
    name: "Student Attendance",
    path: "admin/student/attendance",
    component: AdminStudentAttendance,
  },
  {
    name: "Student Leave Requests",
    path: "admin/student/leave-req",
    component: AdminStudentLeaveReq,
  },

  // Report and User Management
  {
    name: "User Management",
    path: "admin/user-management",
    component: UserManage,
  },
  {
    name: "Report",
    path: "admin/report",
    component: Report,
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
    name: "Class Schedule",
    path: "lecturer/class-schedule",
    component: LecturerClassSchedule,
  },
  {
    name: "Attendance",
    path: "lecturer/attendance",
    component: LecturerAttendance,
  },
  {
    name: "Leave Requests",
    path: "lecturer/leave-req",
    component: LecturerLeave,
  },
  {
    name: "Extra Time Requests",
    path: "lecturer/extra-time-req",
    component: LecturerExtraLeaveReq,
  },
  {
    name: "Teaching Hours Summary",
    path: "lecturer/teaching-hours-summary",
    component: TeachingHours,
  },
  {
    name: "Review Student Leave Requests",
    path: "lecturer/review-student-leave-req",
    component: ReviewStuLeaveReq,
  },
  {
    name: "Student Leave Requests",
    path: "lecturer/student/leave-req",
    component: LecturerStudentRequest,
  },
  {
    name: "Student Attendance",
    path: "lecturer/student/attendance",
    component: LecturerStudentAttendance, 
  },
];

// ============= Student Portal Protected Routes ============= 
export const protectedRouteStudent: RouteConfig[] = [
  {
    name: "Student Dashboard",
    path: "system/dashboard",
    component: StudentDashboard,
  },
  {
    name: "Class Schedule",
    path: "student/class-schedule",
    component: StudentClassSchedule,
  },
  {
    name: "View Attendance By Subject",
    path: "student/attendance",
    component: ViewAttBySubject,
  },
  {
    name: "Leave Requests",
    path: "student/leave-req",
    component: StudentLeave,
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