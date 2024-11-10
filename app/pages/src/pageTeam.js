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
      await getClubInfo(this.getUrlParams("club_name"));
    }
  }

  render() {
    super.render();

    this.$object.innerHTML = "";

    if (this.requireQueryData()) {
      return;
    }

    const { club } = getData();
    const team_name = this.getUrlParams("team_name");
    const team = club?.teams.find((team) => team.team_name === team_name);

    const teamInfo = new TeamInfo("#team-info", { club, team });
    this.$object.appendChild(teamInfo.getObject());
    // this.$object.appendChild(document.createTextNode(JSON.stringify(team)));
  }
}

export class TeamInfo extends Component {
  constructor(id, props) {
    super(id, props);

    const { club, team } = props;

    this.$object = document.createElement("article");
    this.$object.id = id;
    this.$object.className = "team-info";

    const header = document.createElement("header");

    const teamName = document.createElement("h1");
    teamName.innerText = team.team_name;
    header.appendChild(teamName);

    const gender = document.createElement("h1");
    gender.innerText = `(${team.gender})`;
    header.appendChild(gender);

    this.$object.appendChild(header);

    // coaches
    if (team?.coaches && Object.keys(team?.coaches).length > 0) {
      const coaches = document.createElement("section");
      const h2 = document.createElement("h2");
      h2.innerText = "Coaches";
      coaches.appendChild(h2);

      const ul = document.createElement("ul");
      for (const coachKey in team.coaches) {
        const coach = team.coaches[coachKey];
        const li = document.createElement("li");
        const params = new URLSearchParams({
          q: `${coach.full_name} soccer`,
        });
        const a = new Link(`coach-link-${coachKey}`, {
          href: `https://www.google.com/search?${params.toString()}`,
          text: " 🔍 ",
        });
        li.appendChild(a.getObject());
        li.appendChild(document.createTextNode(`${coach.full_name}`));
        ul.appendChild(li);
      }

      coaches.appendChild(ul);
      this.$object.appendChild(coaches);
    }

    if (team?.players && Object.keys(team?.players).length > 0) {
      const h2 = document.createElement("h2");
      h2.innerText = `Players (${Object.keys(team?.players).length})`;
      this.$object.appendChild(h2);

      const players = new PlayersTable("players-table", {
        club: club,
        team: team,
      });
      this.$object.appendChild(players.getObject());
    }

    const footer = document.createElement("footer");
    footer.innerText = `Last updated: ${club.last_update}`;
    this.$object.appendChild(footer);
  }
}

export class PlayersTable extends Component {
  constructor(id, props) {
    super(id, props);

    const { club, team } = props;

    this.$object = document.createElement("table");
    this.$object.id = id;
    this.$object.className = "club-table";

    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    const headers = ["", "#Num", "Last Name", "First Name", "Goals"];
    for (const header of headers) {
      const th = document.createElement("th");
      th.innerText = header;
      th.scope = "col";
      headerRow.appendChild(th);
    }
    thead.appendChild(headerRow);

    this.$object.appendChild(thead);

    const tbody = document.createElement("tbody");
    for (const playerKey in team.players) {
      const player = team.players[playerKey];
      const row = document.createElement("tr");
      const cells = [
        "🔍",
        player.shirt,
        player.first_name,
        player.last_name,
        player.total_goals,
      ];

      for (let i = 0; i < cells.length; i++) {
        const cell = cells?.[i];
        console.log([i, cell, cells]);
        const th = document.createElement("th");
        if (i == 0) {
          th.scope = "row";
        }
        if (i == 0) {
          const params = new URLSearchParams({
            q: `${player.last_name} ${player.first_name} ${club.club_name} ${player.year} soccer`,
          });
          const a = new Link(`player-link-${i}`, {
            href: `https://www.google.com/search?${params.toString()}`,
            text: cell,
          });
          th.appendChild(a.getObject());
        } else {
          th.appendChild(document.createTextNode(cell));
        }
        row.appendChild(th);
      }

      tbody.appendChild(row);
    }

    this.$object.appendChild(tbody);
  }
}
