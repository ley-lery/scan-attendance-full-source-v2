// ========== Icons ==========
import { GrDashboard } from "react-icons/gr";
import { Bolt, CircleGauge } from "lucide-react";
import React from "react";
import { LiaUniversitySolid } from "react-icons/lia";
import { RiUserSettingsLine } from "react-icons/ri";
import { IoBookOutline, IoCalendarOutline } from "react-icons/io5";
import { PiChalkboardTeacherLight, PiFileTextLight, PiNotepadLight, PiStudentLight } from "react-icons/pi";
import { BsFileEarmarkText, BsSend } from "react-icons/bs";
import { CiClock2, CiEdit } from "react-icons/ci";
import { MdOutlineMeetingRoom, MdOutlineSsidChart } from "react-icons/md";
import { FiUser } from "react-icons/fi";
import { RxMixerHorizontal } from "react-icons/rx";
import { VscSettings } from "react-icons/vsc";
import { IoIosLogOut } from "react-icons/io";

// ========== Types ==========
interface MenuItem {
  icon: React.ComponentType;
  title: string;
  to: string;
}

interface MenuGroup {
  icon: React.ComponentType;
  title: string;
  items: MenuItem[];
}

interface MenuSection {
  group: string;
  items: MenuGroup[];
}

// ========= Role-based Menus ==========
export const roleMenus = {
  // ========= Admin Portal Menus ==========
  adminMenus: [
    {
      group: "general",
      items: [
        { icon: CircleGauge, title: "dashboard", to: "/system/dashboard", items: [] },
      ],
    },
    {
      group: "academic",
      items: [
        {  icon: LiaUniversitySolid, title: "faculty", to: "/admin/academic/faculty", items: [] },
        {  icon: Bolt, title: "field", to: "/admin/academic/field", items: [] },
        {  icon: IoBookOutline, title: "course", to: "/admin/academic/course", items: [] },
        {  icon: RxMixerHorizontal, title: "program", to: "/admin/academic/program", items: [] },
        {
          icon: MdOutlineMeetingRoom,
          title: "class",
          items: [
            { icon: VscSettings, title: "manageClass", to: "/admin/academic/class/manage-classes" },
            { icon: BsFileEarmarkText, title: "classSchedule", to: "/admin/academic/class/class-schedule" },
            { icon: PiStudentLight, title: "classStudent", to: "/admin/academic/class/class-students" },
            { icon: CiEdit, title: "attendance", to: "/admin/academic/class/attendance" },
          ],
        },
      ],
    },
    {
      group: "lecturer",
      items: [
        { icon: PiChalkboardTeacherLight, title: "manageLecturer", to: "/admin/lecturer/manage-lecturer", items: [] },
        { icon: IoBookOutline , title: "lecturerCourse", to: "/admin/lecturer/lecturer-course", items: [] },
        { icon: BsSend, title: "lecturerLeaveReq", to: "/admin/lecturer/leave-req", items: [] },
      ],
    },
    {
      group: "student",
      items: [
        { icon: PiStudentLight, title: "manageStudent", to: "/admin/student/manage-student", items: [] },
        { icon: BsSend, title: "studentLeaveReq", to: "/admin/student/leave-req", items: [] },
      ],
    },
    {
      group: "userRole",
      items: [
        { icon: FiUser, title: "user", to: "/admin/users/user", items: [] },
        { icon: RiUserSettingsLine, title: "role", to: "/admin/users/role", items: [] },
        { icon: RiUserSettingsLine, title: "permission", to: "/admin/users/permission", items: [] },
        { icon: RiUserSettingsLine, title: "rolePermission", to: "/admin/users/role-permission", items: [] },
        { icon: RiUserSettingsLine, title: "userRole", to: "/admin/users/user-role", items: [] },
        { icon: RiUserSettingsLine, title: "userPermission", to: "/admin/users/user-permission", items: [] },
      ],
    },
    {
      group: "report",
      items: [
        { icon: MdOutlineSsidChart, title: "attendanceReport", to: "/admin/report/attendance-report", items: [] },
        { icon: MdOutlineSsidChart, title: "studentReport", to: "/admin/report/student-report", items: [] },
        { icon: MdOutlineSsidChart, title: "lecturerReport", to: "/admin/report/lecturer-report", items: [] },
        { icon: MdOutlineSsidChart, title: "leaveReport", to: "/admin/report/leave-report", items: [] },
      ],
    },
    {
      group: "system",
      items: [
        { icon: PiNotepadLight, title: "auditLog", to: "/admin/system/audit-logs", items: [] },
      ],
    },
  ] as MenuSection[],

  // ========= Lecturer Portal Menus ==========
  lecturerMenus: [
    {
      group: "general",
      items: [
        { icon: Bolt, title: "overview", to: "/system/dashboard", items: [] },
      ],
    },
    {
      group: "Classes",
      items: [
        { icon: Bolt, title: "myClasses", to: "/lecturer/classes/my-classes", items: [] },
        { icon: Bolt, title: "classSchedule", to: "/lecturer/classes/class-schedule", items: [] },
        { icon: Bolt, title: "classAttendance", to: "/lecturer/classes/class-attendance", items: [] },
        { icon: Bolt, title: "studentAttendanceReport", to: "/lecturer/classes/student-attendance-report", items: [] },
      ],
    },
    {
      group: "Student",
      items: [
        { icon: Bolt, title: "markStudentAttendance", to: "/lecturer/student/mark-attendance-student", items: [] },
      ],
    },
    {
      group: "Leave Management",
      items: [
        { icon: Bolt, title: "leaveReq", to: "/lecturer/leave-management/leave-req", items: [] },
        { icon: Bolt, title: "leaveHistory", to: "/lecturer/leave-management/leave-history", items: [] },
        { icon: Bolt, title: "studentLeaveReq", to: "/lecturer/leave-management/student/leave-req", items: [] },
        { icon: Bolt, title: "myLeaveReq", to: "/lecturer/leave-management/my-leave-req", items: [] },
      ],
    },
 
  ] as MenuSection[],

  // ========= Student Portal Menus ==========
  studentMenus: [
    {
      group: "Dashboard",
      items: [
        { icon: Bolt, title: "overview", to: "/system/dashboard", items: [] },
      ],
    },
    {
      group: "Classes",
      items: [
        { icon: MdOutlineMeetingRoom, title: "myClasses", to: "/student/classes/my-classes", items: [] },
        { icon: IoCalendarOutline, title: "classSchedule", to: "/student/classes/class-schedule", items: [] },
        { icon: PiFileTextLight, title: "classAttendance", to: "/student/classes/class-attendance", items: [] },
      ],
    },
    {
      group: "Leave Management",
      items: [
        { icon: IoIosLogOut, title: "leaveReq", to: "/student/leave-management/leave-req", items: [] },
        { icon: CiClock2, title: "leaveHistory", to: "/student/leave-management/leave-history", items: [] },
      ],
    },
    {
      group: "Profile",
      items: [
        { icon: Bolt, title: "personalInfo", to: "/student/profile/personal-info", items: [] },
        { icon: Bolt, title: "changePassword", to: "/student/profile/change-password", items: [] },
      ],
    },
    {
      group: "Support",
      items: [
        { icon: Bolt, title: "helpCenterFqa", to: "/student/support/help-center-fqa", items: [] },
        { icon: Bolt, title: "adminCantact", to: "/student/support/contact-admin", items: [] },
      ],
    },
  ] as MenuSection[],
};

// ========= Get Role Menus Function ==========
export const getRoleMenus = (role: string): MenuSection[] => {
  switch (role?.toLowerCase()) {
    case "admin":
      return roleMenus.adminMenus;
    case "lecturer":
      return roleMenus.lecturerMenus;
    default:
      return roleMenus.studentMenus;
  }
};