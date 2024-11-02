import sanitizeHtml from "sanitize-html";
import { searchClubsBySearchTerm } from "./fetchApi";
import Component from "./loveVanilla/component";
import { getData, setData } from "./loveVanilla/data";

class ClubList extends Component {
  render() {
    const { searchResults } = getData();
    if (!searchResults) {
      return;
    }

    const results = this.getObject();
    results.innerHTML = "";

    if (searchResults && searchResults.items.length == 0) {
      const noResults = document.createElement("p");
      noResults.innerText = "No results found";
      results.appendChild(noResults);
      return;
    }

    const resultsLabel = document.createElement("p");
    resultsLabel.innerText = "Results";
    results.appendChild(resultsLabel);

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

    this.$object = document.createElement("details");
    this.$object.id = this.id;

    // console.log(this.getState(), this.getKeys());

    const curProps = this.getState();
    curProps?.open && this.$object.setAttribute("open", "");

    const summary = document.createElement("summary");
    summary.appendChild(document.createTextNode(`${this.props.club_name}`));
    summary.className = `contrast club-result`;
    summary.addEventListener("click", () => {
      this.setState({
        open: !curProps?.open,
      });
    });

    this.$object.appendChild(summary);

    const article = document.createElement("article");
    const header = document.createElement("header");

    const rank = document.createElement("h2");
    rank.className = "rank";
    rank.innerText = `Ranked ${this.props.rank}`;
    header.appendChild(rank);

    const clubLogo = document.createElement("img");
    clubLogo.className = "club-logo";
    clubLogo.title = this.props.club_name;
    clubLogo.src = `/api/getClubLogo/${this.props.image_file}`;
    header.appendChild(clubLogo);

    article.appendChild(header);

    const clubElement = document.createElement("div");
    clubElement.innerHTML = sanitizeHtml(this.props.info);

    article.appendChild(clubElement);

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

export default ClubList;
