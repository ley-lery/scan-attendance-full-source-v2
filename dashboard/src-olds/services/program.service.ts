/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL as string;


class ProgramServie {
    async search(keyword: string, page: number = 1, limit: number = 10): Promise<any> {
        const res = await axios.get(`${API_URL}/program/search`, {
            params: { keyword, page, limit},
        });
        return res.data;
    }
    async getAll({ page, limit }: { page?: number; limit?: number }): Promise<any> {
        const res = await axios.get(`${API_URL}/program/list`, {
        params: {
            page: page || 1,
            limit: limit || 10,
        },
        });
        return res.data;
    }
    async getById(id: number | null): Promise<ProgramList[]> {
        const res = await axios.get(`${API_URL}/program/${id}`);
        return res.data;
    }

    async formLoad(): Promise<any> {
        const res = await axios.get(`${API_URL}/program/formload`);
        return res.data;
    }

    async create(data: any): Promise<Program> {
        const res = await axios.post(`${API_URL}/program`, data);
        return res.data;
    }
    async update(id: number | null | undefined, data: any): Promise<any> {
        const res = await axios.put(`${API_URL}/program/${id}`, data);
        return res.data;
    }

    async delete(id: number) {
        await axios.delete(`${API_URL}/program/${id}`);
    }
}

export default new ProgramServie();
