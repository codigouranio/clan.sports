import MoneyIcon from '@mui/icons-material/Money';
import { Button, Card, CardActionArea, CardActions, CardContent, Typography } from "@mui/material";
import { Link } from 'react-router-dom';
import { CardActionAreaStyled, MenuCardStyled } from './MenuCardStyled';

const MenuCardPoints = ({ card }) =>
  <MenuCardStyled elevation={0} sx={{
    backgroundColor: 'transparent',
    color: 'green'
  }} variant="outlined">
    <CardActionAreaStyled>
      <Link to="points" style={{ textDecoration: "none", color: "inherit" }}>
        <CardContent sx={{ cursor: 'pointer' }}>
          <Typography sx={{}}>
            <MoneyIcon sx={{ fontSize: '8em' }} />
          </Typography>
          <Typography variant="h3" component="div">
            {card?.description}
          </Typography>
          <Typography variant="h5" color="text.secondary">
            Current Balance
            <br />
            {card?.currentBalance}
          </Typography>
        </CardContent>
      </Link>
    </CardActionAreaStyled>
    <CardActions>
      <Button size="small">Buy</Button>
      <Button size="small">Shop</Button>
    </CardActions>
  </MenuCardStyled>

export default MenuCardPoints;

