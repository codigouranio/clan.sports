import ShareIcon from '@mui/icons-material/Share';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import { Button, CardActions, CardContent, IconButton, Typography } from "@mui/material";
import { Link } from 'react-router-dom';
import { MenuCardStyled } from './MenuCardStyled';

const MenuCardBadgeList = ({ card }) =>
  <MenuCardStyled elevation={0} sx={{
    backgroundColor: 'transparent',
    color: 'blue'
  }} variant="outlined">
    <Link to="badges" style={{ textDecoration: "none", color: "inherit" }}>
      <CardContent sx={{ cursor: 'pointer' }}>
        <Typography sx={{}}>
          <WorkspacePremiumIcon sx={{ fontSize: '8em' }} />
        </Typography>
        <Typography variant="h3" component="div">
          {card?.description}
        </Typography>
        <Typography sx={{}} color="text.secondary">
          Issued {card.sent}
        </Typography>
        <Typography sx={{}} color="body2">
          Earned {card.received}
        </Typography>
      </CardContent>
    </Link>
    <CardActions>
      <Button size="small">Create</Button>
      <Button size="small">Issue</Button>
      <IconButton aria-label="share">
        <ShareIcon />
      </IconButton>
    </CardActions>
  </MenuCardStyled>

export default MenuCardBadgeList;