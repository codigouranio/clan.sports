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

    const results = this.obj.querySelector("#result-list");

    if (searchResults?.page == 0) {
      results.innerHTML = "";
    } else if (this.moreResults) {
      this.moreResults.remove();
      this.moreResults = null;
    }

    if (searchResults && searchResults.items.length == 0) {
      const noResults = document.createElement("p");
      noResults.innerText = "No results found";
      results.appendChild(noResults);
      return;
    }

    if (searchResults?.page == 0) {
      const resultsLabel = document.createElement("p");
      resultsLabel.innerText = "Results";
      results.appendChild(resultsLabel);
    }

    let counter = 0;
    for (const item of searchResults?.items) {
      const hr = document.createElement("hr");

      const clubItem = new ClubItem(`club_${counter}`, results, item);
      // results.appendChild(clubItem.getObject());
      // clubItem.render();

      // const details = document.createElement("details");
      // const clubTitle = document.createElement("p");
      // clubTitle.innerText = item.club_name;

      // const clubLogo = document.createElement("img");
      // clubLogo.className = "club-logo";
      // clubLogo.src = `/api/getClubLogo/${item.image_file}`;
      // col1.appendChild(clubLogo);

      // const summary = document.createElement("summary");
      // summary.appendChild(document.createTextNode(item.club_name));
      // summary.setAttribute("role", "button");
      // summary.className = "outline contrast";
      // details.appendChild(summary);

      // const clubElement = document.createElement("div");
      // clubElement.innerHTML = sanitizeHtml(item.info);
      // details.appendChild(clubElement);

      results.appendChild(clubItem.getObject());
      results.appendChild(hr);

      counter += 1;
    }

    this.moreResults = new MoreResults("more-results", this.obj);
    results.appendChild(this.moreResults.getObject());

    this.obj.appendChild(results);
  }
}

class ClubItem extends Component {
  constructor(id, parent, props) {
    super(id, parent, props);

    this.obj = document.createElement("details");
    this.obj.id = id;

    // const clubTitle = document.createElement("p");
    // clubTitle.innerText = props.club_name;

    const summary = document.createElement("summary");
    summary.appendChild(document.createTextNode(props.club_name));
    summary.setAttribute("role", "button");
    summary.className = "outline contrast";
    this.obj.appendChild(summary);

    const article = document.createElement("article");

    const header = document.createElement("header");

    const rank = document.createElement("h2");
    rank.innerText = `Ranked ${props.rank}`;
    header.appendChild(rank);

    const clubLogo = document.createElement("img");
    clubLogo.className = "club-logo";
    clubLogo.title = props.club_name;
    clubLogo.src = `/api/getClubLogo/${props.image_file}`;
    header.appendChild(clubLogo);

    article.appendChild(header);

    const clubElement = document.createElement("div");
    clubElement.innerHTML = sanitizeHtml(props.info);

    article.appendChild(clubElement);

    const footer = document.createElement("footer");
    footer.innerText = `Last updated: ${props.last_update}`;
    article.appendChild(footer);

    this.obj.appendChild(article);
  }

  render() {
    console.log(this.props);
  }
}

class MoreResults extends Component {
  constructor(id, parent) {
    super(id, parent);

    this.obj = document.createElement("a");
    this.obj.id = id;
    this.obj.href = "#";
    this.obj.className = "contrast";
    this.obj.appendChild(document.createTextNode("More results"));
    this.obj.addEventListener("click", async (event) => {
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
        searchResults: data,
        page: page + 1,
      });
    });
  }

  render() {
    this.parent.appendChild(this.obj);
  }
}

export default ClubList;
