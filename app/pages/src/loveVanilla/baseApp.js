import { getData, setData } from "./data";

class BaseApp {
  pages = [];

  constructor() {
    const data = JSON.parse(localStorage.getItem("data"));
    setData(data);

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

  addPage(page) {
    this.pages.push(page);
  }

  render() {
    this.curUrl = {
      pathname: window.location.pathname,
      search: window.location.search,
      hash: window.location.hash,
    };

    for (const page of this.pages) {
      if (page.url == this.curUrl.pathname) {
        page.render();
        return;
      }
    }
  }
}

export default BaseApp;
