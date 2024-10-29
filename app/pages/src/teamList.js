import sanitizeHtml from "sanitize-html";
import Component from "./loveVanilla/component";
import { getData } from "./loveVanilla/data";

class TeamList extends Component {
  render() {
    const { searchResults } = getData();

    if (!searchResults) {
      return;
    }

    const results = this.obj.querySelector("#result-list");
    results.innerHTML = "";

    if (searchResults && searchResults.length == 0) {
      const noResults = document.createElement("p");
      noResults.innerText = "No results found";
      results.appendChild(noResults);
      return;
    }

    const resultsLabel = document.createElement("p");
    resultsLabel.innerText = "Results";
    results.appendChild(resultsLabel);

    for (const item of searchResults) {
      const hr = document.createElement("hr");
      const details = document.createElement("details");
      const clubTitle = document.createElement("p");
      clubTitle.innerText = item.club_name;

      // const clubLogo = document.createElement("img");
      // clubLogo.className = "club-logo";
      // clubLogo.src = `/api/getClubLogo/${item.image_file}`;
      // col1.appendChild(clubLogo);

      const summary = document.createElement("summary");
      summary.appendChild(document.createTextNode(item.club_name));
      summary.setAttribute("role", "button");
      summary.className = "outline contrast";
      details.appendChild(summary);

      const clubElement = document.createElement("div");
      clubElement.innerHTML = sanitizeHtml(item.info);
      details.appendChild(clubElement);

      results.appendChild(details);

      results.appendChild(hr);
    }

    this.obj.appendChild(results);
  }
}

export default TeamList;
