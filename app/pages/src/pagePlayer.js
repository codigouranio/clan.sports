import AppInfo from "./appInfo";
import { Component, getUrlParams, Page } from "./loveVanilla";

export default class PagePlayer extends Page {
  constructor(app, urlMatcher) {
    super(app, urlMatcher);

    this.createChild(new AppInfo("#app-info"));
    this.createChild(new PlayerInfo("#w-board"));
  }

  render() {
    super.render();
  }
}

export class PlayerInfo extends Component {
  constructor(id, props) {
    super(id, props);
  }
  render() {
    const playerName = getUrlParams("player_name");

    const root = document.createElement("div");
    // root.classList.add("player-info");
    // root.classList.add("grid");

    // const section = document.createElement("section");
    // section.innerHTML = `
    // <hgroup>
    //   <h2>Ut sit amet sem ut velit</h2>
    //   <p>Quisque mi est</p>
    // </hgroup>
    // <p>
    // Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque lobortis est vel velit bibendum ultrices. Sed aliquam tortor vel odio fermentum ullamcorper eu vitae neque. Sed non diam at tellus venenatis viverra. Vestibulum et leo laoreet arcu tempor eleifend venenatis ac leo. Pellentesque euismod justo sed nisl sollicitudin varius. Duis venenatis nisl sit amet ante rutrum posuere. Etiam nec ullamcorper leo, sed placerat mauris.
    // </p>
    // <p>
    // <a href="#" onclick="event.preventDefault()">Suspendisse potenti</a><br>
    //   <small>Proin non condimentum tortor. Donec in feugiat sapien.</small>
    // </p>
    // `;
    // root.appendChild(section);
    // grid.appendChild(section);
    // main.appendChild(grid);
    // root.appendChild(main);

    const section = document.createElement("section");
    const hgroup = document.createElement("hgroup");
    section.appendChild(hgroup);
    const h2 = document.createElement("h2");
    const items = playerName.split("_");
    h2.innerText = items[0].concat(" ", items[1]);
    hgroup.appendChild(h2);

    const playerFooter = document.createElement("p");
    section.appendChild(playerFooter);
    const playerFooterSmall = document.createElement("small");
    playerFooterSmall.appendChild(
      document.createTextNode(
        "Proin non condimentum tortor. Donec in feugiat sapien."
      )
    );

    root.appendChild(section);

    // header.classList.add("header");
    // root.appendChild(header);
    // const subheader = document.createElement("hgroup");
    // const h1 = document.createElement("h1");
    // h1.textContent = "Player Info";
    // subheader.appendChild(h1);
    // root.appendChild(header);
    this.renderChild(root);
  }
}
