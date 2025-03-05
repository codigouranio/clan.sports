import EasyMDE from "easymde";
import moment from "moment";
import { Component, createDiv, getData } from "./loveVanilla";

export class BlockPlayerInfo extends Component {
  constructor(id, props) {
    super(id, props);

    console.log("Editor rendered successfully");
    this.mde = createDiv({
      id: "player-article-editor-parent",
      className: "player-article-editor-parent",
    }).add(
      (this.mdeChild = createDiv({
        id: "player-article-editor",
        className: "player-article-editor",
        type: "textarea",
      }))
    );
    this.mdeEditor = new EasyMDE({
      element: this.mdeChild,
      maxHeight: "500px",
      minWidth: "500px",
      toolbar: [
        "bold",
        "italic",
        "heading",
        "|",
        "quote",
        "heading-smaller",
        "heading-bigger",
        "horizontal-rule",
        {
          name: "others",
          className: "fa fa-blind",
          title: "others buttons",
          children: [
            {
              name: "image",
              action: EasyMDE.drawImage,
              className: "fa fa-picture-o",
              title: "Image",
            },
            {
              name: "quote",
              action: EasyMDE.toggleBlockquote,
              className: "fa fa-percent",
              title: "Quote",
            },
            {
              name: "link",
              action: () => {
                alert("Link");
              },
              className: "fa fa-link",
              title: "Link",
            },
          ],
        },
      ],
    });
  }
  render() {
    const { current_item } = getData();

    if (!current_item) {
      return;
    }

    const root = createDiv({
      id: "artifact-container",
      className: "artifact-container",
    })
      .add(
        createDiv({
          className: "artifact-header-wrapper",
          type: "article",
        })
          .add(
            createDiv({ className: "artifact-header" })
              .add(
                createDiv({ className: "artifact-info" }).add(
                  createDiv({ className: "artifact-key" })
                    .add(
                      createDiv({ className: "artifact-name" }).add(
                        "span",
                        current_item?.name,
                        "player-name"
                      )
                    )
                    .add(
                      createDiv({ className: "artifact-sub-name" })
                        .add(
                          "span",
                          current_item?.shirt_num || "#",
                          "player-number"
                        )
                        .add(
                          "span",
                          "Year " + current_item?.year,
                          "player-year"
                        )
                    )
                    .add("small", "Player", "artifact-type")
                )
              )
              .add(
                createDiv({ className: "artifact-menu" })
                  .add(
                    createDiv({
                      className: "follow-button",
                      type: "button",
                      text: "Claim",
                    })
                  )
                  .add(
                    createDiv({
                      className: "follow-button",
                      type: "button",
                      text: "Follow",
                    })
                  )
                  .add(createDiv({ className: "follower-count", text: "0" }))
              )
          )
          .add(
            createDiv({
              type: "footer",
              text: `Last updated: ${moment().format("MMMM Do YYYY")}`,
            })
          )
      )
      .add(
        createDiv({ className: "player-body", type: "article" }).add(
          createDiv({ className: "player-content" }).add(
            createDiv({
              id: "player-article",
              className: "player-article",
            }).noop(this.mde)
          )
        )
      )
      .noop(
        createDiv({ type: "footer" }).add(
          createDiv({ className: "profile-ownership" })
            .add(
              createDiv({ type: "p", className: "ownership-status" })
                .addText("Controlled by: ")
                .add(
                  createDiv({
                    type: "span",
                    id: "ownership-label",
                    text: "System",
                  })
                )
            )
            .add(
              createDiv({
                id: "change-ownership",
                className: "ownership-button",
                type: "button",
                text: "Claim",
              })
            )
        )
      );

    return root;
  }

  afterRender() {}
}
