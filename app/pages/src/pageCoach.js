import moment from "moment";
import AppInfo from "./appInfo";
import LoginMenu from "./loginMenu";
import { Page, createDiv, getUrlParams } from "./loveVanilla";

export default class PageCoach extends Page {
  constructor(app, url) {
    super(app, url);

    this.createChild(new AppInfo("#app-info"));
    this.createChild(new LoginMenu("#login-menu"));
  }

  async render() {
    super.render();

    const params = getUrlParams("coach_name");

    return createDiv({
      id: "artifact-container",
      className: "artifact-container",
    }).add(
      createDiv({
        className: "artifact-header-wrapper",
        type: "article",
      })
        .add(
          createDiv({ className: "artifact-header" })
            .add(
              createDiv({ className: "artifact-info" }).add(
                createDiv({ className: "artifact-key" })
                  .add(
                    createDiv({ className: "artifact-name" }).add(
                      "span",
                      params[1].concat(" ", params),
                      "player-name"
                    )
                  )
                  .add(
                    createDiv({ className: "artifact-sub-name" })
                      // .add("span", "#12", "player-number")
                      .add("span", "Year " + params, "player-year")
                  )
                  .add("small", "Coach", "artifact-type")
              )
            )
            .add(
              createDiv({ className: "artifact-menu" })
                .add(
                  createDiv({
                    className: "follow-button",
                    type: "button",
                    text: "Claim",
                  })
                )
                .add(
                  createDiv({
                    className: "follow-button",
                    type: "button",
                    text: "Follow",
                  })
                )
                .add(createDiv({ className: "follower-count", text: "0" }))
            )
        )
        .add(
          createDiv({
            type: "footer",
            text: `Last updated: ${moment().format("MMMM Do YYYY")}`,
          })
        )
    );
  }
}
