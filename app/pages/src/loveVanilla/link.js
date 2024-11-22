import { Component } from "./component";

export class Link extends Component {
  constructor(id, props) {
    super(id, props);

    this.$object = document.createElement("a");
    this.$object.id = id;
    this.$object.className = props?.className;
    this.$object.href = props?.href;

    this.$object.appendChild(document.createTextNode(props?.text));
    this.$object.addEventListener("click", this.click.bind(this));
  }

  click(event) {
    event.preventDefault();

    const newUrl = this.props?.href;

    if (newUrl.startsWith("https://")) {
      window.open(newUrl, "_blank");
    } else if (location.href !== newUrl) {
      history.pushState({}, "", newUrl);
      window.dispatchEvent(new Event("__@_popstate_forward"));
    }
  }

  render() {
    console.log("Link");
  }
}
