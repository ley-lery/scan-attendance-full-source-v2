import { Bolt, CircleGauge } from "lucide-react";
import { type ComponentType } from "react";
import { LiaUniversitySolid } from "react-icons/lia";
import { RiUserSettingsLine } from "react-icons/ri";
import { IoBookOutline, IoCalendarOutline } from "react-icons/io5";
import { PiChalkboardTeacherLight, PiFileTextLight, PiNotepadLight, PiStudentLight } from "react-icons/pi";
import { BsFileEarmarkText, BsSend } from "react-icons/bs";
import { CiClock2 } from "react-icons/ci";
import { MdOutlineMeetingRoom, MdOutlineSsidChart } from "react-icons/md";
import { FiUser } from "react-icons/fi";
import { RxMixerHorizontal } from "react-icons/rx";
import { VscSettings } from "react-icons/vsc";
import { IoIosLogOut } from "react-icons/io";

// ========== Types ==========
interface MenuItem {
  icon: ComponentType;
  title: string;
  to?: string;
  status?: string;
  statusMsg?: string;
  items?: MenuItem[];
}

interface MenuGroup {
  icon: ComponentType;
  title: string;
  items: MenuItem[];
  to?: string;
  status?: string;
  statusMsg?: string;
}

interface MenuSection {
  group: string;
  items: MenuGroup[];
}

type RoleType = 'admin' | 'lecturer' | 'student';

// ========= Admin Portal Menus ==========
const adminMenus: MenuSection[] = [
  {
    group: "general",
    items: [
      { icon: CircleGauge, title: "dashboard", to: "/system/dashboard", items: [], status: 'Not Ready', statusMsg: 'Static data' },
    ],
  },
  {
    group: "academic",
    items: [
      { icon: LiaUniversitySolid, title: "faculty", to: "/admin/academic/faculty", items: [], status: 'Ready' },
      { icon: Bolt, title: "field", to: "/admin/academic/field", items: [], status: 'Ready' },
      { icon: IoBookOutline, title: "course", to: "/admin/academic/course", items: [], status: 'Ready' },
      { icon: RxMixerHorizontal, title: "program", to: "/admin/academic/program", items: [], status: 'Ready' },
      {
        icon: MdOutlineMeetingRoom,
        title: "class",
        status: 'Not Ready',
        statusMsg: 'Not Ready',
        items: [
          { icon: VscSettings, title: "manageClass", to: "/admin/academic/class/manage-classes", status: 'Ready', statusMsg: 'Ready' },
          { icon: BsFileEarmarkText, title: "classSchedule", to: "/admin/academic/class/class-schedule", status: 'Not Ready', statusMsg: 'Edit, Delete, View' },
          { icon: PiStudentLight, title: "classStudent", to: "/admin/academic/class/class-students", status: 'Not Ready', statusMsg: 'Update single select to multi select student.' },
        ],
      },
    ],
  },
  {
    group: "lecturer",
    items: [
      { icon: PiChalkboardTeacherLight, title: "manageLecturer", to: "/admin/lecturer/manage-lecturer", items: [], status: 'Ready', statusMsg: 'Ready' },
      { icon: IoBookOutline, title: "lecturerCourse", to: "/admin/lecturer/lecturer-course", items: [], status: 'Not Ready', statusMsg: 'Not ready search data' },
      { icon: BsSend, title: "lecturerLeaveReq", to: "/admin/lecturer/leave-req", items: [], status: 'Not Ready', statusMsg: 'Not ready search data' },
    ],
  },
  {
    group: "student",
    items: [
      { icon: PiStudentLight, title: "manageStudent", to: "/admin/student/manage-student", items: [], status: 'Ready', statusMsg: 'Ready' },
      { icon: BsSend, title: "studentLeaveReq", to: "/admin/student/leave-req", items: [], status: 'Not Ready', statusMsg: 'Not ready search data' },
      { icon: BsSend, title: "markStudentAttendance", to: "/admin/student/mark-attendance", items: [], status: 'Not Ready', statusMsg: 'Not readys' },
    ],
  },
  {
    group: "userRole",
    items: [
      { icon: FiUser, title: "user", to: "/admin/users/user", items: [], status: 'Ready', statusMsg: 'Ready' },
      { icon: RiUserSettingsLine, title: "role", to: "/admin/users/role", items: [], status: 'Ready', statusMsg: 'Ready' },
      { icon: RiUserSettingsLine, title: "permission", to: "/admin/users/permission", items: [], status: 'Ready', statusMsg: 'Ready' },
      { icon: RiUserSettingsLine, title: "rolePermission", to: "/admin/users/role-permission", items: [], status: 'Ready', statusMsg: 'Ready' },
      { icon: RiUserSettingsLine, title: "userRole", to: "/admin/users/user-role", items: [], status: 'Not Ready', statusMsg: 'Not ready search data' },
      { icon: RiUserSettingsLine, title: "userPermission", to: "/admin/users/user-permission", items: [], status: 'Ready', statusMsg: 'Ready' },
    ],
  },
  {
    group: "reports",
    items: [
      { 
        icon: MdOutlineSsidChart, 
        title: "academic", 
        items: [
          { icon: MdOutlineSsidChart, title: "student", to: "/admin/reports/attendance/summary", items: [], status: 'Not Ready', statusMsg: 'Not ready search data' },
          { icon: MdOutlineSsidChart, title: "lecturer", to: "/admin/reports/attendance/summary", items: [], status: 'Not Ready', statusMsg: 'Not ready search data' },
        ] 
      },
      { 
        icon: MdOutlineSsidChart, 
        title: "attendance", 
        items: [
          { icon: MdOutlineSsidChart, title: "attendanceSummary", to: "/admin/reports/attendance/summary", items: [], status: 'Not Ready', statusMsg: 'Not ready search data' },
        ] 
      },
      { 
        icon: MdOutlineSsidChart, 
        title: "leaveReq", 
        items: [
          { icon: MdOutlineSsidChart, title: "studentLeave", to: "/admin/reports/attendance/summary", items: [], status: 'Not Ready', statusMsg: 'Not ready search data' },
          { icon: MdOutlineSsidChart, title: "lecturerLeave", to: "/admin/reports/attendance/summary", items: [], status: 'Not Ready', statusMsg: 'Not ready search data' },
        ] 
      },
    ],
  },
  {
    group: "system",
    items: [
      { icon: PiNotepadLight, title: "auditLog", to: "/admin/system/audit-logs", items: [], status: 'Not Ready' },
    ],
  },
];

