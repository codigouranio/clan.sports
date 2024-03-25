import AllInclusiveIcon from "@mui/icons-material/AllInclusive";
import {
  Card,
  CardActions,
  CardContent,
  Paper,
  Typography
} from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

const MenuCardClanList = ({ card }) => (
  <React.Fragment>
    <Card elevation={0} sx={{
      backgroundColor: 'transparent',
      color: 'black'
    }}>
      <Link to="clans" style={{ textDecoration: "none", color: "inherit" }}>
        <CardContent sx={{ cursor: "pointer" }}>
          <Typography sx={{ mb: 0.2 }}>
            <AllInclusiveIcon sx={{ fontSize: "10em" }} />
          </Typography>
          <Typography variant="h3" component="div">
            {card?.description}
          </Typography>
          <Typography variant="body2">
            Member of
            <br />
            <span>{`${card.total}`}</span> clans
          </Typography>
        </CardContent>
      </Link>
      <CardActions>

      </CardActions>
    </Card>
  </React.Fragment>
);

export default MenuCardClanList;
