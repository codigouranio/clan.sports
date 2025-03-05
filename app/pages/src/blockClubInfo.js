import sanitizeHtml from "sanitize-html";
import { BlockTeamTable } from "./blockTeamTable";
import { Component, createDiv, createImg, getData } from "./loveVanilla";

export class BlockClubInfo extends Component {
  render() {
    const { current_item } = getData();

    if (!current_item) {
      return;
    }

    const root = createDiv({
      id: "club-container",
      className: "artifact-container",
    })
      .add(
        createDiv({
          className: "artifact-header-wrapper",
          type: "article",
        })
          .add(
            createDiv({ className: "artifact-header" })
              .add(
                createDiv({ className: "artifact-info" })
                  .add(
                    createDiv({ className: "club-logo" }).add(
                      createImg({
                        title: current_item.name,
                        src: `/api/getClubLogo/${current_item.image_file}`,
                        alt: current_item.name,
                      })
                    )
                  )
                  .add(
                    createDiv({ className: "artifact-key" })
                      .add(
                        createDiv({
                          type: "p",
                          className: "artifact-name",
                          text: `${current_item?.name}`,
                        })
                      )
                      .add(
                        createDiv({
                          type: "small",
                          className: "artifact-sub-name",
                          text: `Rank #${current_item.rank_num}`,
                        })
                      )
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
              text: `Last updated: ${current_item.last_update}`,
            })
          )
      )
      .add(
        createDiv({ type: "article", className: "club-body" }).add(
          createDiv({ type: "div", className: "club-info-content" }).setHtml(
            sanitizeHtml(current_item?.info) || "No info available"
          )
        )
      )
      .add(
        createDiv({ type: "article", className: "club-teams" })
          .add(
            createDiv({
              type: "h5",
              text: `Teams (${current_item?.teams.length || 0})`,
            })
          )
          .add(new BlockTeamTable("#team-table"))
      );

    return this.renderChild(root);
  }
}
