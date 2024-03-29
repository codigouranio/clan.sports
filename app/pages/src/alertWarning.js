import Component from "./loveVanilla/component";
import Button from "./loveVanilla/button";
import { setData, getData } from "./loveVanilla/data";

class AlertWarning extends Component {
  constructor(props) {
    super(props);

    this.label = new Component(".label");
    this.button = new Button("#request-new-code-button");
    this.button.click = () =>
      setData({
        ...getData(),
        ...{
          requestedCode: null,
        },
      });
  }

  setText(text) {
    this.label.setText(text);
  }

  reset() {
    this.label.setText("");
    this.hide();
  }
}

export default AlertWarning;
