import MoneyIcon from '@mui/icons-material/Money';
import { Button, Card, CardActions, CardContent, Paper, Typography } from "@mui/material";
import React from "react";
import { Link } from 'react-router-dom';

const MenuCardPoints = ({ card }) =>
  <React.Fragment>
    <Card elevation={0} sx={{
      backgroundColor: 'transparent',
      color: 'green'
    }}>
      <Link to="points" style={{ textDecoration: "none", color: "inherit" }}>
        <CardContent sx={{ cursor: 'pointer' }}>
          <Typography variant="body2" sx={{ mb: 0.2 }}>
            <MoneyIcon sx={{ fontSize: '10em' }} />
          </Typography>
          <Typography variant="h3" component="div">
            {card?.description}
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
    </Card>
  </React.Fragment>

export default MenuCardPoints;

