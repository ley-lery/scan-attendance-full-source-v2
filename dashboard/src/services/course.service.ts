/* eslint-disable @typescript-eslint/no-explicit-any */

import ApiAxios from "@/axios/BranchAxios";

const CourseService = {
  async search(
    keyword: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<any> {
    const response = await ApiAxios.get(`/course/search`, {
      params: { keyword, page, limit },
    });
    return response.data;
  },

  async getAll({
    page,
    limit,
  }: {
    page?: number;
    limit?: number;
  }): Promise<any> {
    const response = await ApiAxios.get(`/course/:branch`, {
      params: {
        page: page || 1,
        limit: limit || 10,
      },
    });
    return response.data;
  },

  async getById(id: number | null): Promise<any> {
    const response = await ApiAxios.get(`/course/:branch/${id}`);
    return response.data;
  },

  async create(data: any): Promise<Course> {
    const response = await ApiAxios.post(`/course/:branch`, data);
    return response.data;
  },

  async update(id: number | null | undefined, data: any): Promise<any> {
    const response = await ApiAxios.put(`/course/:branch/${id}`, data);
    return response.data;
  },

  async delete(id: number) {
    await ApiAxios.delete(`/course/:branch/${id}`);
  },
};

export default CourseService;
