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
    const paramPlayerName = getUrlParams("player_name");

    const root = document.createElement("div");
    root.classList.add("player-info-container");

    const playerHeaderWrapper = document.createElement("div");
    playerHeaderWrapper.classList.add("player-header-wrapper");
    root.appendChild(playerHeaderWrapper);

    const playerHeader = document.createElement("div");
    playerHeader.classList.add("player-header");
    playerHeaderWrapper.appendChild(playerHeader);

    const playerPicture = document.createElement("img");
    playerPicture.classList.add("player-picture");
    playerPicture.src =
      "https://www.svgrepo.com/show/261565/football-player-soccer-player.svg";
    playerHeader.appendChild(playerPicture);

    const playerData = getUrlParams("player_name");
    const items = playerData.split("_");

    const playerName = document.createElement("div");
    playerName.classList.add("player-name");
    playerName.innerText = items[0].concat(" ", items[1]);
    playerHeader.appendChild(playerName);

    const playerPosition = document.createElement("div");
    playerPosition.classList.add("player-position");
    playerPosition.innerText = "Year # " + items[2];
    playerHeader.appendChild(playerPosition);

    const playerBody = document.createElement("div");
    playerBody.classList.add("player-body");
    root.appendChild(playerBody);

    const playerContent = document.createElement("div");
    playerContent.classList.add("player-content");
    playerBody.appendChild(playerContent);

    // for (let i = 0; i < 10; i++) {
    //   const article1 = document.createElement("div");
    //   article1.classList.add("player-article");
    //   article1.innerHTML =
    //     "no se que están describiendo aquí en el artículo de la página del jugador";
    //   playerContent.appendChild(article1);
    // }

    this.renderChild(root);
  }
}
