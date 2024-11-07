import sanitizeHtml from "sanitize-html";
import { searchClubsBySearchTerm } from "./fetchApi";
import Component from "./loveVanilla/component";
import { getData, setData } from "./loveVanilla/data";

class ClubList extends Component {
  render() {
    const { searchResults, currentState, currentStateName } = getData();
    if (!searchResults) {
      return;
    }

    const results = this.getObject();
    results.innerHTML = "";

    if (searchResults && searchResults.total == 0) {
      const noResults = document.createElement("p");
      noResults.innerText = "No results found";
      results.appendChild(noResults);
      return;
    }

    const resultsLabel = document.createElement("p");
    let label = "Results";
    if (searchResults && searchResults.total > 0) {
      label = `Results found in ${searchResults.execution_time}s`;

      if (
        currentStateName &&
        currentStateName.length > 0 &&
        searchResults?.search_term === currentState
      ) {
        label += ` for ${currentStateName}`;
      }

      resultsLabel.innerText = label;
      results.appendChild(resultsLabel);
    }

    let counter = 0;
    for (const item of searchResults?.items) {
      const clubItem = new ClubItem(`club_${counter}`, {
        ...{ keys: [item?.club_name] },
        ...{ parent: this },
        ...item,
      });
      this.createChild(clubItem);
      results.appendChild(clubItem.getObject());
      counter++;
    }

    const hr = document.createElement("hr");
    results.appendChild(hr);

    if (searchResults.more_results) {
      this.moreResults = new MoreResults("more-results");
      results.appendChild(this.moreResults.getObject());
    }
  }
}

class ClubItem extends Component {
  constructor(id, props) {
    super(id, props);

    this.$object = document.createElement("article");
    this.$object.id = this.id;

    this.$object.className = "club-info";
    const header = document.createElement("header");

    const clubLogo = document.createElement("img");
    clubLogo.className = "club-logo";
    clubLogo.title = this.props.club_name;
    clubLogo.src = `/api/getClubLogo/${this.props.image_file}`;

    header.appendChild(clubLogo);

    const title = document.createElement("a");
    title.className = "search-title";
    title.href = "#";
    title.appendChild(clubLogo);
    title.appendChild(document.createTextNode(this.props.search_title));
    header.appendChild(title);

    this.$object.appendChild(header);

    const headerInfoRight = document.createElement("small");
    headerInfoRight.className = "rank";
    headerInfoRight.innerText = `Soccer Club - Rank: ${this.props.rank}`;
    header.appendChild(headerInfoRight);

    const clubElement = document.createElement("div");
    clubElement.innerHTML = sanitizeHtml(this.props?.info);

    this.$object.appendChild(clubElement);
  }
}

class ClubItem2 extends Component {
  constructor(id, props) {
    super(id, props);

    this.$object = document.createElement("details");
    this.$object.id = this.id;

    // console.log(this.getState(), this.getKeys());

    const curProps = this.getState();
    curProps?.open && this.$object.setAttribute("open", "");

    const summary = document.createElement("summary");

    // const clubLogoFrame = document.createElement("span");
    // clubLogoFrame.className = "club-logo-frame";
    const clubLogo = document.createElement("img");
    clubLogo.className = "club-logo";
    clubLogo.title = this.props.club_name;
    clubLogo.src = `/api/getClubLogo/${this.props.image_file}`;
    // clubLogoFrame.appendChild(clubLogo);

    // summary.appendChild(clubLogo);
    const title = document.createElement("div");
    // title.innerText = props?.search_title;
    title.appendChild(clubLogo);
    title.appendChild(document.createTextNode(this.props.search_title));
    summary.appendChild(title);

    // const rank = document.createElement("h6");
    // rank.innerText = `Rank ${this.props.rank}`;
    // summary.appendChild(rank);

    // `Rank ${this.props?.rank} - ${this.props.club_name}`
    summary.className = `contrast club-result`;
    summary.addEventListener("click", () => {
      this.setState({
        open: !curProps?.open,
      });
    });

    this.$object.appendChild(summary);

    const article = document.createElement("article");
    article.className = "club-info";
    const header = document.createElement("header");

    const teams = props?.teams || [];

    const teamsSummary = teams.reduce((acc, team) => {
      acc[team.gender] = acc[team.gender] ? acc[team.gender] + 1 : 1;
      return acc; // Ensure the accumulator is returned
    }, {});

    const totalPlayers = teams.reduce((acc, team) => {
      return acc + (team?.players_count || 0);
    }, 0);

    console.log(totalPlayers);

    console.log(teamsSummary);

    const headerInfoLeft = document.createElement("small");
    headerInfoLeft.className = "rank";
    headerInfoLeft.innerText = `Total Teams: ${teams.length} (`;
    if (teamsSummary["boys"]) {
      headerInfoLeft.innerText += `boys: ${teamsSummary["boys"]} `;
    }
    if (teamsSummary["girls"]) {
      headerInfoLeft.innerText += `girls: ${teamsSummary["girls"]}`;
    }
    headerInfoLeft.innerText += ") ";
    if (totalPlayers > 0) {
      headerInfoLeft.innerText += `Total Players: ${totalPlayers}`;
    }

    header.appendChild(headerInfoLeft);

    const headerInfoRight = document.createElement("small");
    headerInfoRight.className = "rank";
    headerInfoRight.innerText = `Soccer Club - Rank: ${this.props.rank}`;
    header.appendChild(headerInfoRight);

    // const rank = document.createElement("h2");
    // rank.className = "rank";
    // rank.innerText = `Ranked ${this.props.rank}`;
    // header.appendChild(rank);

    // const clubLogo = document.createElement("img");
    // clubLogo.className = "club-logo";
    // clubLogo.title = this.props.club_name;
    // clubLogo.src = `/api/getClubLogo/${this.props.image_file}`;
    // header.appendChild(clubLogo);

    article.appendChild(header);

    const clubElement = document.createElement("div");
    clubElement.innerHTML = sanitizeHtml(this.props.info);

    article.appendChild(clubElement);

    const teamHeader = document.createElement("h5");
    teamHeader.innerText = `Teams (${props?.teams.length || 0})`;
    article.appendChild(teamHeader);

    const teamTable = new TeamTable("team-table", { teams: props.teams });
    article.appendChild(teamTable.getObject());

    const footer = document.createElement("footer");
    footer.innerText = `Last updated: ${this.props.last_update}`;
    article.appendChild(footer);

    this.$object.appendChild(article);
  }
}

class MoreResults extends Component {
  constructor(id, props) {
    super(id, props);

    this.$object = document.createElement("a");
    this.$object.id = id;
    this.$object.href = "#";
    this.$object.className = "contrast";
    this.$object.appendChild(document.createTextNode("More results"));
    this.$object.addEventListener("click", async (event) => {
      event.preventDefault();

      const {
        searchResults: { page, page_size, search_term },
      } = getData();

      console.log([page, search_term]);
      console.log(getData());

      const data = await searchClubsBySearchTerm(
        search_term,
        page + 1,
        page_size
      );

      setData({
        searchResults: {
          items: [...getData().searchResults.items, ...data.items],
          page: data.page,
          page_size: data.page_size,
          search_term: data.search_term,
          total: data.total,
          more_results: data.more_results,
        },
      });
    });
  }
}

class TeamTable extends Component {
  constructor(id, props) {
    super(id, props);

    const { teams } = props;

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
        th.innerText = cell;
        row.appendChild(th);
      }

      tbody.appendChild(row);
    }

    this.$object.appendChild(tbody);
  }
}

export default ClubList;
