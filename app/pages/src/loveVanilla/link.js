import { Component } from "./component";
import { asyncDebounce } from "./utils";

export class Link extends Component {
  constructor(id, props) {
    super(id, props);

    this.$object = document.createElement("a");
    this.$object.id = id;
    this.$object.className = props?.className;
    this.$object.href = props?.href;

    this.$object.appendChild(document.createTextNode(props?.text));
    // this.$object.addEventListener("click", this.click.bind(this));

    this.handleClick();
    this.click = this.goToRef;
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

  goToRef(event) {
    event.preventDefault();

    const newUrl = this.props?.href || "#";

    if (newUrl.startsWith("https://")) {
      window.open(newUrl, "_blank");
    } else if (location.href !== newUrl) {
      history.pushState({}, "", newUrl);
      window.dispatchEvent(new Event("__@_popstate_forward"));
    }
  }

  render() {
    return this.getObject();
  }
}
