import CheckCode from "./checkCode";
import RequestCode from "./requestCode";
import "./assets/app.scss";
import "./assets/vendor/foundation";
import "./assets/vendor/jquery";
import "./assets/vendor/what-input";
import LoadingBackdrop from "./loadingBackdrop";

class App {
  constructor() {
    const loadingBackdrop = new LoadingBackdrop("#loading-backdrop");
    this.checkCode = new CheckCode("#check-node");
    this.checkCode.loadingBackdrop = loadingBackdrop;
    this.requestCode = new RequestCode("#request-code");
    this.requestCode.loadingBackdrop = loadingBackdrop;
  }
}

// document.onreadystatechange = function () {
//   if (document.readyState === "complete") {
//     if (document.querySelectorAll("head script").length === 0) {
//       window.dispatchEvent(new Event("DOMContentLoaded"));
//     }
//   }
// };

document.addEventListener("DOMContentLoaded", (event) => {
  new App();
});
