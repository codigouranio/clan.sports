import sanitizeHtml from "sanitize-html";
import { searchByTerm } from "./fetchApi";
import { Component, createDiv, getData, Image, Link } from "./loveVanilla";

class HitList extends Component {
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
      const clubItem = new HitItem(`club_${counter}`, {
        ...{ keys: [item?.club_name] },
        ...{ parent: this },
        ...item,
      });
      results.add(clubItem);
      counter++;
    }

    if (searchResults?.metadata?.more_results) {
      results.add(new MoreResults());
    }

    return this.renderChild(results);
  }
}

class HitItem extends Component {
  render() {
    const params = new URLSearchParams();
    params.set("unique_id", this.props.unique_id);

    return createDiv({ type: "article", className: "club-info" })
      .add(
        createDiv({ type: "header" })
          .add(
            new Image(`club-logo-${this.id}`, {
              title: this.props.name,
              alt: this.props.name,
              className: "club-logo",
              src: `/api/getClubLogo/${this.props.image_file}`,
            })
          )
          .add(
            createDiv({ type: "div", className: "item-details" })
              .add(
                new Link("club-link", {
                  href: `/?${params.toString()}`,
                  text: this.props.name,
                  className: "search-title",
                })
              )
              .add(
                createDiv({ type: "small", className: "rank" }).addText(
                  `${this.props.item_type} - Rank: ${this.props.rank_num}`
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
  constructor(id, props) {
    super(id, props);

    this.defaultPageSize = 10;
  }

  render() {
    return this.renderChild(
      new Link("more-results", { text: "More Results..." }).setClick(
        async () => {
          const {
            searchResults: {
              metadata: { search_term, page, page_size, state },
            },
          } = getData();

          await searchByTerm(
            search_term,
            page,
            page_size + this.defaultPageSize,
            state,
            false
          );
        }
      )
    );
  }
}

export default HitList;
