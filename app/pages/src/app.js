import "./app.scss";

import { getAppInfo, getCurrentState } from "./fetchApi";
import { BaseApp, UrlMatcher } from "./loveVanilla";
import PageClub from "./pageClub";
import PageHome from "./pageHome";
import PagePlayer from "./pagePlayer";
import PageTeam from "./pageTeam";

class App extends BaseApp {
  constructor() {
    super("body");
  }

  startLoading() {}

  stopLoading() {
    document.querySelector(".love-vanilla-loading")?.classList.add("hidden");
  }
}

console.log("INITIALIZING APP");
const app = new App();

app.addPage(new PagePlayer(app, new UrlMatcher("/", "?player_name=*", "")));
app.addPage(new PageTeam(app, new UrlMatcher("/", "?team_name=*", "")));
app.addPage(new PageClub(app, new UrlMatcher("/", "?club_name=*", "")));
app.addPage(new PageHome(app, new UrlMatcher("/", "", "")));

await getAppInfo();
await getCurrentState();

app.start();
