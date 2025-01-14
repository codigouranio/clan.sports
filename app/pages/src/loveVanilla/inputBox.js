import { Component } from "./component";
import { asyncDebounce } from "./utils";

export class InputBox extends Component {
  constructor(id) {
    super(id);

    this.handleKeyDown();
    this.keyDown = () => {};

    this.handleBlur();
    this.blur = () => {};

    this.handleChanged();
    this.changed = () => {};
  }

  setBlur(blur) {
    this.blur = blur.bind(this);
    return this;
  }

  handleBlur() {
    if (this.getObject()) {
      this.getObject().addEventListener(
        "blur",
        asyncDebounce((event) => this.blur(this, event), 150)
      );
    }
  }

  setKeyDown(keyDown) {
    this.keyDown = keyDown.bind(this);
    return this;
  }

  handleKeyDown() {
    if (this.getObject()) {
      this.getObject().addEventListener(
        "keydown",
        asyncDebounce((event) => this.keyDown(this, event), 150)
      );
    }
  }

  setChanged(changed) {
    this.changed = changed.bind(this);
    return this;
  }

  handleChanged() {
    if (this.getObject()) {
      this.getObject().addEventListener(
        "input",
        asyncDebounce((event) => this.changed(this, event), 150)
      );
    }
  }

  setValue(value) {
    if (this.getObject()) {
      this.getObject().value = value;
    }
    return this;
  }

  getValue() {
    if (!this.getObject()) {
      return "";
    }
    return this.getObject().value;
  }

  getName() {
    if (!this.getObject()) {
      return "";
    }
    return this.getObject().getAttribute("name");
  }
}
