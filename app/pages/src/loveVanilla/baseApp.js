import { getData, setData } from "./data";
import { UrlMatcher } from "./urlMatcher";

export class BaseApp {
  pages = [];
  lastPage = null;

  constructor(id) {
    this.id = id;

    document.addEventListener("DOMContentLoaded", async () => {
      setTimeout(() => this.startLoading(), 100);
      setTimeout(() => this.stopLoading(), 600);
    });
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

  getCurrentPage() {
    this.curUrl = new UrlMatcher(
      window.location.pathname,
      window.location.search,
      window.location.hash
    );

    for (const page of this.pages) {
      if (page.url.isMatch(this.curUrl)) {
        return page;
      }
    }
    return undefined;
  }

  start() {
    window.addEventListener("beforeunload", (event) => {
      localStorage.setItem("lastVisited", new Date().toISOString());
      const data = getData();
      localStorage.setItem("data", JSON.stringify(data));

      event.returnValue = "";
    });

    window.addEventListener("__@_popstate_forward", () => {
      window.scroll(0, 0);
      this.triggerRenderingEvent();
    });

    window.addEventListener("__@_updated_data", () => {
      this.triggerUpdatedDataEvent();
    });

    window.addEventListener("popstate", () => {
      this.triggerRenderingEvent();
    });

    this.triggerRenderingEvent();

    const data = JSON.parse(localStorage.getItem("data"));
    setData(data);
  }

  triggerRenderingEvent() {
    this.lastPage = this.getCurrentPage();

    this.lastPage?.beforeRender();
    this.lastPage?.render();
    this.lastPage?.afterRender();
  }

  triggerUpdatedDataEvent() {
    this.lastPage = this.getCurrentPage();

    this.lastPage?.beforeRender();
    this.lastPage?.render();
    this.lastPage?.updatedData();
  }

  startLoading() {
    document.querySelector(".love-vanilla-body")?.classList.add("show-up");
  }

  stopLoading() {
    document.querySelector(".love-vanilla-body")?.classList.add("fade-in");
  }
}
