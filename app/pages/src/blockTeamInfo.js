import { BlockPlayersTable } from "./blockPlayersTable";
import {
  Component,
  createDiv,
  createImg,
  createList,
  createSpan,
  getData,
  Link,
} from "./loveVanilla";

export class BlockTeamInfo extends Component {
  render() {
    const { current_item } = getData();

    if (!current_item) {
      return;
    }

    const root = createDiv({
      id: "team-container",
      className: "artifact-container",
    }).add(
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
                        text: `${current_item.name}`,
                      })
                    )
                    .add(
                      createDiv({
                        type: "small",
                        className: "artifact-sub-name",
                        text: `${current_item.gender} team`,
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
                    text: "Follow",
                  })
                )
                .add(createDiv({ className: "follower-count", text: "0" }))
            )
        )
        .add(
          createDiv({
            type: "footer",
            text: `Last updated: ${current_item?.last_update}`,
          })
        )
    );

    // coaches
    if (current_item?.coaches && current_item?.coaches.length > 0) {
      root.add(
        createDiv({ type: "article", className: "coaches" })
          .add(createDiv({ type: "h5", text: "Coaches" }))
          .add(
            createList({ type: "ul", className: "coaches" }).addItems(
              Object.entries(current_item?.coaches).map((coach, i) => {
                const coachParams = new URLSearchParams({
                  unique_id: `${coach[1].unique_id}`,
                });
                return createSpan()
                  .add(
                    new Link(`coach-link-${i}`, {
                      href: `https://www.google.com/search?${new URLSearchParams(
                        {
                          q: `${coach[1].full_name} soccer`,
                        }
                      ).toString()}`,
                      text: "🔍",
                      className: "coach-search-google",
                    })
                  )
                  .add(
                    new Link(`coach-link-${i}`, {
                      href: `?${coachParams.toString().toLowerCase()}`,
                      text: `${coach[1].name}`,
                      className: "coach-page",
                    })
                  );
              })
            )
          )
      );
    }

    if (current_item?.players && current_item?.players.length > 0) {
      root.add(
        createDiv({ type: "article", className: "players" })
          .add(
            createDiv({
              type: "h5",
              text: `Players (${current_item?.players.length})`,
            })
          )
          .add(new BlockPlayersTable("players-table"))
      );
    }

    return root;
  }
}
