import { Component } from "./";

export class Form extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit();
    this.handleSubmit = () => {};
  }

  setSubmit(submit) {
    this.handleSubmit = submit.bind(this);
    return this;
  }

  handleSubmit() {
    if (this.getObject()) {
      this.getObject().addEventListener("submit", (event) => {
        event.preventDefault();
        this.handleSubmit(this, event);
      });
    }
  }

  getValues() {
    return Object.fromEntries(
      this.children.map((child) => [child.getName(), child.getValue()])
    );
  }
}
