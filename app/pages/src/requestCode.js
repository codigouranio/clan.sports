import LoadingBarSpinner from "./loadingBarSpinner";
import PhoneInput from "./phoneInput";
import Button from "./loveVanilla/button";
import Component from "./loveVanilla/component";
import { getData, setData } from "./loveVanilla/data";

class RequestCode extends Component {
  constructor(id) {
    super(id);

    this.phoneInput = this.createChild(new PhoneInput("#phone"));
    this.loadingBarSpinner = this.createChild(
      new LoadingBarSpinner("#loading-bar-spinner")
    );
    this.requestCodeButton = this.createChild(
      new Button("#request-code-button")
    );
    this.requestCodeButton.click = async () => {
      try {
        this.loadingBarSpinner.show();
        this.loadingBackground.show();
        await this.request(getData()?.form || {});
      } catch (e) {
        console.error(e);
      }
      this.loadingBarSpinner.hide(500);
      this.loadingBackground.hide(800);
    };
  }

  init() {
    super.init();
    this.loadingBackground = this.getParent().getChild("#loading-backdrop");
  }

  async request(form) {
    const { phoneNumber, isValidNumberPrecise } = form;
    if (!phoneNumber || !isValidNumberPrecise) {
      return;
    }
    console.log("request", phoneNumber);
    const response = await fetch("/api/requestCode", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify({
        phoneNumber,
      }),
    });
    const resp = await response.json();
    setData({
      ...getData(),
      ...{
        requestedCode: resp,
      },
    });
    return resp;
  }

  render() {
    const { requestedCode } = getData();
    if (requestedCode) {
      this.hide();
      this.phoneInput.reset();
    } else {
      this.show();
    }
  }
}

export default RequestCode;
