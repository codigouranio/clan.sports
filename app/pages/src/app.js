import "./app.scss";

import { getAppInfo, getCurrentState } from "./fetchApi";
import { BaseApp, UrlMatcher } from "./loveVanilla";
import PageClub from "./pageClub";
import PageHome from "./pageHome";
import TeamClub from "./pageTeam";

class App extends BaseApp {
  constructor() {
    super("body");
  }

  async init() {
    super.init();

    console.log("GETTING LOCATION");
    await this.getCurrentState();
  }
}

console.log("INITIALIZING APP");
const app = new App();

app.addPage(new TeamClub(app, new UrlMatcher("/", "?team_name=*", "")));
app.addPage(new PageClub(app, new UrlMatcher("/", "?club_name=*", "")));
app.addPage(new PageHome(app, new UrlMatcher("/", "", "")));

await getAppInfo();
await getCurrentState();

app.start();
