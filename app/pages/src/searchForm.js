import { searchClubsBySearchTerm } from "./fetchApi";
import Component from "./loveVanilla/component";
import { setData } from "./loveVanilla/data";

export class SearchForm extends Component {
  constructor(id) {
    super(id);

    this.searchBox = new SearchBox("#search-box");
  }

  init() {
    this.searchBox = new SearchBox("#search-box");
    this.searchButton = new SearchButton("#search-button");
    this.searchButton.searchBox = this.searchBox;

    this.createChild(this.searchBox);
    this.createChild(this.searchButton);

    this.obj.addEventListener("onsubmit", this.handleSubmit.bind(this));

    super.init();
  }

  handleSubmit(event) {
    event.preventDefault();
  }
}

export class SearchBox extends Component {
  constructor(id) {
    super(id);
  }

  init() {
    this.obj.addEventListener("input", this.handleInput.bind(this));
    this.obj.addEventListener("keydown", this.handleKey.bind(this));
    // this.obj.addEventListener("click", this.handleClick.bind(this));
    // this.obj.addEventListener("keypress", this.handleKey.bind(this));
    // this.obj.addEventListener("keyup", this.handleKey.bind(this));
  }

  handleInput(event) {}

  handleClick(event) {}

  async handleKey(event) {
    if (event.key == "Enter") {
      event.preventDefault();
      const searchTerm = this.getValue();

      const data = await searchClubsBySearchTerm(searchTerm);
      setData({
        searchResults: data,
      });
    }
  }

  getValue() {
    return this.obj.value;
  }
}

export class SearchButton extends Component {
  constructor(selector) {
    super(selector);

    this.obj.addEventListener("click", this.handleClick.bind(this));
  }

  async handleClick(ev) {
    ev.preventDefault();

    const searchTerm = this.searchBox.getValue();

    const data = await searchClubsBySearchTerm(searchTerm);
    setData({
      searchResults: data,
    });
  }
}
