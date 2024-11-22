import AppInfo from "./appInfo";
import { getClubInfo } from "./fetchApi";
import { Component, getData, getUrlParams, Link, Page } from "./loveVanilla";

export default class PageTeam extends Page {
  constructor(app, urlMatcher) {
    super(app, urlMatcher);

    this.createChild(new AppInfo("#app-info"));
    this.createChild(new TeamInfo("#w-board"));
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

    const article = document.createElement("article");
    article.id = this.id;
    article.className = "team-info";

    const header = document.createElement("header");

    const teamName = document.createElement("h1");
    teamName.innerText = team.team_name;
    header.appendChild(teamName);

    const gender = document.createElement("h1");
    gender.innerText = `(${team.gender})`;
    header.appendChild(gender);

    article.appendChild(header);

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
          text: "🔍",
          className: "coach-search-google",
        });
        li.appendChild(a.getObject());
        li.appendChild(document.createTextNode(`${coach.full_name}`));
        ul.appendChild(li);
      }

      coaches.appendChild(ul);
      article.appendChild(coaches);
    }

    if (team?.players && Object.keys(team?.players).length > 0) {
      const h2 = document.createElement("h2");
      h2.innerText = `Players (${Object.keys(team?.players).length})`;
      article.appendChild(h2);

      const players = new PlayersTable("players-table");
      article.appendChild(players.render());
    }

    const footer = document.createElement("footer");
    footer.innerText = `Last updated: ${club.last_update}`;
    article.appendChild(footer);

    this.renderChild(article);
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

    const table = document.createElement("table");
    table.className = "club-table";

    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    const headers = ["#Num", "Name", "Goals"];
    for (const header of headers) {
      const th = document.createElement("th");
      th.innerText = header;
      th.scope = "col";
      headerRow.appendChild(th);
    }
    thead.appendChild(headerRow);

    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    for (const playerKey in team.players) {
      const player = team.players[playerKey];
      const row = document.createElement("tr");
      const cells = [
        player.shirt,
        `${player.last_name}, ${player.first_name}`,
        player.total_goals,
      ];

      for (let i = 0; i < cells.length; i++) {
        const cell = cells?.[i];
        const th = document.createElement("th");
        if (i == 0) {
          th.scope = "row";
        }
        // if (i == 0) {
        // const params = new URLSearchParams({
        //   q: `${player.last_name} ${player.first_name} ${club.club_name} ${player.year} soccer`,
        // });
        // const a = new Link(`player-link-${i}`, {
        //   href: `www.google.com/search?${params.toString()}`,
        //   text: cell,
        // });
        // th.appendChild(a.getObject());

        if (i == 1) {
          const nameCell = document.createElement("div");
          const searchParams = new URLSearchParams({
            q: `${player.last_name} ${player.first_name} ${club.club_name} ${player.year} soccer`,
          });
          nameCell.appendChild(
            new Link(`player-search-${i}`, {
              href: `https://www.google.com/search?${searchParams
                .toString()
                .toLowerCase()}`,
              text: "🔍",
              className: "player-search-google",
            }).getObject()
          );
          const playerParams = new URLSearchParams({
            player_name: `${player.last_name}_${player.first_name}_${player.year}`,
          });
          nameCell.appendChild(
            new Link(`player-link-${i}`, {
              href: `?${playerParams.toString().toLowerCase()}`,
              text: cell,
              className: "player-page",
            }).getObject()
          );
          th.appendChild(nameCell);
        } else {
          th.appendChild(document.createTextNode(cell));
        }
        row.appendChild(th);
      }

      tbody.appendChild(row);
    }

    table.appendChild(tbody);
    return table;
  }
}
