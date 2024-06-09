import ShareIcon from '@mui/icons-material/Share';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import { Button, CardActionArea, CardActions, CardContent, IconButton, Typography } from "@mui/material";
import { Link } from 'react-router-dom';
import { CardActionAreaStyled, MenuCardStyled } from './MenuCardStyled';

const MenuCardBadgeList = ({ card }) =>
  <MenuCardStyled elevation={0} sx={{
    backgroundColor: 'transparent',
    color: 'blue'
  }} variant="outlined">
    <CardActionAreaStyled>
      <Link to="badges" style={{ textDecoration: "none", color: "inherit" }}>
        <CardContent sx={{ cursor: 'pointer' }}>
          <Typography sx={{}}>
            <WorkspacePremiumIcon sx={{ fontSize: '8em' }} />
          </Typography>
          <Typography variant="h3" component="div">
            {card?.description}
          </Typography>
          <Typography variant="h5" color="text.secondary">
            Issued {card.sent}
          </Typography>
          <Typography variant="h5" color="body2">
            Earned {card.received}
          </Typography>
        </CardContent>
      </Link>
    </CardActionAreaStyled>
    <CardActions>
      <Button size="small">Create</Button>
      <Button size="small">Issue</Button>
      <IconButton aria-label="share">
        <ShareIcon />
      </IconButton>
    </CardActions>
  </MenuCardStyled>

export default MenuCardBadgeList;