import Component from "./loveVanilla/component";
import { getData } from "./loveVanilla/data";

class StateList extends Component {
  constructor(id) {
    super(id);
  }

  async init() {
    super.init();
  }

  render() {
    const currentState = getData()?.currentState;

    const states = getData()?.filterTerms?.states || {};

    this.options = Object.keys(states).map((key) => {
      const option = document.createElement("option");
      option.value = key;
      option.textContent = states[key];

      if (currentState === option.textContent) {
        option.selected = true;
      }

      return option;
    });

    const elements = this.obj.children; // Get HTMLCollection of child elements

    // Convert HTMLCollection to an array and loop through it in reverse
    for (let i = elements.length - 1; i >= 0; i--) {
      if (elements[i].disabled) {
        continue;
      }
      this.obj.removeChild(elements[i]); // Remove each element
    }

    this.options.forEach((option) => {
      this.obj.appendChild(option);
    });
  }
}

export default StateList;
