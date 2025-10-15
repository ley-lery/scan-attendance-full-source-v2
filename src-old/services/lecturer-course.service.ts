/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL as string;


class LecturerCourseService {
    async search(keyword: string, page: number = 1, limit: number = 10): Promise<any> {
        const res = await axios.get(`${API_URL}/lecturercourse/search`, {
            params: { keyword, page, limit},
        });
        return res.data;
    }
    async getAll({ page, limit }: { page?: number; limit?: number }): Promise<any> {
        const res = await axios.get(`${API_URL}/lecturercourse/list`, {
        params: {
            page: page || 1,
            limit: limit || 10,
        },
        });
        return res.data;
    }
    async getById(id: number | null): Promise<LecturerCourse[]> {
        const res = await axios.get(`${API_URL}/lecturercourse/${id}`);
        return res.data;
    }

    async formLoad(): Promise<any> {
        const res = await axios.get(`${API_URL}/lecturercourse/formload`);
        return res.data;
    }

    async create(data: any): Promise<LecturerCourse> {
        const res = await axios.post(`${API_URL}/lecturercourse`, data);
        return res.data;
    }
    async update(id: number | null | undefined, data: any): Promise<any> {
        const res = await axios.put(`${API_URL}/lecturercourse/${id}`, data);
        return res.data;
    }

    async delete(id: number) {
        await axios.delete(`${API_URL}/lecturercourse/${id}`);
    }
}

export default new LecturerCourseService();
