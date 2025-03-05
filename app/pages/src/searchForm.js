import { searchByTerm } from "./fetchApi";
import {
  Form,
  InputBox,
  createDiv,
  getData,
  getUrlParams,
} from "./loveVanilla";

export class SearchForm extends Form {
  constructor(id, props) {
    super(id, props);

    this.searchBox = this.createChild(
      new InputBox("#search-box")
        .setValue(getUrlParams("query") || "")
        .setChanged((self, event) => {
          if (self.getValue() === "") {
            searchByTerm("", 0, 10);
          }
        })
    );

    super.setSubmit(async (form, event) => {
      await searchByTerm(this.getValues()?.["search"], 0, 10);
    });
  }

  render() {
    const data = getData();
    const searchTerm = data?.searchResults?.metadata?.search_term;
    if (searchTerm && searchTerm.length > 0) {
      this.searchBox.setValue(searchTerm);
    }
    return createDiv();
  }
}
