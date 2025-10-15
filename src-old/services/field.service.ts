/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL as string;

interface Field {
    id?: number | null;
    faculty_id?: string;
    code?: string;
    name_en?: string;
    name_kh?: string;
    status?: string;
}

class FieldService {
    async search(keyword: string, page: number = 1, limit: number = 10): Promise<any> {
        const res = await axios.get(`${API_URL}/field/search`, {
            params: { keyword, page, limit},
        });
        return res.data;
    }
    async getAll({ page, limit }: { page?: number; limit?: number }): Promise<any> {
        const res = await axios.get(`${API_URL}/field/list`, {
        params: {
            page: page || 1,
            limit: limit || 10,
        },
        });
        return res.data;
    }
    async getById(id: number | null): Promise<Field[]> {
        const res = await axios.get(`${API_URL}/field/${id}`);
        return res.data;
    }

    async formLoad(): Promise<any> {
        const res = await axios.get(`${API_URL}/field/formload`);
        return res.data;
    }

    async create(data: any): Promise<Field> {
        const res = await axios.post(`${API_URL}/field`, data);
        return res.data;
    }
    async update(id: number | null | undefined, data: any): Promise<any> {
        const res = await axios.put(`${API_URL}/field/${id}`, data);
        return res.data;
    }

    async delete(id: number) {
        await axios.delete(`${API_URL}/field/${id}`);
    }
}

export default new FieldService();
