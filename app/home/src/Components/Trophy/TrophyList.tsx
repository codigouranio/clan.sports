import { Grid } from "@mui/material";
import CardAdd from "../CardAdd";

export default function TrophyList() {
  return (
    <div>
      <h1>Trophy List</h1>
      <Grid container spacing={3} sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Grid item>
          <CardAdd itemType={"Trophy"}></CardAdd>
        </Grid>
      </Grid>
    </div>
  );
}