/* eslint-disable @typescript-eslint/no-explicit-any */
import ApiAxios from "@/axios/BBUAxiosV1"; // axios with auth

const StudentService = {
  async get(studentId: string): Promise<any> {
    const res = await ApiAxios.get(`ApiStudentResult/studentprofile/${studentId}`);
    return res.data;
  },
  async getStudentBranch(branch: string, studentId: string): Promise<any> {
    const res = await ApiAxios.get(`ApiStudentResult/studentbranch/${branch}/${studentId}`);
    return res.data;
  }
}

export default StudentService;
