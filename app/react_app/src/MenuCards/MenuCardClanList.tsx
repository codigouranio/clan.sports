import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import { Button, CardActions, CardContent, Paper, Typography } from "@mui/material";
import React from "react";
import { Link } from 'react-router-dom';

const MenuCardClanList = ({ card }) =>
  <React.Fragment>
    <Paper elevation={0}>
      <Link to="clans" style={{ textDecoration: "none", color: "inherit" }}>
        <CardContent sx={{ cursor: 'pointer' }}>
          <Typography variant="h5" component="div">
            {card?.description}
          </Typography>
          {/* <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
        My groups and friends
      </Typography> */}
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            <AllInclusiveIcon />
          </Typography>
          <Typography variant="body2">
            Member of
            <br />
            <span>{`${card.total}`}</span> clans
          </Typography>
        </CardContent>
      </Link>
      <CardActions>
        <Button size="small">View</Button>
      </CardActions>
    </Paper>
  </React.Fragment>

export default MenuCardClanList;