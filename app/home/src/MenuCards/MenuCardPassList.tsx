import QrCode2Icon from '@mui/icons-material/QrCode2';
import { Button, Card, CardActions, CardContent, Typography } from "@mui/material";
import { Link } from 'react-router-dom';
import { MenuCardStyled } from './MenuCardStyled';

const MenuCardPassList = ({ card }) =>
  <MenuCardStyled elevation={0} sx={{
    backgroundColor: 'transparent',
    color: 'darkgray'
  }} variant="outlined">
    <Link to="passes" style={{ textDecoration: "none", color: "inherit" }}>
      <CardContent sx={{ cursor: 'pointer' }}>
        <Typography sx={{}}>
          <QrCode2Icon sx={{ fontSize: '8em' }} />
        </Typography>
        <Typography variant="h3" component="div">
          {card?.description}
        </Typography>
        <Typography variant="h5" color="text.secondary">
          Current <span>{`${card.current}`}</span>
        </Typography>
        <Typography variant="h5" color="body2">
          Upcoming <span>{`${card.upcoming}`}</span>
        </Typography>
      </CardContent>
    </Link>
    <CardActions>
      <Button size="small">Activate</Button>
    </CardActions>
  </MenuCardStyled>

export default MenuCardPassList;