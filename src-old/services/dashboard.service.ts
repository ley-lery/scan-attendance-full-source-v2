import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL as string;
class DashboardService {
  async getRoomRows() {
    const response = await axios.get(`${API_URL}/dashboard`);
    return response.data;
  }
}

export default new DashboardService();
