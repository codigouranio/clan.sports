import moment from "moment";
import AppInfo from "./appInfo";
import LoginMenu from "./loginMenu";
import { Component, createDiv, getData } from "./loveVanilla";

export class BlockCoachInfo extends Component {
  constructor(app, url) {
    super(app, url);

    this.createChild(new AppInfo("#app-info"));
    this.createChild(new LoginMenu("#login-menu"));
  }

  async render() {
    super.render();

    const { current_item } = getData();

    if (!current_item) {
      return;
    }

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
                      current_item?.name,
                      "player-name"
                    )
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
