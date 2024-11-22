import { Component } from "./loveVanilla";

export default class Loading extends Component {
  constructor() {
    super("loading-screen", {});
  }

  render() {
    const loading = document.createElement("div");
    loading.id = this.id;
    const ball = document.createElement("img");
    ball.src = "img/soccer-ball.svg";
    ball.alt = "Loading Spinner";
    ball.classList.add("spinner");
    loading.appendChild(ball);
    this.$object = loading;
    return loading;
  }
}
