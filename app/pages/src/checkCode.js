import AlertWarning from "./alertWarning";
import Button from "./loveVanilla/button";
import Component from "./loveVanilla/component";
import { getData, setData } from "./loveVanilla/data";
import LoadingBarSpinner from "./loadingBarSpinner";

class CheckCode extends Component {
  constructor(id) {
    super(id);

    this.checkCodeAlertWarning = this.createChild(
      new AlertWarning("#check-code-alert-warning")
    );
    this.checkCodeButton = this.createChild(new Button("#check-code-button"));
    this.loadingBarSpinner = this.createChild(
      new LoadingBarSpinner("#loading-bar-spinner")
    );

    this.checkCodeButton.click = async () => {
      this.checkCodeAlertWarning.reset();
      this.loadingBackground.show();
      this.loadingBarSpinner.show();
      // this.disable(true);
      const resp = await this.request(getData()?.form);
      this.loadingBarSpinner.hide(500);
      this.loadingBackground.hide(800);
      if (resp && resp?.success) {
        window.location.href = "/app";
      } else {
        this.checkCodeAlertWarning.setText(`Code is not correct`);
        this.checkCodeAlertWarning.show(1000);
      }
    };

    // Get all input elements with clas "code-input"
    this.codeInputs = this.obj.querySelectorAll(`input`);

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
  }

  init() {
    super.init();
    this.loadingBackground = this.getParent().getChild("#loading-backdrop");

    setData({
      ...getData(),
      ...{
        form: {
          checkCode: ["0", "0", "0", "0", "0", "0"],
        },
      },
    });
  }

  focus() {
    this.codeInputs.length > 0 && this.codeInputs[0].focus();
  }

  render() {
    const { requestedCode } = getData();
    console.log(requestedCode);
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
    return resp;
  }
}

export default CheckCode;
