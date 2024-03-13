import { Button, CardActions, CardContent, Paper, Typography } from "@mui/material";
import React from "react";

const MenuCard = ({ card }) =>
  <React.Fragment>
    <Paper elevation={0}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {card?.title}
        </Typography>
        <Typography variant="h5" component="div">
          {card?.description}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          sent: (0)
          received: (1)
        </Typography>
        <Typography variant="body2">
          well meaning and kindly.
          <br />
          {'"a benevolent smile"'}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Send</Button>
      </CardActions>
    </Paper>
  </React.Fragment>

export default MenuCard;