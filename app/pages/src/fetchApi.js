import axios from "axios";
import { getData, setData } from "./loveVanilla/data";

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
    setData({
      appInfo: response?.data,
    });
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}

export async function searchClubsBySearchTerm(
  searchTerm = "",
  page = 0,
  pageSize = 15
) {
  try {
    const { currentState } = getData();

    let searchTermParam = searchTerm;

    if (!searchTerm || searchTerm.length == 0) {
      searchTermParam = currentState || "";
    }

    const urlPageParams = new URLSearchParams({
      query: searchTermParam,
    });

    history.replaceState(null, "", `/?${urlPageParams.toString()}`);

    const urlRequestParams = new URLSearchParams({
      query: searchTermParam,
      page: page,
      page_size: pageSize,
    });

    const urlWithParams = `searchClubsBySearchTerm?${urlRequestParams.toString()}`;
    const response = await api.get(urlWithParams);

    setData({
      searchResults: response.data,
    });
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}

export async function getClubInfo(clubName) {
  try {
    const params = new URLSearchParams({
      club_name: clubName,
    });

    const response = await api.get(`getClubInfo/?${params.toString()}`);

    setData({
      club: response.data,
    });
    return response.data;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}

export async function getCurrentState() {
  // Check if geolocation is available
  if (!navigator.geolocation) {
    console.log("Geolocation is not supported by this browser.");
    return;
  }

  // Get the current position
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
      );
      const data = await response.json();
      // Extract the state from the response
      console.log(`You are currently in: ${data.address?.["state"]}`);

      setData({
        currentState: data.address?.["state"].toLowerCase().replace(" ", "-"),
        currentStateName: data.address?.["state"],
      });
    },
    (error) => {
      console.error("Error getting location: ", error.message);
    }
  );
}
