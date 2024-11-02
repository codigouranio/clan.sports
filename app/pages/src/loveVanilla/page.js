import Component from "./component";

class Page {
  children = [];

  constructor(app, url) {
    this.app = app;
    this.url = url;
  }

  getUrl() {
    return this.url;
  }

  init(props) {
    this.props = props;

    for (const child of this.children) {
      if (child instanceof Component) {
        try {
          child.init();
        } catch (e) {
          console.error(e);
        }
      }
    }
  }

  getApp() {
    return this.app;
  }

  render() {
    for (const child of this.children) {
      if (child instanceof Component) {
        try {
          child.render();
        } catch (e) {
          console.error(e);
        }
      }
    }
  }

  createChild(child) {
    child.setParent(this);
    this.children.push(child);
    return child;
  }
}

export default Page;
