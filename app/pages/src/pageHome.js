import AppInfo from "./appInfo";
import ClubList from "./clubList";
import { searchClubsBySearchTerm } from "./fetchApi";
import { getData, setData } from "./loveVanilla/data";
import Page from "./loveVanilla/page";
import { SearchForm } from "./searchForm";

class PageHome extends Page {
  children = [];

  constructor(page, url) {
    super(page, url);

    this.createChild(new AppInfo("#app-info"));
    this.createChild(new SearchForm("#search-form"));

    this.clubList = new ClubList("#club-list");
    this.createChild(this.clubList);
  }

  async init() {
    super.init();

    const params = new URLSearchParams(window.location.search);
    const { searchResults } = getData();
    if (
      params.has("query") &&
      searchResults?.search_term !== params.get("query")
    ) {
      const data = await searchClubsBySearchTerm(params.get("query") || "");
      setData({
        searchResults: data,
      });
    }
  }
}

export default PageHome;
