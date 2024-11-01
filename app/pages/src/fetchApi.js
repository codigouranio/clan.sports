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

export async function searchClubsBySearchTerm(
  searchTerm,
  page = 0,
  pageSize = 30
) {
  try {
    const params = new URLSearchParams({
      query: searchTerm,
      page: page,
      page_size: pageSize,
    });
    console.log(params.toString());
    const urlWithParams = `searchClubsBySearchTerm?${params.toString()}`;
    const response = await api.get(urlWithParams);
    return response.data;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}
