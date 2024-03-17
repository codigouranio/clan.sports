import QrCode2Icon from '@mui/icons-material/QrCode2';
import { Button, Card, CardActions, CardContent, Paper, Typography } from "@mui/material";
import React from "react";
import { Link } from 'react-router-dom';

const MenuCardPassList = ({ card }) =>
  <React.Fragment>
    <Card elevation={0} sx={{
      backgroundColor: 'transparent',
      color: 'darkgray'
    }}>
      <Link to="passes" style={{ textDecoration: "none", color: "inherit" }}>
        <CardContent sx={{ cursor: 'pointer' }}>
          <Typography sx={{ mb: 0.2 }}>
            <QrCode2Icon sx={{ fontSize: '12em' }} />
          </Typography>
          <Typography variant="h3" component="div">
            {card?.description}
          </Typography>
          <Typography sx={{ mb: 0.5 }} color="text.secondary">
            Current <span>{`${card.current}`}</span>
          </Typography>
          <Typography variant="body2">
            Upcoming <span>{`${card.upcoming}`}</span>
          </Typography>
        </CardContent>
      </Link>
      <CardActions>
        <Button size="small">Activate</Button>
      </CardActions>
    </Card>
  </React.Fragment>

export default MenuCardPassList;