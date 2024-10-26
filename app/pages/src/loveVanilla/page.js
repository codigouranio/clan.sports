class Page {
  constructor(page) {
    this.page = page;
    this.obj = document.querySelector(page);
    if (this.obj) {
      console.log(`Found ${this.page}`);
      window.addEventListener("__popstate__", () => this.render());
    } else {
      console.log(`No found ${this.page}`);
    }
  }
  render() {
    console.log("Rendering page");
  }
}

export default Page;
