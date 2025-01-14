import AppInfo from "./appInfo";
import { getClubInfo } from "./fetchApi";
import LoginMenu from "./loginMenu";
import {
  Component,
  createDiv,
  createHeader,
  createImg,
  createList,
  createRow,
  createSpan,
  createTable,
  getData,
  getUrlParams,
  Link,
  Page,
} from "./loveVanilla";

export default class PageTeam extends Page {
  constructor(app, urlMatcher) {
    super(app, urlMatcher);

    this.createChild(new AppInfo("#app-info"));
    this.createChild(new TeamInfo("#w-board"));
    this.createChild(new LoginMenu("#login-menu"));
  }

  requireQueryData() {
    const { club } = getData();
    return (
      !club ||
      (getUrlParams().has("club_name") &&
        club?.club_name !== getUrlParams("club_name"))
    );
  }

  async beforeRender() {
    super.beforeRender();
    console.log(this.requireQueryData());
  }

  render() {
    super.render();
    return null;
  }

  async afterRender() {
    if (this.requireQueryData()) {
      await getClubInfo(getUrlParams("club_name"));
    }
  }
}

export class TeamInfo extends Component {
  render() {
    const { club } = getData();

    if (!club) {
      return;
    }

    const team_name = getUrlParams("team_name");
    const team = club?.teams.find((team) => team.team_name === team_name);

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
                      title: club.club_name,
                      src: `/api/getClubLogo/${club.image_file}`,
                      alt: club.club_name,
                    })
                  )
                )
                .add(
                  createDiv({ className: "artifact-key" })
                    .add(
                      createDiv({
                        type: "p",
                        className: "artifact-name",
                        text: `${team.team_name}`,
                      })
                    )
                    .add(
                      createDiv({
                        type: "small",
                        className: "artifact-sub-name",
                        text: `(${team.gender})`,
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
            text: `Last updated: ${club.last_update}`,
          })
        )
    );

    // coaches
    if (team?.coaches && Object.keys(team?.coaches).length > 0) {
      root.add(
        createDiv({ type: "article", className: "coaches" })
          .add(createDiv({ type: "h5", text: "Coaches" }))
          .add(
            createList({ type: "ul", className: "coaches" }).addItems(
              Object.entries(team.coaches).map((coach, i) => {
                const coachParams = new URLSearchParams({
                  coach_name: `${coach[1].full_name}`,
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
                      text: `${coach[1].full_name}`,
                      className: "coach-page",
                    })
                  );
              })
            )
          )
      );
    }

    if (team?.players && Object.keys(team?.players).length > 0) {
      root.add(
        createDiv({ type: "article", className: "players" })
          .add(
            createDiv({
              type: "h5",
              text: `Players (${Object.keys(team?.players).length})`,
            })
          )
          .add(new PlayersTable("players-table"))
      );
    }

    return this.renderChild(root);
  }
}

export class PlayersTable extends Component {
  render() {
    const { club } = getData();

    if (!club) {
      return;
    }

    const team_name = getUrlParams("team_name");
    const team = club?.teams.find((team) => team.team_name === team_name);

    const table = createTable({ className: "players-table" })
      .add(createHeader({ headers: ["#Num", "Name", "Goals"] }))
      .addBody(
        Object.entries(team.players).map((player, i) => {
          const searchParams = new URLSearchParams({
            q: `${player[1].last_name} ${player[1].first_name} ${club.club_name} ${player[1].year} soccer`,
          });
          const playerParams = new URLSearchParams({
            player_name: `${player[1].last_name}_${player[1].first_name}_${player[1].year}`,
          });
          return createRow()
            .addCell(player[1].shirt)
            .addCell(
              createSpan()
                .add(
                  new Link(`player-search-${i}`, {
                    href: `https://www.google.com/search?${searchParams
                      .toString()
                      .toLowerCase()}`,
                    text: "🔍",
                    className: "player-search-google",
                  })
                )
                .add(
                  new Link(`player-link-${i}`, {
                    href: `?${playerParams.toString().toLowerCase()}`,
                    text: `${player[1].last_name}, ${player[1].first_name}`,
                    className: "player-page",
                  })
                ),
              "table-col-player-name"
            )
            .addCell(player[1].total_goals);
        })
      );
    return table;
  }
}
