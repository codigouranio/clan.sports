import axios from "axios";

// Setting up an Axios instance with default config
const api = axios.create({
  baseURL: "/api",
  timeout: 1000,
  headers: { Authorization: "Bearer YOUR_TOKEN" },
});

export async function getClubFilterTerms() {
  try {
    const response = await api.get(`getClubFilterTerms`);
    return response.data;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}
