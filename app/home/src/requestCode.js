import Component from "./component";
import { getData, setData } from "./data";
import PhoneInput from "./phoneInput";
import RequestCodeButton from "./requestCodeButton";

class RequestCode extends Component {
  constructor(id) {
    super(id);
    this.requestCodeButton = new RequestCodeButton("#request-code-button");
    this.requestCodeButton.click = async () => {
      await this.request(getData()?.form || {});
    };
    this.phoneInput = new PhoneInput("#phone");
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
