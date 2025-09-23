/* eslint-disable @typescript-eslint/no-explicit-any */
import ApiAxios from "@/axios/BBUAxiosV1";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL as string;


const LecturerService = {
    async test(): Promise<any> {
        const res = await axios.get(`/api/schedule.json`);
        return res.data;
    },
    async checkLecturerEmail(email: string): Promise<any> {
        const res = await ApiAxios.get(`/lecturer`, {
            params: { email }
        });
        return res.data;
    },
    async search(keyword: string, page: number = 1, limit: number = 10): Promise<any> {
        const res = await axios.get(`${API_URL}/lecturer/search`, {
            params: { keyword, page, limit},
        });
        return res.data;
    },
    async getAll({ page, limit }: { page?: number; limit?: number }): Promise<any> {
        const res = await axios.get(`${API_URL}/lecturer/list`, {
        params: {
            page: page || 1,
            limit: limit || 10,
        },
        });
        return res.data;
    },
    async getById(id: number | null): Promise<Lecturer[]> {
        const res = await axios.get(`${API_URL}/lecturer/${id}`);
        return res.data;
    },

    async formLoad(): Promise<any> {
        const res = await axios.get(`${API_URL}/lecturer/formload`);
        return res.data;
    },

    async create(data: any): Promise<Lecturer> {
        const res = await axios.post(`${API_URL}/lecturer`, data);
        return res.data;
    },
    async update(id: number | null | undefined, data: any): Promise<any> {
        const res = await axios.put(`${API_URL}/lecturer/${id}`, data);
        return res.data;
    },

    async delete(id: number) {
        await axios.delete(`${API_URL}/lecturer/${id}`);
    }
}

export default LecturerService;
