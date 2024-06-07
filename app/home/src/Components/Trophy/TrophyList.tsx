import { Button, Chip, Container, Fade, Grid, Menu, MenuItem, Typography } from "@mui/material";
import { TrophyCard } from ".";
import useDataFetching from "../../useDataFetching";
import CardAdd from "../CardAdd";
import Abc from '@mui/icons-material/Abc';
import React from "react";

export default function TrophyList() {

  const { data, loading, error } = useDataFetching('/api/trophies');
  const items: any[] = data?.items.trophies;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

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
          <Grid item xs={6}>
            <Typography variant="h4" color="text.secondary" gutterBottom>
              {`${items?.x?.count ?? 0} trophies`}
            </Typography>
          </Grid>
          <Grid item xs={6} sx={{ alignContent: "flex-start" }}>
            <Button
              id="basic-button"
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
            >
              {`Sort by ${'Top Rated'}`}
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <MenuItem onClick={handleClose}>Top Rated</MenuItem>
              <MenuItem onClick={handleClose}>Lowest Rated</MenuItem>
              <MenuItem onClick={handleClose}>Newest</MenuItem>
              <MenuItem onClick={handleClose}>Oldest</MenuItem>
            </Menu>
          </Grid>
          <Grid item xs={12}>
            <Abc />
            {/* <Divider /> */}
          </Grid>
          <Grid item>
            <CardAdd itemType={"Trophy"}></CardAdd>
          </Grid>
          {
            _.map(_.omit(items, "x"), (item: any, index: number) =>
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