import { Course, Faculty, Field, Lecturer, LecturerCourse, Program } from "../types/interface";

export const validateFieldData = (data: Field) => {
    const { faculty, fieldCode, fieldNameKh, fieldNameEn, status } = data;
    const errors: { [key: string]: string } = {};
    if (!faculty || typeof faculty !== 'number') {
        errors.faculty = 'Faculty is required and must be a number';
    }
    if (!fieldCode || typeof fieldCode !== 'string') {
        errors.fieldCode = 'Field code is required and must be a string';
    }
    if (!fieldNameKh || typeof fieldNameKh !== 'string') {
        errors.fieldNameKh = 'Field name in Khmer is required and must be a string';
    }
    if (!fieldNameEn || typeof fieldNameEn !== 'string') {
        errors.fieldNameEn = 'Field name in English is required and must be a string';
    }
    if (status && !['Active', 'Inactive'].includes(status)) {
        errors.status = 'Status must be either "Active" or "Inactive"';
    }
    if (Object.keys(errors).length > 0) {
        throw new Error(JSON.stringify(errors));
    }
}
export const validateFacultyData = (data: Faculty) => {
    const { facultyCode, facultyNameKh, facultyNameEn, status } = data;
    const errors: { [key: string]: string } = {};

    if (!facultyCode || typeof facultyCode !== 'string') {
        errors.facultyCode = 'Faculty code is required and must be a string';
    }
    if (!facultyNameKh || typeof facultyNameKh !== 'string') {
        errors.facultyNameKh = 'Faculty name in Khmer is required and must be a string';
    }
    if (!facultyNameEn || typeof facultyNameEn !== 'string') {
        errors.facultyNameEn = 'Faculty name in English is required and must be a string';
    }
    if (status && !['Active', 'Inactive'].includes(status)) {
        errors.status = 'Status must be either "Active" or "Inactive"';
    }
    if (Object.keys(errors).length > 0) {
        throw new Error(JSON.stringify(errors));
    }
}
export const validateCourseData = (data: Course) => {
    const {  courseCode, courseNameKh, courseNameEn, status } = data;
    const errors: { [key: string]: string } = {};
    
    if (!courseCode || typeof courseCode !== 'string') {
        errors.courseCode = 'Course code is required and must be a string';
    }
    if (!courseNameKh || typeof courseNameKh !== 'string') {
        errors.courseNameKh = 'Course name in Khmer is required and must be a string';
    }
    if (!courseNameEn || typeof courseNameEn !== 'string') {
        errors.courseNameEn = 'Course name in English is required and must be a string';
    }
    if (status && !['Active', 'Inactive'].includes(status)) {
        errors.status = 'Status must be either "Active" or "Inactive"';
    }
    if (Object.keys(errors).length > 0) {
        throw new Error(JSON.stringify(errors));
    }
}
export const validateProgramData = (data: Program) => {
    const { faculty, field, course, promotionNo, termNo, credits, status } = data;
    const errors: { [key: string]: string } = {};
    if (!faculty || typeof faculty !== 'number') {
        errors.faculty = 'Faculty is required and must be a number';
    }
    if (!field || typeof field !== 'number') {
        errors.field = 'Field is required and must be a number';
    }
    if (!course || typeof course !== 'number') {
        errors.course = 'Curse is required and must be a number';
    }
    if (!termNo || typeof termNo !== 'number') {
        errors.termNo = 'Term number is required and must be a number';
    }
    if (!credits || typeof credits !== 'number') {
        errors.credits = 'Credits are required and must be a number';
    }
    if (status && !['Active', 'Inactive'].includes(status)) {
        errors.status = 'Status must be either "Active" or "Inactive"';
    }
   
    if (Object.keys(errors).length > 0) {
        throw new Error(JSON.stringify(errors));
    }
}
export const validateLecturerData = (data: Lecturer) => {
    const { lecturerCode, lecturerNameKh, lecturerNameEn, dob, gender, phone, email, password, status } = data;
    const errors: { [key: string]: string } = {};
    if (!lecturerCode || typeof lecturerCode !== 'string') {
        errors.lecturerCode = 'Lecturer code is required and must be a string';
    }
    if (!lecturerNameKh || typeof lecturerNameKh !== 'string') {
        errors.lecturerNameKh = 'Lecturer name in Khmer is required and must be a string';
    }
    if (!lecturerNameEn || typeof lecturerNameEn !== 'string') {
        errors.lecturerNameEn = 'Lecturer name in English is required and must be a string';
    }
    if (!gender || (typeof gender !== 'string' || !['Male', 'Female'].includes(gender))) {
        errors.gender = 'Gender is required and must be either "Male" or "Female"';
    }
    if (!phone || typeof phone !== 'string') {
        errors.phone = 'Phone number is required and must be a string';
    }
    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = 'Email is required and must be a valid email address';
    }
    if (!password || typeof password !== 'string' || password.length < 6) {
        errors.password = 'Password is required and must be at least 6 characters long';
    }
    if (status && !['Active', 'Inactive'].includes(status)) {
        errors.status = 'Status must be either "Active" or "Inactive"';
    }
    if (Object.keys(errors).length > 0) {
        throw new Error(JSON.stringify(errors));
    }
}
export const validateLecturerCourseData = (data: LecturerCourse) => {
    const { lecturer, course } = data;
    const errors: { [key: string]: string } = {};
    if (!lecturer || typeof lecturer !== 'number') {
        errors.lecturer = 'Lecturer is required and must be a number';
    }
    if (!course || typeof course !== 'number') {
        errors.course = 'Course is required and must be a number';
    }
    if (Object.keys(errors).length > 0) {
        throw new Error(JSON.stringify(errors));
    }
}