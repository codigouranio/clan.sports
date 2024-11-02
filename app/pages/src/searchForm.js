import { searchClubsBySearchTerm } from "./fetchApi";
import Component from "./loveVanilla/component";
import { setData } from "./loveVanilla/data";

export class SearchForm extends Component {
  constructor(id, props) {
    super(id, props);

    const searchBox = new SearchBox("#search-box");
    this.createChild(searchBox);
    this.createChild(new SearchButton("#search-button", { searchBox }));
  }
  init(props) {
    super.init(props);
    // this.searchBox = new SearchBox("#search-box");
    // this.searchButton = new SearchButton("#search-button");
    // this.searchButton.searchBox = this.searchBox;

    // this.createChild(this.searchBox);
    // this.createChild(this.searchButton);

    // this.obj.addEventListener("onsubmit", this.handleSubmit.bind(this));
  }

  handleSubmit(event) {
    event.preventDefault();
  }
}

export class SearchBox extends Component {
  init() {
    this.getObject().addEventListener("keydown", this.handleKey.bind(this));
  }

  async handleKey(event) {
    if (event.key == "Enter") {
      event.preventDefault();

      const searchTerm = this.getValue();
      const urlSearchParams = new URLSearchParams({
        query: searchTerm,
      });

      history.replaceState(null, "", `/?${urlSearchParams.toString()}`);

      const data = await searchClubsBySearchTerm(searchTerm);
      setData({
        searchResults: data,
      });
    }
  }

  getValue() {
    return this.getObject().value;
  }
}

export class SearchButton extends Component {
  init() {
    this.getObject().addEventListener("click", this.handleClick.bind(this));
  }

  async handleClick(ev) {
    ev.preventDefault();

    const searchTerm = this.props.searchBox.getValue();

    const urlSearchParams = new URLSearchParams({
      query: searchTerm,
    });

    history.replaceState(null, "", `/?${urlSearchParams.toString()}`);

    const data = await searchClubsBySearchTerm(searchTerm);
    setData({
      searchResults: data,
    });
  }
}
