import AppInfo from "./appInfo";
import { Page, getData, Buttons } from "./loveVanilla";

export default class PageClub extends Page {
  constructor(app, urlMatcher) {
    super(app, urlMatcher);

    this.$object = document.querySelector("#w-board");
    this.createChild(new AppInfo("#app-info"));
  }

  async init() {
    super.init();

    const { team } = getData();
    if (
      this.getUrlParams().has("team_name") &&
      team?.name !== this.getUrlParams("team_name")
    ) {
      // await getClubInfo(this.getUrlParams("team_name") || "");
    }
  }

  render() {
    super.render();

    this.$object.innerHTML = "pepe";

    const button = new Buttons.ButtonFav();
    button.init();

    // this.$object.appendChild(button.getObject());
  }
}
