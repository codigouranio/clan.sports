import AppInfo from "./appInfo";
import ClubList from "./clubList";
import { searchClubsBySearchTerm } from "./fetchApi";
import Loading from "./loading";
import { getData, getUrlParams, Page } from "./loveVanilla";
import { SearchForm } from "./searchForm";

class PageHome extends Page {
  constructor(app, url) {
    super(app, url);

    this.createChild(new AppInfo("#app-info"));
    this.createChild(new SearchForm("#search-form"));
    this.createChild(new ClubList("#w-board"));

    this.loading = new Loading();
  }

  async beforeRender() {
    super.beforeRender();
    // this.app.getObject().appendChild(this.loading.render());
    // this.app.getObject().removeChild(this.loading.getObject());
  }

  async render() {
    super.render();
  }

  async afterRender() {
    const { searchResults } = getData();

    if (
      getUrlParams("query") &&
      searchResults?.search_term !== getUrlParams("query")
    ) {
      await searchClubsBySearchTerm(getUrlParams("query") || "");
    }
  }
}

export default PageHome;
