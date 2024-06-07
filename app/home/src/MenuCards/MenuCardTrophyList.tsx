import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ShareIcon from '@mui/icons-material/Share';
import { Button, CardActionArea, CardActions, CardContent, IconButton, Typography } from "@mui/material";
import { Link } from 'react-router-dom';
import { MenuCardStyled } from './MenuCardStyled';

const MenuCardTrophyList = ({ card }) =>
  <MenuCardStyled elevation={0} sx={{
    backgroundColor: 'transparent',
    color: '#DAA520'
  }} variant="outlined">
    <CardActionArea>
      <Link to="trophies" style={{ textDecoration: "none", color: "inherit" }}>
        <CardContent sx={{ cursor: 'pointer' }}>
          <Typography sx={{}}>
            <EmojiEventsIcon sx={{ fontSize: '8em' }} />
          </Typography>
          <Typography variant="h3" component="div">
            {card?.description}
          </Typography>
          <Typography variant="h5" color="text.secondary">
            Awarded {card.sent}
          </Typography>
          <Typography variant="h5" color="body2">
            Received {card.received}
          </Typography>
        </CardContent>
      </Link>
    </CardActionArea>
    <CardActions>
      <Button size="small">Craft</Button>
      <Button size="small">Award</Button>
      <IconButton aria-label="share">
        <ShareIcon />
      </IconButton>
    </CardActions>
  </MenuCardStyled>

export default MenuCardTrophyList;