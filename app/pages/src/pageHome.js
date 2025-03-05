import AppInfo from "./appInfo";
import HitList from "./hitList";
import { searchByTerm } from "./fetchApi";
import Loading from "./loading";
import LoginMenu from "./loginMenu";
import { getData, getUrlParams, Page } from "./loveVanilla";
import { SearchForm } from "./searchForm";

class PageHome extends Page {
  constructor(app, url) {
    super(app, url);

    this.createChild(new AppInfo("#app-info"));
    this.createChild(new SearchForm("#search-form"));
    this.createChild(new HitList("#w-board"));
    this.createChild(new LoginMenu("#login-menu"));

    this.loading = new Loading();
  }

  async render() {
    super.render();
    return null;
  }

  async afterRender() {
    super.afterRender();

    const { searchResults } = getData();

    await searchByTerm(getUrlParams("query") || "");

    // if (
    //   getUrlParams("query") &&
    //   searchResults?.search_term !== getUrlParams("query")
    // ) {
    //   await searchByTerm(getUrlParams("query") || "");
    // }
  }
}

export default PageHome;
