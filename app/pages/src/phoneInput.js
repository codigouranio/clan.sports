import intlTelInput from "intl-tel-input";
import "intl-tel-input/build/css/intlTelInput.css";
import "intl-tel-input/build/js/utils";

import Component from "./loveVanilla/component";
import { getData, setData } from "./loveVanilla/data";

class PhoneInput extends Component {
  constructor(id) {
    super(id);

    const op = () => {
      setData({
        ...getData(),
        ...{
          form: {
            ...getData().form,
            phoneNumber: this.iti.getNumber(),
            isValidNumber: this.iti.isValidNumber(),
            isValidNumberPrecise: this.iti.isValidNumberPrecise(),
          },
        },
      });
    };

    this.obj.addEventListener("change", op);
    this.obj.addEventListener("keydown", op);
    this.obj.addEventListener("paste", op);
    this.obj.addEventListener("input", op);
  }

  init() {
    this.iti = intlTelInput(this.obj, {
      preferredCountries: ["us", "ca"],
      separateDialCode: true,
      utilsScript: "intl-tel-input/build/js/utils.js",
    });
  }

  reset() {
    this.iti.setNumber("");
  }

  render() {}
}

export default PhoneInput;
