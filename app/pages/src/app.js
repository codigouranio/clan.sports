import "@picocss/pico";
import "./app.scss";

import Component from "./loveVanilla/component";
import StateList from "./stateList";
import YearList from "./yearList";
import GenderList from "./genderList";
import { setData } from "./loveVanilla/data";
import { getClubFilterTerms } from "./fetchApi";

class App extends Component {
  constructor() {
    super();
    // this.createChild(new LoadingBackdrop("#loading-backdrop"));
    // this.createChild(new RequestCode("#request-code"));
    // this.createChild(new CheckCode("#check-code"));
    this.createChild(new StateList("#state-list"));
    this.createChild(new YearList("#year-list"));
    this.createChild(new GenderList("#gender-list"));
  }

  async init() {
    super.init();

    const filterTerms = await getClubFilterTerms();

    setData({
      filterTerms,
    });

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

  // const page = new Page();
  // let app = undefined;
  // try {
  //
  //   app.init();
  // } catch (error) {
  //   console.error("Error initializing app: ", error);
  // }
  console.log("GETTING LOCATION");
  await app.getCurrentState();
});
