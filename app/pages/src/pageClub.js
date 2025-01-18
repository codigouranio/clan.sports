import sanitizeHtml from "sanitize-html";
import AppInfo from "./appInfo";
import { getClubInfo } from "./fetchApi";
import LoginMenu from "./loginMenu";
import {
  Component,
  createDiv,
  createHeader,
  createImg,
  createRow,
  createTable,
  getData,
  getUrlParams,
  Link,
  Page,
} from "./loveVanilla";

export default class PageClub extends Page {
  constructor(app, urlMatcher) {
    super(app, urlMatcher);

    this.createChild(new AppInfo("#app-info"));
    this.createChild(new ClubInfo("#w-board"));
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

  beforeRender() {
    super.beforeRender();
  }

  render() {
    super.render();
    return null;
  }

  async afterRender() {
    if (this.requireQueryData()) {
      await getClubInfo(getUrlParams("club_name") || "");
    }
  }
}

export class ClubInfo extends Component {
  render() {
    const { club } = getData();

    if (!club) {
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
                          text: `${club?.club_name}`,
                        })
                      )
                      .add(
                        createDiv({
                          type: "small",
                          className: "artifact-sub-name",
                          text: `Rank #${club.rank}`,
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
              text: `Last updated: ${club.last_update}`,
            })
          )
      )
      .add(
        createDiv({ type: "article", className: "club-body" }).add(
          createDiv({ type: "div", className: "club-info-content" }).setHtml(
            sanitizeHtml(club?.info) || "No info available"
          )
        )
      )
      .add(
        createDiv({ type: "article", className: "club-teams" })
          .add(
            createDiv({
              type: "h5",
              text: `Teams (${club?.teams.length || 0})`,
            })
          )
          .add(new TeamTable("#team-table"))
      );

    return this.renderChild(root);
  }
}

export class TeamTable extends Component {
  render() {
    const {
      club: { teams, club_name },
    } = getData();

    const table = createTable({ className: "team-table" })
      .add(createHeader({ headers: ["#Rank", "Name", "Gender", "Year"] }))
      .addBody(
        teams.map((team, i) => {
          return createRow()
            .addCell(team.rank_num)
            .addCell(
              new Link(`team-link-${i}`, {
                href: `/?${new URLSearchParams({
                  club_name: club_name,
                  team_name: team.team_name,
                }).toString()}`,
                text: team.team_name,
              })
            )
            .addCell(
              team.players
                ? `${team.gender} (${Object.keys(team.players).length})`
                : team.gender
            )
            .addCell(team.year);
        })
      );

    return table;
  }
}
