import MoneyIcon from '@mui/icons-material/Money';
import { Button, CardActions, CardContent, Paper, Typography } from "@mui/material";
import React from "react";
import { Link } from 'react-router-dom';

const MenuCardPoints = ({ card }) =>
  <React.Fragment>
    <Paper elevation={0} sx={{
      backgroundColor: 'transparent',
      color: 'green'
    }}>
      <Link to="points" style={{ textDecoration: "none", color: "inherit" }}>
        <CardContent sx={{ cursor: 'pointer' }}>
          <Typography variant="h5" component="div">
            {card?.description}
          </Typography>
          <Typography variant="body2">
            <MoneyIcon sx={{ fontSize: '12em' }} />
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Current Balance
            <br />
            {card?.currentBalance}
          </Typography>
        </CardContent>
      </Link>
      <CardActions>
        <Button size="small">Buy</Button>
        <Button size="small">Shop</Button>
      </CardActions>
    </Paper>
  </React.Fragment>

export default MenuCardPoints;

