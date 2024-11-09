import { getData, setData, getDataHashCode, setDataHashCode } from "./data";
import { UrlMatcher } from "./urlMatcher";

export class BaseApp {
  pages = [];

  constructor(id) {
    this.id = id;

    const data = JSON.parse(localStorage.getItem("data"));
    setData(data, false, true);

    window.addEventListener("__popstate__", () => this.render());

    document.addEventListener("DOMContentLoaded", async () => {
      setTimeout(() => {
        document.body.classList.add("show-up");
      }, 100);

      setTimeout(() => {
        document.body.classList.add("fade-in");
      }, 520);
    });

    window.addEventListener("beforeunload", (event) => {
      localStorage.setItem("lastVisited", new Date().toISOString());
      const data = getData();
      localStorage.setItem("data", JSON.stringify(data));

      event.returnValue = "";
    });
  }

  init() {
    // window.dispatchEvent(new Event("__init_state__"));
    for (const page of this.pages) {
      try {
        page.init();
      } catch (e) {
        console.error(e);
      }
    }
  }

  getObject() {
    if (!this.id) {
      return document.body;
    }
    return document.querySelector(this.id);
  }

  addPage(page) {
    this.pages.push(page);
  }

  render() {
    this.curUrl = new UrlMatcher(
      window.location.pathname,
      window.location.search,
      window.location.hash
    );

    for (const page of this.pages) {
      if (page.url.isMatch(this.curUrl)) {
        page.render();
        return;
      }
    }
  }
}
