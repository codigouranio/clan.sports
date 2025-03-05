import "./scss/app.scss";

import { getAppInfo, getCurrentState } from "./fetchApi";
import { BaseApp, UrlMatcher } from "./loveVanilla";
import PageHome from "./pageHome";
import PageItem from "./pageItem";

class App extends BaseApp {
  constructor() {
    super("#w-board");
  }

  startLoading() {}

  stopLoading() {
    document.querySelector(".love-vanilla-loading")?.classList.add("hidden");
  }
}

console.log("INITIALIZING APP");
const app = new App();

app.addPage(new PageItem(app, new UrlMatcher("/", "?unique_id=*", "")));
app.addPage(new PageHome(app, new UrlMatcher("/", "", "")));

await getAppInfo();
await getCurrentState();

app.start();