// ========= Lecturer Portal Menus ==========
const lecturerMenus: MenuSection[] = [
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
      { icon: Bolt, title: "myLeaveReq", to: "/lecturer/leave-management/my-leave-req", items: [] },
      { icon: Bolt, title: "myLeaveHistory", to: "/lecturer/leave-management/leave-history", items: [] },
      { icon: Bolt, title: "studentLeaveReq", to: "/lecturer/leave-management/student/leave-req", items: [] },
    ],
  },
  {
    group: "Reports",
    items: [
      { icon: Bolt, title: "timeSheet", to: "/lecturer/reports/time-sheet", items: [] },
      { icon: Bolt, title: "attendanceReport", to: "/lecturer/reports/attendance-report", items: [] },
      { icon: Bolt, title: "studentLeaveHistory", to: "/lecturer/reports/student-leave-history", items: [] },
    ],
  },
];

// ========= Student Portal Menus ==========
const studentMenus: MenuSection[] = [
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
];

// ========= Optimized Role Menu Mapping ==========
const ROLE_MENU_MAP: Record<RoleType, MenuSection[]> = {
  admin: adminMenus,
  lecturer: lecturerMenus,
  student: studentMenus,
};

// ========= Get Role Menus Function ==========
export const getRoleMenus = (role?: string): MenuSection[] => {
  if (!role) return studentMenus;
  
  const normalizedRole = role.toLowerCase() as RoleType;
  return ROLE_MENU_MAP[normalizedRole] ?? studentMenus;
};

// Export for backwards compatibility
export const roleMenus = {
  adminMenus,
  lecturerMenus,
  studentMenus,
};

export type { MenuItem, MenuGroup, MenuSection, RoleType };