import axios from "axios";
import { getData, setData } from "./loveVanilla/data";
import moment from "moment";

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
  pageSize = 10,
  addResults = false
) {
  try {
    const { currentState, searchResults } = getData();

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

    if (response.status !== 200) {
      return;
    }

    const newResults = {
      ...response.data,
      ...{
        items: addResults
          ? searchResults?.items.concat(response.data.items)
          : response.data.items,
      },
    };

    setData({
      searchResults: newResults,
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

export async function requestCode(
  email,
  phoneNumber,
  latitude = 0,
  longitude = 0
) {
  try {
    const response = await api.post(`requestCode`, {
      Email: email,
      PhoneNumber: phoneNumber,
    });

    return response.data;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}

export async function verifyCode(
  email,
  phoneNumber,
  code,
  challengeName,
  session
) {
  try {
    const response = await api.post(`verifyCode`, {
      Email: email,
      PhoneNumber: phoneNumber,
      Code: code,
      ChallengeName: challengeName,
      Session: session,
    });

    return response.data;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}

export async function verifySession() {
  try {
    const session = getData()?.session;
    if (!session || !session.user || !session.user.Username) {
      setData({
        session: {
          ...session,
          valid: false,
          lastRequest: moment().format(),
        },
      });
      return session;
    }

    const response = await api.post(`getUser`, {
      AccessToken: session.authentication.AccessToken,
    });
    setData({
      session: {
        ...session,
        ...{
          user: response.data?.["User"],
          lastRequest: moment().format(),
          valid: true,
        },
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error:", error.message);
    setData({
      session: {
        lastRequest: moment().format(),
        valid: false,
      },
    });
    throw error;
  }
}
