export interface QueryParams{
    keyword?: string;
    page?: number;
    limit?: number;
}
export interface Faculty{
    facultyCode: string;
    facultyNameKh: string;
    facultyNameEn: string;
    status: 'Active' | 'Inactive';
}
export interface Field {
    faculty: number,
    fieldCode: string;
    fieldNameKh: string;
    fieldNameEn: string;
    status: 'Active' | 'Inactive';
}
export interface Course{
    courseCode: string;
    courseNameKh: string;
    courseNameEn: string;
    status: 'Active' | 'Inactive';
}

export interface Program{
    id?: number;
    faculty?: number;
    field?: number;
    promotionNo?: number;
    termNo?: number;
    course?: number;
    credits?: number;
    status: 'Active' | 'Inactive';
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
    status?: 'Active' | 'Inactive';
}
interface LecturerCourse{
    lecturer?: number;
    course?: number;
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