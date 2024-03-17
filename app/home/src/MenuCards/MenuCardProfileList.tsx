import GroupIcon from '@mui/icons-material/Group';
import { Button, CardActions, CardContent, Paper, Typography } from "@mui/material";
import React from "react";
import { Link } from 'react-router-dom';

const MenuCardProfileList = ({ card }) =>
  <React.Fragment>
    <Paper elevation={0}>
      <Link to="profiles" style={{ textDecoration: "none", color: "inherit" }}>
        <CardContent sx={{ cursor: 'pointer' }}>
          <Typography variant="h5" component="div">
            {card?.description}
          </Typography>
          <Typography sx={{ mb: 1.5 }}>
            <GroupIcon sx={{ fontSize: '12em' }} />
          </Typography>
          <Typography variant="body2">
            Managing
            <br />
            <span>{`${card.total}`}</span> profiles
          </Typography>
        </CardContent>
      </Link>
      <CardActions>
        <Button size="small">Transfer</Button>
      </CardActions>
    </Paper>
  </React.Fragment>

export default MenuCardProfileList;