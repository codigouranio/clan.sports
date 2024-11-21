import { Page } from "./loveVanilla";
import AppInfo from "./appInfo";

export default class PagePlayer extends Page {
  constructor(app, urlMatcher) {
    super(app, urlMatcher);

    this.createChild(new AppInfo("#app-info"));
  }

  render() {
    super.render();

    console.log("><><><><");
    return "player";
  }
}
