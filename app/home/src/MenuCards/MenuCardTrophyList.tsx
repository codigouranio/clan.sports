import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { Button, Card, CardActions, CardContent, Paper, Typography } from "@mui/material";
import React from "react";
import { Link } from 'react-router-dom';

const MenuCardTrophyList = ({ card }) =>
  <React.Fragment>
    <Card elevation={0} sx={{
      backgroundColor: 'transparent',
      color: '#DAA520'
    }}>
      <Link to="trophies" style={{ textDecoration: "none", color: "inherit" }}>
        <CardContent sx={{ cursor: 'pointer' }}>
          <Typography sx={{ mb: 0.2 }}>
            <EmojiEventsIcon sx={{ fontSize: '12em' }} />
          </Typography>
          <Typography variant="h3" component="div">
            {card?.description}
          </Typography>
          <Typography sx={{ mb: 0.1 }} color="text.secondary">
            Awarded {card.sent}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Received {card.received}
          </Typography>
        </CardContent>
      </Link>
      <CardActions>
        <Button size="small">Craft</Button>
        <Button size="small">Award</Button>
      </CardActions>
    </Card>
  </React.Fragment >

export default MenuCardTrophyList;