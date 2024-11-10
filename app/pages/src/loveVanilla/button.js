import { Component } from "./component";
import { asyncDebounce } from "./utils";

export default class Button extends Component {
  click = async () => {};

  constructor(id) {
    super(id);
    this.handleClick();
  }

  handleClick() {
    this.getObject().addEventListener(
      "click",
      asyncDebounce(() => this.click(), 150)
    );
  }

  render() {}
}
