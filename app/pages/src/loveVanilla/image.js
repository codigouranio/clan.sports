import { Component } from "./component";

export class Image extends Component {
  constructor(id, props) {
    super(id, props);

    this.$object = document.createElement("img");
    this.$object.id = id;
    this.$object.className = props?.className;
    this.$object.src = props?.src;
    this.$object.alt = props?.alt;
  }

  render() {}
}
