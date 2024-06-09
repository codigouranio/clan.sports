import GroupIcon from '@mui/icons-material/Group';
import { Button, Card, CardActionArea, CardActions, CardContent, Typography } from "@mui/material";
import { Link } from 'react-router-dom';
import { CardActionAreaStyled, MenuCardStyled } from './MenuCardStyled';

const MenuCardProfileList = ({ card }) =>
  <MenuCardStyled elevation={0} sx={{
    backgroundColor: 'transparent',
    color: 'purple'
  }} variant="outlined">
    <CardActionAreaStyled>
      <Link to="profiles" style={{ textDecoration: "none", color: "inherit" }}>
        <CardContent sx={{ cursor: 'pointer' }}>
          <Typography sx={{}}>
            <GroupIcon sx={{ fontSize: '8em' }} />
          </Typography>
          <Typography variant="h3" component="div">
            {card?.description}
          </Typography>
          <Typography variant="h5" color="text.secondary">
            <br />
            Total <span>{`${card.total}`}</span>
          </Typography>
          {/* <Typography variant="h5" color="body2">
            Received {card.received}
          </Typography> */}
          {/* <Typography variant="h5" color="text.secondary">
            Total <span>{`${card.total}`}</span>
          </Typography>
          <Typography variant="h5" color="text.secondary">
            <span>...</span>
          </Typography> */}
        </CardContent>
      </Link>
    </CardActionAreaStyled>
    <CardActions>
      <Button size="small">Transfer</Button>
    </CardActions>
  </MenuCardStyled>

export default MenuCardProfileList;