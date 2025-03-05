import AppInfo from "./appInfo";
import { BlockClubInfo } from "./blockClubInfo";
import { BlockCoachInfo } from "./blockCoachInfo";
import { BlockPlayerInfo } from "./blockPlayerInfo";
import { BlockTeamInfo } from "./blockTeamInfo";
import { searchItemByUniqueId } from "./fetchApi";
import LoginMenu from "./loginMenu";
import { createDiv, getData, getUrlParams, Page } from "./loveVanilla";

class PageItem extends Page {
  unique_id = "";

  constructor(app, url) {
    super(app, url);

    this.createChild(new AppInfo("#app-info"));
    this.createChild(new LoginMenu("#login-menu"));
  }
  render() {
    super.render();

    const { current_item } = getData();

    if (!current_item) {
      return createDiv("div", { id: "player-info" });
    }

    const item_type = current_item?.item_type;

    if (item_type === "CLUB") {
      return new BlockClubInfo("#w-board").render();
    }

    if (item_type === "TEAM") {
      return new BlockTeamInfo("#w-board").render();
    }

    if (item_type === "PLAYER") {
      return new BlockPlayerInfo("#w-board").render();
    }

    if (item_type === "COACH") {
      return new BlockCoachInfo("#w-board").render();
    }

    return createDiv({ id: "item-info" });
  }

  async afterRender() {
    super.afterRender();
    const uniqueId = getUrlParams("unique_id");
    await searchItemByUniqueId(uniqueId);
  }
}

export default PageItem;
