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
    return document.createElement("span");
  }

  afterRender() {
    this.callMethodOnChildren("afterRender");
  }

  updatedData() {
    this.callMethodOnChildren("updatedData");
    return document.createElement("span");
  }
}
