interface QueryParams{
    keyword?: string;
    page?: number;
    limit?: number;
}
type Faculty = {
    facultyCode?: string;
    facultyNameKh?: string;
    facultyNameEn?: string;
    changedByUser?: string;
    clientIp?: string;
    sessionInfo?: string;
    status?: 'Active' | 'Inactive';
}
interface Field {
    faculty?: number,
    fieldCode?: string;
    fieldNameKh?: string;
    fieldNameEn?: string;
    changedByUser?: string;
    clientIp?: string;
    sessionInfo?: string;
    status?: 'Active' | 'Inactive';
}
export interface Course{
    courseCode?: string;
    courseNameKh?: string;
    courseNameEn?: string;
    changedByUser?: string;
    clientIp?: string;
    sessionInfo?: string;
    status?: 'Active' | 'Inactive';
}

export interface Program{
    id?: number;
    type?: 'Bachelor' | 'Associate';
    faculty?: number;
    field?: number;
    promotionNo?: number;
    termNo?: number;
    course?: number;
    credits?: number;
    changedByUser?: string;
    clientIp?: string;
    sessionInfo?: string;
    status?: 'Active' | 'Inactive';
}

// lecturer managament 
interface Lecturer {
    id?: number;
    lecturerCode?: string;
    lecturerNameKh?: string;
    lecturerNameEn?: string;
    dob?: Date;
    gender?: "Male" | "Female";
    phone?: string;
    email?: string;
    password?: string;
    changedByUser?: string;
    clientIp?: string;
    sessionInfo?: string;
    status?: 'Active' | 'Inactive';
}
interface LecturerCourse{
    lecturer?: number;
    course?: number;
    changedByUser?: string;
    clientIp?: string;
    sessionInfo?: string;
}

// === Authentication ===
export interface User {
    id?: number;
    username?: string;
    email: string;
    password: string;
    isActive?: boolean | true;
    assignType?: 'Faculty' | 'Student';
    assignTo?: number;
}
export interface SearchParams{
    keyword?: string;
    page?: number;
    limit?: number;
} 
export interface Student{
    studentCode?: string;
    studentNameKh?: string;
    studentNameEn?: string;
    dob?: Date;
    gender?: 'Male' | 'Female';
    email?: string;
    phoneNumber?: string;
    password?: string;
    changedByUser?: string;
    clientIp?: string;
    sessionInfo?: string;
    status?: 'Active' | 'Inactive';
}

export interface StudentClass{
    classId?: number;
    studentId?: number;
    status?: 'Active' | 'Inactive' | 'Complete';
    changedByUser?: string;
    clientIp?: string;
    sessionInfo?: string;
}

export interface Class{
    programType?: 'Bachelor' | 'Associate';
    faculty?: number;
    field?: number;
    promotionNo?: string;
    termNo?: string;
    className?: string;
    roomName?: string;
    changedByUser?: string;
    clientIp?: string;
    sessionInfo?: string;
    status?: 'Active' | 'Inactive';
}

export interface AuditLogFilter {
    action: "INSERT" | "UPDATE" | "DELETE";
    tableName: string;
    user: number;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    clientIp: string;
    page?: number;
    limit?: number;
}

export interface UserSignUp {
    username: string;
    email: string;
    password: string;
    isActive?: boolean;
    assignType?: string;
    assignTo?: number;
}

export interface AuditLog{
    changedByUser?: string;
    clientIp?: string;
    sessionInfo?: string;
}

export interface ApproveLeave {
    leaveId?: number;
    approveByUser?: number;
    adminNote?: string
}
export interface StudentLeveFilter {
    faculty?: number | null,
    field?: number | null,
    classId?: number | null,
    student?: number | null,
    status?: string | "",
    startDate?: Date | null,
    endDate?: Date | null,
    search?: string | null,
    page?: number | null,
    limit?: number | null
}
export interface BatchLeave {
    leaveIds?: number[];
    action?: 'Approved' | 'Rejected';
    approveByUser?: number;
    adminNote?: string
}


// === Role Management ===
export interface Role{
    name?: string;
    description?: string;
    changedByUser?: string;
    clientIp?: string;
    sessionInfo?: string;
}
export interface Permission{
    name?: string;
    description?: string;
    changedByUser?: string;
    clientIp?: string;
    sessionInfo?: string;
}
export interface UserRole{
    user?: number;
    role?: number;
}
export interface UserPermission{
    user?: number;
    permission?: number;
}
export interface RolePermission{
    role?: number;
    permission?: number;
}

// === Student Portal ===
export interface StudentLeaveRequest{
    studentId?: number;
    requestDate?: Date;
    startDate?: Date;
    endDate?: Date;
    reason?: string;
    status?: 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
}
