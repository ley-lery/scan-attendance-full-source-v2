import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL as string;

class ContactService {
  async getAll() {
    const response = await axios.get(`${API_URL}/contact`);
    return response.data;
  }

  async getById(id: number | null) {
    const response = await axios.get(`${API_URL}/contact/${id}`);
    return response.data;
  }
  async delete(id: number) {
    await axios.delete(`${API_URL}/contact/${id}/delete`);
  }
}

export default new ContactService();
