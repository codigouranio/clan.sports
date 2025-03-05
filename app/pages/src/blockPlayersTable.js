import AppInfo from "./appInfo";
import { getClubInfo } from "./fetchApi";
import LoginMenu from "./loginMenu";
import {
  Component,
  createDiv,
  createHeader,
  createImg,
  createList,
  createRow,
  createSpan,
  createTable,
  getData,
  getUrlParams,
  Link,
  Page,
} from "./loveVanilla";

export class BlockPlayersTable extends Component {
  render() {
    const { current_item } = getData();

    if (!current_item) {
      return;
    }

    const table = createTable({ className: "players-table" })
      .add(createHeader({ headers: ["#Num", "Name", "Goals"] }))
      .addBody(
        current_item.players.map((player, i) => {
          const searchParams = new URLSearchParams({
            q: `${player.name} ${player.year} soccer`,
          });
          const playerParams = new URLSearchParams({
            player_name: `${player.name}_${player.year}`,
          });
          return createRow()
            .addCell(player.shirt)
            .addCell(
              createSpan()
                .add(
                  new Link(`player-search-${i}`, {
                    href: `https://www.google.com/search?${searchParams
                      .toString()
                      .toLowerCase()}`,
                    text: "🔍",
                    className: "player-search-google",
                  })
                )
                .add(
                  new Link(`player-link-${i}`, {
                    href: `?unique_id=${player.unique_id}`,
                    text: `${player.name}`,
                    className: "player-page",
                  })
                ),
              "table-col-player-name"
            )
            .addCell(player.total_goals);
        })
      );
    return table;
  }
}
