import AllInclusiveIcon from "@mui/icons-material/AllInclusive";
import {
  Card,
  CardActions,
  CardContent,
  Typography
} from "@mui/material";
import { Link } from "react-router-dom";
import { MenuCardStyled } from "./MenuCardStyled";

const MenuCardClanList = ({ card }) =>
  <MenuCardStyled elevation={0} sx={{
    backgroundColor: 'transparent',
    color: 'black'
  }} variant="outlined">
    <Link to="clans" style={{ textDecoration: "none", color: "inherit" }}>
      <CardContent sx={{ cursor: "pointer" }}>
        <Typography sx={{}}>
          <AllInclusiveIcon sx={{ fontSize: "8em" }} />
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
  </MenuCardStyled>

export default MenuCardClanList;
