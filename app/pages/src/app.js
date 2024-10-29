import "./app.scss";

import AppInfo from "./appInfo";
import { getClubFilterTerms } from "./fetchApi";
import GenderList from "./genderList";
import Component from "./loveVanilla/component";
import { setData } from "./loveVanilla/data";
import StateList from "./stateList";
import TeamList from "./teamList";
import YearList from "./yearList";

class App extends Component {
  constructor() {
    super("body");

    // this.createChild(new LoadingBackdrop("#loading-backdrop"));
    // this.createChild(new RequestCode("#request-code"));
    // this.createChild(new CheckCode("#check-code"));

    this.createChild(new StateList("#state-list"));
    this.createChild(new YearList("#year-list"));
    this.createChild(new GenderList("#gender-list"));
    this.createChild(new AppInfo("#app-info"));

    this.teamList = new TeamList("#team-list");
    this.createChild(this.teamList);
  }

  async init() {
    super.init();

    const filterTerms = await getClubFilterTerms();

    setData({
      filterTerms,
    });

    await this.teamList.search("nebraska", "boys", 2007);

    // this.loadingBackdrop.show();
    // this.requestCode.show();
    // this.checkCode.hide();
  }

  async getCurrentState() {
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

        // Use Nominatim API to reverse geocode the coordinates
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
        );
        const data = await response.json();
        // Extract the state from the response
        const state = data.address?.["state"];
        console.log(`You are currently in: ${state}`);

        setData({
          currentState: state,
        });
      },
      (error) => {
        console.error("Error getting location: ", error.message);
      }
    );
  }
}

// document.onreadystatechange = function () {
//   if (document.readyState === "complete") {
//     if (document.querySelectorAll("head script").length === 0) {
//       window.dispatchEvent(new Event("DOMContentLoaded"));
//     }
//   }
// };

document.addEventListener("DOMContentLoaded", async () => {
  console.log("INITIALIZING APP");
  const app = new App();
  app.init();

  console.log("GETTING LOCATION");
  await app.getCurrentState();

  setTimeout(() => {
    document.body.classList.add("show-up");
  }, 100);

  setTimeout(() => {
    document.body.classList.add("fade-in");
  }, 520);
});
