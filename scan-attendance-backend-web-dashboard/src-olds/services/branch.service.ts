/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import AxiosV1 from "@/axios/BBUAxiosV1";

const API_URL = import.meta.env.VITE_API_URL as string;

class BranchService {
    async selectBranch(data: {branchCode: string}): Promise<any> {
        const response = await axios.post(`${API_URL}/auth/user/selectbranch`, data, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return response.data;
    }
    async getAll(): Promise<any> {
        const response = await AxiosV1.get(`/v1/PayrollBranch`);
        return response.data;
    }
}

export default new BranchService();
