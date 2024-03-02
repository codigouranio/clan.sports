import "./assets/app.scss";
import CheckCode from "./checkCode";
import LoadingBackdrop from "./loadingBackdrop";
import RequestCode from "./requestCode";
import Component from "./loveVanilla/component";

class App extends Component {
  constructor() {
    super();
    this.createChild(new LoadingBackdrop("#loading-backdrop"));
    this.createChild(new RequestCode("#request-code"));
    this.createChild(new CheckCode("#check-code"));
  }
}

// document.onreadystatechange = function () {
//   if (document.readyState === "complete") {
//     if (document.querySelectorAll("head script").length === 0) {
//       window.dispatchEvent(new Event("DOMContentLoaded"));
//     }
//   }
// };

document.addEventListener("DOMContentLoaded", () => {
  new App().init();
});
