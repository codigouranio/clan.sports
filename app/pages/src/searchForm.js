import { searchClubsBySearchTerm } from "./fetchApi";
import { Form, InputBox, getUrlParams } from "./loveVanilla";

export class SearchForm extends Form {
  constructor(id, props) {
    super(id, props);

    this.searchBox = this.createChild(
      new InputBox("#search-box")
        .setValue(getUrlParams("query") || "")
        .setChanged((self, event) => {
          if (self.getValue() === "") {
            searchClubsBySearchTerm("");
          }
        })
    );

    super.setSubmit(async (form, event) => {
      await searchClubsBySearchTerm(this.getValues()?.["search"]);
    });
  }

  render() {
    return;
  }
}
