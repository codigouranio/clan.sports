import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ShareIcon from '@mui/icons-material/Share';
import { Button, CardActionArea, CardActions, CardContent, IconButton, Typography } from "@mui/material";
import { Link } from 'react-router-dom';
import { CardActionAreaStyled, MenuCardStyled } from './MenuCardStyled';

const MenuCardTrophyList = ({ card }) =>
  <MenuCardStyled elevation={0} sx={{
    backgroundColor: 'transparent',
    color: '#DAA520'
  }} variant="outlined">
    <CardActionAreaStyled>
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
    </CardActionAreaStyled>
    <CardActions>
      <Button size="small">
        <Link to="trophies/add" style={{ textDecoration: "none", color: "inherit" }}>
          Craft
        </Link>
      </Button>
      <Button size="small">Award</Button>
      <IconButton aria-label="share" LinkComponent={Link}>
        <ShareIcon />
      </IconButton>
    </CardActions>
  </MenuCardStyled >

export default MenuCardTrophyList;