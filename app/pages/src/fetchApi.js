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

export async function getAppInfo() {
  try {
    const response = await api.get(`getAppInfo`);
    return response.data;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}

export async function searchClubs(state, gender, year) {
  try {
    const response = await api.get(`searchClubs/${state}/${gender}/${year}`);
    return response.data;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}
