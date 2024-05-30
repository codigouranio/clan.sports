import { Container, Fade, Grid, Grow } from "@mui/material";
import CardAdd from "../CardAdd";
import { TrophyCard } from ".";
import useDataFetching from "../../useDataFetching";

export default function TrophyList() {

  const { data, loading, error } = useDataFetching('/api/trophies');
  const items: any[] = data?.items.trophies;

  return (
    <Container>
      <h1>Trophy List</h1>
      {/* {JSON.stringify(data)} */}
      <Fade in={true} timeout={1000}>
        <Grid container spacing={3} sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Grid item>
            <CardAdd itemType={"Trophy"}></CardAdd>
          </Grid>
          {
            _.map(items, (item: any, index: number) =>
              <Grid item key={index}>
                <TrophyCard trophy_data={item} loading={loading} />
              </Grid>
            )
          }
        </Grid>
      </Fade>
    </Container >
  );
}