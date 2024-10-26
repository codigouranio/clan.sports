import Component from "./loveVanilla/component";
import { getData } from "./loveVanilla/data";

class YearList extends Component {
  constructor(id) {
    super(id);
  }

  async init() {
    super.init();
  }

  render() {
    const years = getData()?.filterTerms?.years || {};

    this.options = Object.keys(years).map((key) => {
      const option = document.createElement("option");
      option.value = key;
      option.textContent = years[key];
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

export default YearList;
