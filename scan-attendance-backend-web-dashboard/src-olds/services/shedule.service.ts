/* eslint-disable @typescript-eslint/no-explicit-any */
import ApiAxios from "@/axios/ApiAxios";
interface Params {
  lecturerId: number | string;
  status?: number | string;
}

class SheduleService {
  async getAll({ lecturerId, status }: Params): Promise<any> {
    const response = await ApiAxios.get(
      `/SchTeacherListClassSchedule/:branch/${lecturerId}/${status}`,
    );
    return response.data;
  }
}

export default new SheduleService();
