import { Chip, Container, Divider, Fade, Grid, Grow, Typography } from "@mui/material";
import CardAdd from "../CardAdd";
import { TrophyCard } from ".";
import useDataFetching from "../../useDataFetching";

export default function TrophyList() {

  const { data, loading, error } = useDataFetching('/api/trophies');
  const items: any[] = data?.items.trophies;

  return (
    <Container>
      {/* {JSON.stringify(data)} */}
      <Fade in={true} timeout={1000}>
        <Grid container spacing={3} sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '10px',
        }}>
          <Grid item xs={12} sx={{ padding: '0px' }}>
            <Typography variant="h3" gutterBottom>
              Trophy Showcase
            </Typography>
          </Grid>
          {/* <Grid item xs={6}>

          </Grid> */}
          <Grid item xs={12} sx={{ alignContent: "flex-start" }}>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              {`${items?.stats?.count ?? 0} trophies`}
            </Typography>
            <Chip label="Sort desc by price" />
            <Chip label="Sort desc by creation date" disabled />
          </Grid>

          <Grid item xs={12}>
            {/* <Divider /> */}
          </Grid>
          <Grid item>
            <CardAdd itemType={"Trophy"}></CardAdd>
          </Grid>
          {
            _.map(_.omit(items, "stats"), (item: any, index: number) =>
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