import { Component } from "./component";

export class Page {
  children = [];
  state = {};

  constructor(app, url) {
    this.app = app;
    this.url = url;
  }

  getUrl() {
    return this.url;
  }

  getUrlParams(paramName) {
    const params = new URLSearchParams(window.location.search);

    if (paramName && paramName.length > 0) {
      if (params.has(paramName)) {
        return params.get(paramName);
      }
      return "";
    }

    return params;
  }

  getApp() {
    return this.app;
  }

  createChild(child) {
    child.setParent(this);
    this.children.push(child);
    return child;
  }

  callMethodOnChildren(methodName) {
    this.children.forEach((child) => {
      if (child instanceof Component) {
        try {
          child[methodName]();
        } catch (e) {
          console.error(e);
        }
      }
    });
  }

  beforeRender() {
    this.state = {};
    this.callMethodOnChildren("beforeRender");
  }

  render() {
    this.callMethodOnChildren("render");
  }

  afterRender() {
    this.callMethodOnChildren("afterRender");
  }

  updatedData() {
    this.callMethodOnChildren("updatedData");
  }
}
