import sanitizeHtml from "sanitize-html";
import AppInfo from "./appInfo";
import { getClubInfo } from "./fetchApi";
import { Component, getData, getUrlParams, Link, Page } from "./loveVanilla";

export default class PageClub extends Page {
  constructor(app, urlMatcher) {
    super(app, urlMatcher);

    this.createChild(new AppInfo("#app-info"));
    this.createChild(new ClubInfo("#w-board"));
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
    console.log(this.requireQueryData());
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

    const article = document.createElement("article");
    article.className = "club-info";

    const header = document.createElement("header");

    const headerInfoLeft = document.createElement("h5");
    headerInfoLeft.className = "rank";
    headerInfoLeft.innerText = `Soccer Club - (Rank: ${club.rank})`;
    header.appendChild(headerInfoLeft);

    const headerInfoRight = document.createElement("div");
    headerInfoRight.className = "club-logo";
    const clubLogo = document.createElement("img");
    clubLogo.title = club.club_name;
    clubLogo.src = `/api/getClubLogo/${club.image_file}`;
    headerInfoRight.appendChild(clubLogo);
    header.appendChild(headerInfoRight);

    article.appendChild(header);

    const content = document.createElement("div");
    content.className = "club-info-content";
    content.innerHTML = sanitizeHtml(club?.info) || "No info available";

    article.appendChild(content);

    const teamHeader = document.createElement("h5");
    teamHeader.innerText = `Teams (${club?.teams.length || 0})`;
    article.appendChild(teamHeader);

    const teamTable = new TeamTable("#team-table");
    article.appendChild(teamTable.render());

    const footer = document.createElement("footer");
    footer.innerText = `Last updated: ${club.last_update}`;
    article.appendChild(footer);

    this.renderChild(article);
  }
}

export class TeamTable extends Component {
  render() {
    const {
      club: { teams, club_name },
    } = getData();

    const table = document.createElement("table");
    table.className = "team-table";

    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    const headers = ["#Rank", "Name", "Gender", "Year"];
    for (const header of headers) {
      const th = document.createElement("th");
      th.innerText = header;
      th.scope = "col";
      headerRow.appendChild(th);
    }
    thead.appendChild(headerRow);

    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    for (const team of teams) {
      const row = document.createElement("tr");
      const cells = [team.rank_num, team.team_name, team.gender, team.year];

      for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        const th = document.createElement("th");
        if (i == 0) {
          th.scope = "row";
        }
        if (i == 1) {
          const params = new URLSearchParams({
            club_name: club_name,
            team_name: team.team_name,
          });
          const a = new Link(`team-link-${i}`, {
            href: `/?${params.toString()}`,
            text: cell,
          });
          th.appendChild(a.getObject());
        } else if (i == 2 && team.players) {
          const totalPlayers = Object.keys(team.players).length;
          th.appendChild(document.createTextNode(`${cell} (${totalPlayers})`));
        } else {
          th.innerText = cell;
        }
        row.appendChild(th);
      }

      tbody.appendChild(row);
    }

    table.appendChild(tbody);

    return table;
  }
}
