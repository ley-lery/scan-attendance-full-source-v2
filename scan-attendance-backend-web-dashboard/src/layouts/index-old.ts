// ========== Icons ==========
import { GrDashboard } from "react-icons/gr";
import { FaUserCog } from "react-icons/fa";
import { MdOutlineEventAvailable, MdOutlineTimer } from "react-icons/md";
import { HiOutlineDocumentReport, HiOutlinePresentationChartBar } from "react-icons/hi";
import { IoCalendarOutline, IoLogOutOutline, IoQrCodeOutline } from "react-icons/io5";
import { BsSend } from "react-icons/bs";
import { PiStudentLight } from "react-icons/pi";
import { TbListDetails } from "react-icons/tb";

// ========= Role-based Menus ==========
export const roleMenus = {

  // ========= Admin Portal Menus ==========
  adminMenus: [
    { icon: GrDashboard, title: "dashboard", to: "/system/dashboard", items: [] },
    { icon: IoCalendarOutline, title: "classSchedule", to: "/admin/class-schedule", items: [] },
    { 
      icon: IoCalendarOutline,
      title: "lecturer", 
      items: [
        { icon: MdOutlineEventAvailable, title: "attendance", to: "/admin/lecturer/attendance" },
        { icon: BsSend, title: "leaveReq", to: "/admin/leacturer/leave-req" },
        { icon: MdOutlineTimer, title: "extraTimeReq", to: "/admin/leacturer/extra-time-req" },
      ] 
    },
    { 
      icon: PiStudentLight, 
      title: "student", 
      items: [
        { icon: IoLogOutOutline, title: "leaveReq", to: "/admin/student/leave-req" },
        { icon: HiOutlinePresentationChartBar, title: "attendance", to: "/admin/student/attendance" },
      ] 
    },

    { icon: HiOutlineDocumentReport, title: "Report", to: "/admin/report", items: [] },
    { icon: FaUserCog, title: "user", to: "/admin/user-management", items: [] },
    { icon: IoQrCodeOutline, title: "qrCode", to: "/admin/qrcode", items: [] },

  ],

  // ========= Lecturer Portal Menus ==========
  lecturerMenus: [
    { icon: GrDashboard, title: "dashboard", to: "/system/dashboard", items: [] },
    { icon: IoCalendarOutline, title: "classSchedule", to: "/lecturer/class-schedule", items: [] },
    { icon: MdOutlineEventAvailable, title: "myAttendance", to: "/lecturer/attendance", items: [] },
    { icon: BsSend, title: "leaveReq", to: "/lecturer/leave-req", items: [] },
    { icon: MdOutlineTimer, title: "extraTimeReq", to: "/lecturer/extra-time-req", items: [] },
    { icon: TbListDetails, title: "teachingHoursSummary", to: "/lecturer/teaching-hours-summary", items: [] },
    { 
      icon: PiStudentLight, 
      title: "student", 
      items: [
        { icon: IoLogOutOutline,  title: "leaveReq", to: "/lecturer/student/leave-req" },
        { icon: IoCalendarOutline ,title: "attendance", to: "/lecturer/student/attendance" },
      ] 
    },
  ],

  // ========= Student Portal Menus ==========
  studentMenus: [
    { icon: GrDashboard, title: "dashboard", to: "/system/dashboard", items: [] },
    { icon: IoCalendarOutline, title: "classSchedule", to: "/student/class-schedule", items: [] },
    { icon: HiOutlinePresentationChartBar, title: "attenBySub", to: "/student/attendance", items: [] },
    { icon: BsSend, title: "leaveReq", to: "/student/leave-req", items: [] },
  ],
 
};

// ========= Admin Portal Protected Routes ==========
export const getRoleMenus = (role: string) => {
  switch (role?.toLowerCase()) {
    case "admin":
      return roleMenus.adminMenus;
    case "lecturer":
      return roleMenus.lecturerMenus;
    default:
      return roleMenus.studentMenus;
  }
};
