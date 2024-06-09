import AllInclusiveIcon from "@mui/icons-material/AllInclusive";
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  IconButton,
  Typography
} from "@mui/material";
import { Link } from "react-router-dom";
import { CardActionAreaStyled, MenuCardStyled } from "./MenuCardStyled";
import ShareIcon from '@mui/icons-material/Share';

const MenuCardClanList = ({ card }) =>
  <MenuCardStyled elevation={0} sx={{
    backgroundColor: 'transparent',
    color: 'black'
  }} variant="outlined">
    <CardActionAreaStyled>
      <Link to="clans" style={{ textDecoration: "none", color: "inherit" }}>
        <CardContent sx={{ cursor: "pointer" }}>
          <Typography sx={{}}>
            <AllInclusiveIcon sx={{ fontSize: "8em" }} />
          </Typography>
          <Typography variant="h3" component="div">
            {card?.description}
          </Typography>
          <Typography variant="h5" color="text.secondary">
            Member of
            <br />
            <span>{`${card.total}`}</span> clans
          </Typography>
        </CardContent>
      </Link>
    </CardActionAreaStyled>
    <CardActions>
      <IconButton aria-label="share">
        <ShareIcon />
      </IconButton>
    </CardActions>
  </MenuCardStyled>

export default MenuCardClanList;
