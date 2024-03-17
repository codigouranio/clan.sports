import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import { Button, Card, CardActions, CardContent, Typography } from "@mui/material";
import React from "react";
import { Link } from 'react-router-dom';

const MenuCardBadgeList = ({ card }) =>
  <React.Fragment>
    <Card elevation={0} sx={{
      backgroundColor: 'transparent',
      color: 'blue'
    }}>
      <Link to="badges" style={{ textDecoration: "none", color: "inherit" }}>
        <CardContent sx={{ cursor: 'pointer' }}>
          <Typography sx={{ mb: 0.2 }}>
            <WorkspacePremiumIcon sx={{ fontSize: '12em', mb: '0em' }} />
          </Typography>
          <Typography variant="h3" component="div">
            {card?.description}
          </Typography>
          <Typography sx={{ mb: 0.1 }} color="text.secondary">
            Issued {card.sent}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Earned {card.received}
          </Typography>
        </CardContent>
      </Link>
      <CardActions>
        <Button size="small">Create</Button>
        <Button size="small">Issue</Button>
      </CardActions>
    </Card>
  </React.Fragment >

export default MenuCardBadgeList;