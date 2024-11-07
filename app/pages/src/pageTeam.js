import Page from "./loveVanilla/page";

class PageTeam extends Page {
  constructor(id, props) {
    super(id, props);

    this.$object = document.createElement("section");
    this.$object.id = this.id;

    this.$object.innerHTML = `
      <h2>Team</h2>
      <p>Team page content</p>
    `;
  }

  async init() {
    super.init();

    const params = new URLSearchParams(window.location.search);
    console.log(params);

    // const { searchResults } = getData();
    // if (
    //   params.has("query") &&
    //   searchResults?.search_term !== params.get("query")
    // ) {
    //   const data = await searchClubsBySearchTerm(params.get("query") || "");
    //   setData({
    //     searchResults: data,
    //   });
    // }
  }
}

export default PageTeam;
