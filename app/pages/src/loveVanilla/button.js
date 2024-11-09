import { Component } from "./component";
import { asyncDebounce } from "./utils";

class Button extends Component {
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

export default Button;
