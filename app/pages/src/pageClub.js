import sanitizeHtml from "sanitize-html";
import AppInfo from "./appInfo";
import { getClubInfo } from "./fetchApi";
import { Component, getData, Link, Page } from "./loveVanilla";

export default class PageClub extends Page {
  constructor(app, urlMatcher) {
    super(app, urlMatcher);

    this.$object = document.querySelector("#w-board");
    this.createChild(new AppInfo("#app-info"));
  }

  requireQueryData() {
    const { club } = getData();
    return (
      !club ||
      (this.getUrlParams().has("club_name") &&
        club?.club_name !== this.getUrlParams("club_name"))
    );
  }

  async afterRender() {
    if (this.requireQueryData()) {
      await getClubInfo(this.getUrlParams("club_name") || "");
    }
  }

  render() {
    super.render();

    this.$object.innerHTML = "";

    if (this.requireQueryData()) {
      return;
    }

    const { club } = getData();
    const clubInfo = new ClubInfo("#club-info", club);
    this.$object.appendChild(clubInfo.getObject());
  }
}

export class ClubInfo extends Component {
  constructor(id, props) {
    super(id, props);

    const article = document.createElement("article");
    article.className = "club-info";

    const header = document.createElement("header");

    const headerInfoLeft = document.createElement("h5");
    headerInfoLeft.className = "rank";
    headerInfoLeft.innerText = `Soccer Club - (Rank: ${props.rank})`;
    header.appendChild(headerInfoLeft);

    const headerInfoRight = document.createElement("div");
    headerInfoRight.className = "club-logo";
    const clubLogo = document.createElement("img");
    clubLogo.title = props.club_name;
    clubLogo.src = `/api/getClubLogo/${props.image_file}`;
    headerInfoRight.appendChild(clubLogo);
    header.appendChild(headerInfoRight);

    article.appendChild(header);

    const content = document.createElement("div");
    content.className = "club-info-content";
    content.innerHTML = sanitizeHtml(props?.info) || "No info available";

    article.appendChild(content);

    const teamHeader = document.createElement("h5");
    teamHeader.innerText = `Teams (${props?.teams.length || 0})`;
    article.appendChild(teamHeader);

    const teamTable = new TeamTable("team-table", {
      teams: props.teams,
      clubName: props.club_name,
    });
    article.appendChild(teamTable.getObject());

    const footer = document.createElement("footer");
    footer.innerText = `Last updated: ${props.last_update}`;
    article.appendChild(footer);

    this.$object = article;
  }
}

export class TeamTable extends Component {
  constructor(id, props) {
    super(id, props);

    const { teams, clubName } = props;

    this.$object = document.createElement("table");
    this.$object.id = id;
    this.$object.className = "team-table";

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

    this.$object.appendChild(thead);

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
            club_name: clubName,
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

    this.$object.appendChild(tbody);
  }
}
