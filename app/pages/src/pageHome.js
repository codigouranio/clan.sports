import AppInfo from "./appInfo";
import ClubList from "./clubList";
import { searchClubsBySearchTerm } from "./fetchApi";
import { getData, Page, setData } from "./loveVanilla";
import { SearchForm } from "./searchForm";

class PageHome extends Page {
  children = [];

  constructor(app, url) {
    super(app, url);

    this.createChild(new AppInfo("#app-info"));
    this.createChild(new SearchForm("#search-form"));

    this.clubList = new ClubList("#w-board");
    this.createChild(this.clubList);
  }

  async init() {
    super.init();

    const { searchResults } = getData();
    if (
      this.getUrlParams("query") &&
      searchResults?.search_term !== this.getUrlParams("query")
    ) {
      const data = await searchClubsBySearchTerm(
        this.getUrlParams("query") || ""
      );
      setData({
        searchResults: data,
      });
    }
  }
}

export default PageHome;
