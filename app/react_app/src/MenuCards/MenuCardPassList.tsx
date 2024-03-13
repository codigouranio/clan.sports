import QrCode2Icon from '@mui/icons-material/QrCode2';
import { Button, CardActions, CardContent, Paper, Typography } from "@mui/material";
import React from "react";
import { Link } from 'react-router-dom';

const MenuCardPassList = ({ card }) =>
  <React.Fragment>
    <Paper elevation={0}>
      <Link to="passes" style={{ textDecoration: "none", color: "inherit" }}>
        <CardContent sx={{ cursor: 'pointer' }}>
          <Typography variant="h5" component="div">
            {card?.description}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            <QrCode2Icon />
          </Typography>
          <Typography sx={{ mb: 0.5 }} color="text.secondary">
            Current: <span>{`${card.current}`}</span>
          </Typography>
          <Typography variant="body2">
            Upcoming: <span>{`${card.upcoming}`}</span>
          </Typography>
        </CardContent>
      </Link>
      <CardActions>
        <Button size="small">View</Button>
        <Button size="small">Activate</Button>
      </CardActions>
    </Paper>
  </React.Fragment>

export default MenuCardPassList;