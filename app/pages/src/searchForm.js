import { searchClubsBySearchTerm } from "./fetchApi";
import { Component, setData, getData } from "./loveVanilla";

export class SearchForm extends Component {
  constructor(id, props) {
    super(id, props);

    const searchBox = new SearchBox("#search-box");
    this.createChild(searchBox);
  }

  handleSubmit(event) {
    event.preventDefault();
  }
}

export class SearchBox extends Component {
  constructor(id, props) {
    super(id, props);

    this.getObject().addEventListener("keydown", this.handleKey.bind(this));
  }

  async handleKey(event) {
    if (event.key == "Enter") {
      event.preventDefault();
      await searchClubsBySearchTerm(this.getValue());
    }
  }

  getValue() {
    return this.getObject().value;
  }
}

export class SearchButton extends Component {
  constructor(id, props) {
    super(id, props);

    this.getObject().addEventListener("click", this.handleClick.bind(this));
  }

  async handleClick(ev) {
    ev.preventDefault();

    const searchTerm = this.props.searchBox.getValue();
    await searchClubsBySearchTerm(searchTerm);
  }
}
