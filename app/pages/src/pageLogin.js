import AppInfo from "./appInfo";
import { requestCode, verifyCode } from "./fetchApi";
import {
  Button,
  Component,
  getData,
  InputBox,
  isValidEmail,
  navigateTo,
  Page,
  setData,
} from "./loveVanilla";

class PageLogin extends Page {
  constructor(app, matcher) {
    super(app, matcher);

    this.createChild(new AppInfo("#app-info"));

    this.sendCodeButton = this.createChild(
      new Button("#request-code").setClick(async () => {
        const requestedCode = getData()?.requestedCode;
        const isValidEmail = requestedCode?.emailValid;
        if (isValidEmail) {
          const email = requestedCode?.email;
          if (email) {
            const resp = await requestCode(email, "+19000000001");
            setData({
              requestCodeResp: resp,
            });
          }
        }
      })
    );

    this.createChild(
      new Component("#error-message").setUpdatedData((self) => {
        const requestCodeResp = getData()?.requestCodeResp;
        if (requestCodeResp?.Success) {
          self.setText("");
        } else {
          self.setText(requestCodeResp?.Message);
        }
      })
    );

    this.emailInput = this.createChild(
      new InputBox("#email").setBlur((self) => {
        if (isValidEmail(self.getValue())) {
          setData({
            requestedCode: {
              email: self.getValue(),
              emailValid: true,
            },
            requestCodeResp: {},
          });
          self.setAttribute("aria-invalid", "false");
        } else {
          setData({
            requestedCode: {
              email: self.getValue(),
              emailValid: false,
            },
            requestCodeResp: {},
          });
          self.setAttribute("aria-invalid", "true");
        }
      })
    );

    this.emailInput.createChild(
      new Component("#email-helper").setUpdatedData((self) => {
        const requestedCode = getData()?.requestedCode;
        if (requestedCode.emailValid == false) {
          self.setText("Invalid email");
        } else {
          self.setText("");
        }
      })
    );

    this.codeInput = this.createChild(
      new InputBox("#code")
        .setBlur((self) => {
          setData({
            requestedCode: {
              code: self.getValue(),
            },
          });
        })
        .setUpdatedData((self) => {
          if (getData()?.requestCodeResp?.Success) {
            self.enable();
          } else {
            self.disable();
          }
        })
    );

    this.verifyCodeButton = this.createChild(
      new Button("#verify-code")
        .setClick(async () => {
          const requestedCode = getData()?.requestedCode;
          const requestCodeResp = getData()?.requestCodeResp;
          const resp = await verifyCode(
            requestCodeResp?.Email,
            requestCodeResp?.PhoneNumber,
            requestedCode?.code,
            requestCodeResp?.ChallengeName,
            requestCodeResp?.Session
          );

          if (resp.Success) {
            setData({
              session: {
                authentication: resp["Authentication"],
                user: resp["User"],
              },
            });

            navigateTo("/");
          }
        })
        .setUpdatedData((self) => {
          console.log(getData());
          if (getData()?.requestCodeResp?.Success) {
            self.enable();
          } else {
            self.disable();
          }
        })
    );
  }
}

export default PageLogin;
