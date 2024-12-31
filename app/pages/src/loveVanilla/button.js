import { Component } from "./component";
import { asyncDebounce } from "./utils";

export class Button extends Component {
  click = async () => {};

  constructor(id) {
    super(id);

    this.handleClick();
    this.click = async () => {};
  }

  setClick(click) {
    this.click = click.bind(this);
    return this;
  }

  handleClick() {
    this.getObject().addEventListener("click", (event) => {
      event.preventDefault();
      asyncDebounce((event) => this.click(event, this), 150)(event);
    });
  }

  render() {}
}
