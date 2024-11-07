import "./app.scss";

import BaseApp from "./loveVanilla/baseApp";
import { setData } from "./loveVanilla/data";
import PageHome from "./pageHome";
import PageTeam from "./pageTeam";

class App extends BaseApp {
  constructor() {
    super("body");
  }

  async init() {
    super.init();

    console.log("GETTING LOCATION");
    await this.getCurrentState();

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
}

console.log("INITIALIZING APP");
const app = new App();
app.addPage(new PageHome(app, "/"));
app.addPage(new PageTeam(app, "/team"));
app.init();
