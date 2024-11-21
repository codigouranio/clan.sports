import sanitizeHtml from "sanitize-html";
import { searchClubsBySearchTerm } from "./fetchApi";
import { Component, getData, Image, Link } from "./loveVanilla";

class ClubList extends Component {
  render() {
    const { searchResults, currentState, currentStateName } = getData();
    if (!searchResults) {
      return;
    }

    if (searchResults && searchResults.total == 0) {
      const noResults = document.createElement("p");
      noResults.innerText = "No results found";
      this.renderChild(noResults);
      return noResults;
    }

    const results = document.createElement("span");

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

    this.renderChild(results);

    return results;
  }
}

class ClubItem extends Component {
  constructor(id, props) {
    super(id, props);

    this.$object = document.createElement("article");
    this.$object.id = this.id;

    this.$object.className = "club-info";
    const header = document.createElement("header");

    const params = new URLSearchParams();
    params.set("club_name", this.props.club_name);
    const clubLink = new Link("club-link", {
      href: `/?${params.toString()}`,
      text: this.props.search_title,
      className: "search-title",
    });

    const clubLogo = new Image(`club-logo-${this.id}`, {
      title: this.props.club_name,
      alt: this.props.club_name,
      className: "club-logo",
      src: `/api/getClubLogo/${this.props.image_file}`,
    });
    clubLink.appendChild(clubLogo);

    header.appendChild(clubLink.getObject());

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

      await searchClubsBySearchTerm(search_term, page + 1, page_size, true);
    });
  }
}

export default ClubList;
