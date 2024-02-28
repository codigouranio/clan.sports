import Component from "./component";
import { asyncDebounce } from "./utils";

class LoadingBackdrop extends Component {
  constructor(props) {
    super(props);
  }

  isVisible() {
    return this.obj.style.display == "block";
  }

  show(delay = 0) {
    asyncDebounce(() => {
      if (!this.isVisible()) {
        this.obj.style.display = "block";
      }
    }, delay)();
  }

  hide(delay = 0) {
    asyncDebounce(() => {
      if (this.isVisible()) {
        this.obj.style.display = "none";
      }
    }, delay)();
  }

  render() {}
}

export default LoadingBackdrop;
