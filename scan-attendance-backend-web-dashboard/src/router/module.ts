/* eslint-disable @typescript-eslint/no-explicit-any */
import { lazy } from "react";

// Admin routes
export const AdminRouterMap: Record<string, React.ComponentType<any>> = {
  AdminDashboard: lazy(() => import("@/views/admin-portal/dashboard/Index")),
  ClassSchedule: lazy(() => import("@/views/admin-portal/manage-class-schedule/Index")),
  StudentAttendance: lazy(() => import("@/views/admin-portal/student/attendance/Index")),
  LecturerLeaveReq: lazy(() => import("@/views/admin-portal/lecturer/leave-req/Index")),
  StudentLeaveReq: lazy(() => import("@/views/admin-portal/student/leave-req/Index")),
  SubstituteTeaching: lazy(() => import("@/views/admin-portal/manage-class-schedule/Index")),
  ExtraTimeReq: lazy(() => import("@/views/admin-portal/lecturer/extra-time-req/Index")),
  Report: lazy(() => import("@/views/admin-portal/report/Index")),
  UserManage: lazy(() => import("@/views/admin-portal/user/Index")),
};

// Lecturer routes
export const LecturerRouterMap: Record<string, React.ComponentType<any>> = {
  LecturerDashboard: lazy(() => import("@/views/lecturer-portal/dashboard/Index")),
  LecturerClassSchedule: lazy(() => import("@/views/lecturer-portal/schedule/Index")),
  TeachingHours: lazy(() => import("@/views/lecturer-portal/teaching-hours-summary/Index")),
  AttendanceSheet: lazy(() => import("@/views/lecturer-portal/my-attendance/Index")),
  LecturerLeave: lazy(() => import("@/views/lecturer-portal/leave-req/Index")),
  ReviewStuLeaveReq: lazy(() => import("@/views/lecturer-portal/review-student-leave-req/Index")),
};

// Student routes
export const StudentRouterMap: Record<string, React.ComponentType<any>> = {
  StudentDashboard: lazy(() => import("@/views/student-portal/dashboard/Index")),
  StudentClassSchedule: lazy(() => import("@/views/student-portal/shedule/Index")),
  ViewAttBySubject: lazy(() => import("@/views/student-portal/attendance/Index")),
  StudentLeave: lazy(() => import("@/views/student-portal/leave-management/leave-req/Index")),
};

// Combined router map
export const RoleBasedRouterMap: Record<string, React.ComponentType<any>> = {
  ...AdminRouterMap,
  ...LecturerRouterMap,
  ...StudentRouterMap,
};
