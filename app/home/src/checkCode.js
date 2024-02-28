import CheckCodeButton from "./checkCodeButton";
import Component from "./component";
import { getData, setData } from "./data";
import LoadingBarSpinner from "./loadingBarSpinner";
import AlertWarning from "./alertWarning";

class CheckCode extends Component {
  constructor(id) {
    super(id);

    this.checkCodeAlertWarning = new AlertWarning("#check-code-alert-warning");

    this.checkCodeButton = new CheckCodeButton("#check-code-button");
    this.checkCodeButton.click = async () => {
      console.log(getData());
      this.checkCodeAlertWarning.reset();
      this.loadingBackdrop.show();
      this.loadingBarSpinner.show();
      this.disable(true);
      const resp = await this.request(getData()?.form);
      if (resp && resp?.success) {
        window.location.href = "/app";
      } else {
        this.checkCodeButton.hide();
        this.checkCodeAlertWarning.setText(`Code is not correct`);
        this.checkCodeAlertWarning.show(1000);
      }
      this.loadingBackdrop.hide(900);
      this.loadingBarSpinner.hide(800);
      this.disable(false);
    };

    // Get all input elements with class "code-input"
    this.codeInputs = document.querySelectorAll(".code-input");

    setData({
      ...getData(),
      ...{
        form: {
          checkCode: ["0", "0", "0", "0", "0", "0"],
        },
      },
    });

    // Add input event listener to each input element
    this.codeInputs.forEach((input, index) => {
      input.addEventListener("input", (event) => {
        const checkCode = getData()?.form?.checkCode;
        checkCode[index] = event.target.value.trim();
        setData({
          ...getData(),
          ...{
            form: {
              checkCode: checkCode,
            },
          },
        });

        // Get the entered value
        var enteredValue = event.target.value.trim();
        // If the entered value is a number and the length of the value is 1
        if (!isNaN(enteredValue) && enteredValue.length === 1) {
          // If there's a next input element, move focus to it
          if (index < this.codeInputs.length - 1) {
            var nextInput = this.codeInputs[index + 1];
            nextInput.focus();
            // Select the content of the next input box
            nextInput.select();
          }
        }
      });
    });

    this.loadingBarSpinner = new LoadingBarSpinner("#loading-bar-spinner");
  }

  focus() {
    this.codeInputs.length > 0 && this.codeInputs[0].focus();
  }

  render() {
    const { requestedCode } = getData();
    if (requestedCode) {
      this.show();
    } else {
      this.hide();
    }
  }

  show() {
    if (!this.isVisible()) {
      super.show();
      this.checkCodeButton.show();
      this.checkCodeAlertWarning.hide();
    }
  }

  disable(disabled) {
    this.codeInputs.forEach((input, index) => (input.disabled = disabled));
  }

  handleChangedVisibility(visible) {
    if (visible) {
      this.focus();
      this.codeInputs.forEach((input) => (input.value = ""));
    }
  }

  async request(form) {
    const { checkCode } = form;
    const strCheckCode = checkCode.join("");
    if (strCheckCode == "000000") {
      return;
    }
    const { requestedCode } = getData();
    const response = await fetch("/api/checkCode", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify({
        code: strCheckCode,
        sessionId: requestedCode?.sessionId,
      }),
    });
    const resp = await response.json();
    console.log(resp);
    return resp;
  }
}

export default CheckCode;
