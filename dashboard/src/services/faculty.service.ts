/* eslint-disable @typescript-eslint/no-explicit-any */
import ApiAxios from "@/axios/ApiAxios";

interface Faculty {
    id?: number | null;
    code?: string;
    name_en?: string;
    name_kh?: string;
    status?: string;
}

class FacultyService {
    async search(keyword: string, page: number = 1, limit: number = 10): Promise<any> {
        const response = await ApiAxios.get(`/faculty/search`, {
            params: { keyword, page, limit},
        });
        return response.data;
    }
    async getAll({ page, limit }: { page?: number; limit?: number }): Promise<any> {
        const response = await ApiAxios.get(`/faculty/list`, {
            params: {
                page: page || 1,
                limit: limit || 10,
            },
        });
        return response.data;
    }
    async getById(id: number | null): Promise<any> {
        const response = await ApiAxios.get(`/faculty/${id}`);
        return response.data;
    }

    async create(data: any): Promise<Faculty> {
        const response = await ApiAxios.post(`/faculty`, data);
        return response.data;
    }
    async update(id: number | null | undefined, data: any): Promise<any> {
        const response = await ApiAxios.put(`/faculty/${id}`, data);
        return response.data;
    }

    async delete(id: number) {
        await ApiAxios.delete(`/faculty/${id}`);
    }
}

export default new FacultyService();
