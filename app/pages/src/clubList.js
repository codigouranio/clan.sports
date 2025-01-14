import sanitizeHtml from "sanitize-html";
import { searchClubsBySearchTerm } from "./fetchApi";
import { Component, createDiv, getData, Image, Link } from "./loveVanilla";

class ClubList extends Component {
  render() {
    const { searchResults, currentState, currentStateName } = getData();
    if (!searchResults) {
      return;
    }

    const results = createDiv();

    if (searchResults && searchResults.total == 0) {
      return this.renderChild(results.addText("No results found"));
    }

    if (searchResults && searchResults.total > 0) {
      let label = "Results";
      const resultsLabel = createDiv({ type: "p" });
      label = `Results found in ${searchResults.execution_time}s`;

      if (
        currentStateName &&
        currentStateName.length > 0 &&
        searchResults?.search_term === currentState
      ) {
        label += ` for ${currentStateName}`;
      }

      results.addText(label);
      results.add(resultsLabel);
    }

    let counter = 0;
    for (const item of searchResults?.items) {
      const clubItem = new ClubItem(`club_${counter}`, {
        ...{ keys: [item?.club_name] },
        ...{ parent: this },
        ...item,
      });
      results.add(clubItem);
      counter++;
    }

    if (searchResults.more_results) {
      results.add(new MoreResults());
    }

    return this.renderChild(results);
  }
}

class ClubItem extends Component {
  render() {
    const params = new URLSearchParams();
    params.set("club_name", this.props.club_name);

    return createDiv({ type: "article", className: "club-info" })
      .add(
        createDiv({ type: "header" })
          .add(
            new Image(`club-logo-${this.id}`, {
              title: this.props.club_name,
              alt: this.props.club_name,
              className: "club-logo",
              src: `/api/getClubLogo/${this.props.image_file}`,
            })
          )
          .add(
            createDiv({ type: "div", className: "item-details" })
              .add(
                new Link("club-link", {
                  href: `/?${params.toString()}`,
                  text: this.props.search_title,
                  className: "search-title",
                })
              )
              .add(
                createDiv({ type: "small", className: "rank" }).addText(
                  `Soccer Club - Rank: ${this.props.rank}`
                )
              )
          )
      )
      .add(createDiv().setHtml(this.props?.info))
      .add(
        createDiv({
          type: "footer",
          text: `Last updated: ${this.props?.last_update}`,
        })
      );
  }
}

class MoreResults extends Component {
  render() {
    return this.renderChild(
      new Link("more-results", { text: "More Results..." }).setClick(
        async () => {
          const {
            searchResults: { page, page_size, search_term },
          } = getData();

          await searchClubsBySearchTerm(search_term, page + 1, page_size, true);
        }
      )
    );
  }
}

export default ClubList;
