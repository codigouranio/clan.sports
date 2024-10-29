import { searchClubs } from "./fetchApi";
import Component from "./loveVanilla/component";
import { getData, setData } from "./loveVanilla/data";
import sanitizeHtml from "sanitize-html";

class TeamList extends Component {
  async search(state, gender, year) {
    const data = await searchClubs(state, gender, year);
    setData({
      clubs: data,
    });
  }

  render() {
    const { clubs } = getData();
    console.log(getData());

    if (!clubs) {
      return;
    }

    const results = this.obj.querySelector("#result-list");
    results.innerHTML = "";
    this.obj.appendChild(results);

    for (const club of clubs) {
      const hr = document.createElement("hr");
      results.appendChild(hr);

      const row1 = document.createElement("div");
      row1.className = "row";

      const col1 = document.createElement("div");
      col1.className = "col-xs-4 col-sm-2 col-md-2 col-lg-1";

      const clubLogo = document.createElement("img");
      clubLogo.className = "club-logo";
      clubLogo.src = `/api/getClubLogo/${club.image_file}`;
      col1.appendChild(clubLogo);

      row1.appendChild(col1);

      const col2 = document.createElement("div");
      col2.className = "col-xs-8 col-sm-6 col-md-4 col-lg-3";

      const clubTitle = document.createElement("h3");
      clubTitle.innerText = club.club_name;

      const teamTitle = document.createElement("p");
      teamTitle.innerText = club.team_name;

      col2.appendChild(clubTitle);
      col2.appendChild(teamTitle);

      row1.appendChild(col2);

      results.appendChild(row1);

      const item = document.createElement("details");
      const summary = document.createElement("summary");
      summary.appendChild(document.createTextNode("More information"));
      item.appendChild(summary);

      const clubElement = document.createElement("div");
      clubElement.innerHTML = sanitizeHtml(club.info);
      item.appendChild(clubElement);

      results.appendChild(item);
      results.appendChild(hr);
    }

    this.obj.appendChild(results);
  }
}

export default TeamList;
