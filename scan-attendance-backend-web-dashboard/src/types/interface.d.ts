import { DateValue } from "@internationalized/date";

export {};

declare global {
  interface SignUpData {
    username: string;
    email: string;
    password: string;
    isActive: boolean;
    assignType: string;
    assignTo: number;
  }
  interface Student {
    id?: number | null;
    studentCode?: string;
    studentNameEn?: string;
    studentNameKh?: string;
    dob?: DateValue | null ;
    gender?: "Male" | "Female";
    email?: string;
    phone?: string;
    password?: string;
    status?: "Active" | "Inactive";
  }
  interface StudentList {
    id?: number | null;
    code?: string;
    name_en?: string;
    name_kh?: string;
    dob?: DateValue | null | string;
    gender?: "Male" | "Female";
    email?: string;
    phone?: string;
    deleted_date?: DateValue | null | string;
    status?: "Active" | "Inactive";
  }
  interface ClassStudent {
    id?: number | null;
    classId?: number | null | string;
    studentId?: number | null | string;
    status?: "Active" | "Inactive";
  }
  interface ClassStudentList {
    id?: number | null;
    class_name?: string;
    room_name?: string;
    student_code?: string;
    student_name_en?: string;
    student_name_kh?: string;
  }
  interface Qr {
    id?: number | null;
    image?: string;
    url?: string;
  }
  interface FacultyList {
    id?: number | null;
    code?: string;
    name_en?: string;
    name_kh?: string;
    status?: string;
  }
  interface Faculty {
    id?: number | null;
    facultyCode: string;
    facultyNameEn: string;
    facultyNameKh: string;
    status: string;
  }
  interface FieldList {
    id: number | null;
    faculty_name_kh?: number;
    faculty_name_en: string;
    field_code: string;
    field_name_en: string;
    field_name_kh: string;
    status: string;
  }
  interface Field {
    id?: number | null;
    faculty?:  null | string;
    fieldCode: string;
    fieldNameEn: string;
    fieldNameKh: string;
    status: string;
  }
  interface CourseList {
    id?: number | null;
    code?: string;
    course_name_en?: string;
    course_name_kh?: string;
    status?: string;
  }
  interface Course {
    id?: number | null;
    courseCode?: string;
    courseNameEn?: string;
    courseNameKh?: string;
    status?: string;
  }
  interface ProgramList {
    id?: number | null;
    faculty_id?: number | null;
    faculty_name_en?: string;
    program_name_kh?: string;
    field_id?: number | null;
    field_name_kh?: string;
    field_name_en?: string;
    promotion_no?: number;
    term_no?: number;
    course_id?: number | null;
    course_name_en?: string;
    course_name_kh?: string;
    credits?: number;
    status?: string;
  }
  interface Program {
    id?: number | null;
    type?: "Bachelor" | "Associate" | string;
    faculty?:  null | string | number;
    field?: null | string | number;
    course?: null | string | number;
    promotionNo: number;
    termNo: number;
    credits: number;
    status?: "Active" | "Inactive" | string;
  }
  interface Lecturer {
    id?: number | null;
    lecturerCode?: string;
    lecturerNameEn?: string;
    lecturerNameKh?: string;
    dob?: DateValue | null ;
    gender?: "Male" | "Female";
    email?: string;
    phone?: string;
    deletedDate?: DateValue | null ;
    status?: "Active" | "Inactive";
  }
  interface LecturerCourse {
    id?: number | null;
    lecturer?: number | null | string;
    course?: number | null | string;
  }
  interface LecturerCourseList {
    id?: number | null;
    lecturer_code?: string;
    lecturer_name_en?: string;
    lecturer_name_kh?: string;
    course_code?: string;
    course_name_en?: string;
    course_name_kh?: string;
  }
  interface Class {
    id?: number | null;
    programType?: "Bachelor" | "Associate";
    className?: string;
    roomName?: string;
    faculty?: number | null | string;
    field?: number | null | string;
    promotionNo?: number;
    termNo?: number;
    status?: "Active" | "Inactive";
  }
  interface ClassList {
    id?: number | null;
    program_tyepe?: "Bachelor" | "Associate";
    class_name?: string;
    romm_name?: string;
    faculty_name_en?: string;
    faculty_name_kh?: string;
    field_name_en?: string;
    field_name_kh?: string;
    promotion_no?: number;
    term_no?: number;
    deleted_date?: DateValue | null | string;
    status?: string;
  }
  interface ClassSchedule {
    id?: number | null;
    class?: number | null | string;
    course?: number | null | string;
    lecturer?: number | null | string;
    startDate?: DateValue | null;
    endDate?: DateValue | null;
    credits?: number;
  }
  interface ClassAttendance {
    id?: number | null;
    class?: number | null | string;
    course?: number | null | string;
    student?: number | null | string;
  }
  interface StudentLeave {
    id?: number | null;
    student?: number | null | string;
    requestDate?: DateValue | null;
    startDate?: DateValue | null;
    endDate?: DateValue | null;
    reason?: string;
    approvedByUser?: number | null;
    approvedByLecturer?: number | null;
    approvedDate?: DateValue | null;
    adminNotes?: string;
    status?: "Pending" | "Approved" | "Rejected" | "Cancelled";
  }
  interface StudentLeaveList {
    id?: number | null;
    student_name?: string;
    request_date?: DateValue | null | string;
    start_date?: DateValue | null | string;
    end_date?: DateValue | null | string;
    reason?: string;
    approved_by_user?: string;
    approved_by_lecturer?: string;
    approved_date?: DateValue | null | string;
    admin_notes?: string;
    deleted_date?: DateValue | null | string;
    status?: "Pending" | "Approved" | "Rejected" | "Cancelled";
  }
  interface LecturerLeave {
    id?: number | null;
    student?: number | null;
    requestDate?: DateValue | null;
    startDate?: DateValue | null;
    endDate?: DateValue | null;
    reason?: string;
    approvedByUser?: number | null;
    approvedByLecturer?: number | null;
    approvedDate?: DateValue | null;
    adminNotes?: string;
    status?: "Pending" | "Approved" | "Rejected" | "Cancelled";
  }
  interface LecturerLeaveList {
    id?: number | null;
    student_name?: string;
    request_date?: DateValue | null | string;
    start_date?: DateValue | null | string;
    end_date?: DateValue | null | string;
    reason?: string;
    approved_by_user?: string;
    approved_by_lecturer?: string;
    approved_date?: DateValue | null | string;
    admin_notes?: string;
    deleted_date?: DateValue | null | string;
    status?: "Pending" | "Approved" | "Rejected" | "Cancelled";
  }
  interface Lecturer {
      id?: number;
      lecturerCode?: string;
      lecturerNameKh?: string;
      lecturerNameEn?: string;
      dob?: DateValue | null | string;
      gender?: "Male" | "Female";
      phone?: string;
      email?: string;
      password?: string;
      status?: 'Active' | 'Inactive';
  }
  interface LecturerCourse{
      lecturer?: number;
      course?: number;
  }
  
  interface Cards {
    title: string;
    number: number;
    subtitle?: string;
    icon?: React.ReactNode;
    color?: string;
  }
  interface Role {
    id?: number | null,
    name?: string,
    description?: string
  }
  interface Permission {
    id?: number | null,
    name?: string,
    description?: string
  }
  interface RolePermission{
    id?: number | null,
    role?: number | null,
    permission?: number | null,
  }
  interface UserPermission{
    id?: number | null,
    user?: number | null | string,
    permission?: number | null | string,
  }
  interface UserRole{
    id?: number | null,
    user?: number | null | string,
    role?: number | null | string,
  }
  
  type ModalAnimation = "fade" | "fade-up" | "fade-down" | "scale" | "spring-scale" | "spring-up" | "spring-down" | "spring-left" | "spring-right" | "slide-up" | "slide-down" | "slide-left" | "slide-right";
  type ModalSize = "auto" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full";
  type ModalRadius = "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  type ModalPosition = "top" | "bottom" | "center" | "left" | "right" | "top-right" | "top-left" | "bottom-right" | "bottom-left";
  type ModalBackdrop = "regular" | "transparent" | "blur";
  type ModalShadow = "none" | "sm" | "md" | "lg";
  
  interface Course {
    name: string;
    credits: number;
    room: string;
    instructor: string;
    phone: string;
  }

  interface ScheduleData {
    [key: string]: {
      [key: string]: Course | null;
    };
  }
  
  interface ClassInfo {
    program_type: string;
    promotion_no: number;
    term_no: number;
    group: string;
    room_name: string;
    study_year: number;
    code: string;
    start_date: string;
    end_date: string;
    faculty_name_en: string;
    field_name_en: string;
    faculty_name_kh: string;
    field_name_kh: string;
    stage: string;
    mid_term_start_date: string;
    mid_term_end_date: string;
    final_exam_date: string;
    new_term_start_date: string;
    num_student: number;
    term_relative: number
  }

  interface ScheduleItem {
    id: number;
    day: string;
    tel: string;
    room: string;
    credit: number;
    subject: string;
    timeSlot: string;
    instructor: string;
  }
  
  interface ClassData {
    class_id: number;
    program_type: string;
    promotion_no: number;
    term_no: number;
    group: string;
    room_name: string;
    study_year: number;
    code: string;
    start_date: string;
    end_date: string;
    faculty_name_en: string;
    field_name_en: string;
    schedule_items: ScheduleItem[];
  }
  
  interface ApiResponse {
    success: boolean;
    message: string;
    data: {
      rows: ClassData[];
    };
  }
  
}
