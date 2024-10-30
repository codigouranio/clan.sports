import axios from "axios";

// Setting up an Axios instance with default config
const api = axios.create({
  baseURL: "/api",
  timeout: 30000,
  headers: { Authorization: "Bearer unknown" },
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

export async function getAppInfo() {
  try {
    const response = await api.get(`getAppInfo`);
    return response.data;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}

export async function searchClubsBySearchTerm(searchTerm) {
  try {
    const response = await api.get(
      `searchClubsBySearchTerm?query=${encodeURIComponent(searchTerm)}`
    );
    return response.data;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}
