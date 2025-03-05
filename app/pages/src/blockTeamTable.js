import {
  Component,
  createHeader,
  createRow,
  createTable,
  getData,
  Link,
} from "./loveVanilla";

export class BlockTeamTable extends Component {
  render() {
    const {
      current_item: { teams, name },
    } = getData();

    const table = createTable({ className: "team-table" })
      .add(createHeader({ headers: ["#Rank", "Name", "Gender", "Year"] }))
      .addBody(
        teams.map((team, i) => {
          return createRow()
            .addCell(team?.rank_num)
            .addCell(
              new Link(`team-link-${i}`, {
                href: `/?${new URLSearchParams({
                  unique_id: team?.unique_id,
                }).toString()}`,
                text: team?.name || "No name",
              })
            )
            .addCell(
              team?.players
                ? `${team?.gender} (${team?.total_players})`
                : team?.gender
            )
            .addCell(team?.year);
        })
      );

    return table;
  }
}
