import { Box, Container, Grid, Paper } from '@mui/material';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import { MenuCardBadgeList, MenuCardClanList, MenuCardPassList, MenuCardPoints, MenuCardProfileList, MenuCardTrophyList } from '../MenuCards';

const menuId = 'primary-search-account-menu';
const settings = ['My Account', 'Settings', 'FAQ'];

const pages = ['My Profiles', 'My Teams', 'Games', 'Programs', 'Tournaments'];

const drawerWidth: number = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

// const AppBar = styled(MuiAppBar, {
//   shouldForwardProp: (prop) => prop !== 'open',
// })<AppBarProps>(({ theme, open }) => ({

// }));

const AppBar = styled(MuiAppBar, {})<MuiAppBarProps>({
  backgroundColor: 'transparent',
  border: '1px solid black',
  color: 'green'
});

export default function Home() {

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    fontSize: '70px',
    // boxShadow: theme.shadows[3],
    // border: '0px solid #919491',
    color: theme.palette.text.secondary,
  }));

  const cards = [
    {
      ord: 1,
      title: 'My Clans',
      type: 'clan_list',
      description: 'My Clans',
      total: 5,
      icon: 'icon'
    }, {
      ord: 2,
      title: 'My Profiles',
      type: 'profile_list',
      description: 'My Profiles',
      total: 1,
      icon: 'icon'
    }, {
      ord: 3,
      title: 'My Passes',
      type: 'pass_list',
      description: 'My Passes',
      current: 1,
      expired: 5,
      upcoming: 1,
      icon: 'icon'
    }, {
      ord: 4,
      title: 'My Badges',
      type: 'badge_list',
      description: 'My Badges',
      received: 0,
      sent: 0,
      icon: 'icon'
    }, {
      ord: 5,
      title: 'My Trophies',
      type: 'trophy_list',
      description: 'My Trophies',
      received: 0,
      sent: 0,
      lastReceived: '2021-10-01',
      icon: 'icon'
    }, {
      ord: 6,
      title: 'My Ongoing Goals',
      type: 'ongoing_goals',
      description: 'My Rewards',
      received: 0,
      sent: 0,
      lastReceived: '2021-10-01',
      icon: 'icon'
    }, {
      ord: 7,
      title: 'My Points',
      type: 'points',
      description: 'My Points',
      currentBalance: 3100,
      icon: 'icon'
    }];

  return (
    <Container maxWidth="md">
      <Box sx={{ flexGrow: 1, p: 2 }}>
        <Grid container rowSpacing={1} justifyContent="center">
          {cards.map((card, index) => (
            <Grid item sm="auto" key={index} sx={{
            }}>
              {card.type === "clan_list" && <MenuCardClanList card={card} />}
              {card.type === "profile_list" && <MenuCardProfileList card={card} />}
              {card.type === "trophy_list" && <MenuCardTrophyList card={card} />}
              {card.type === "badge_list" && <MenuCardBadgeList card={card} />}
              {card.type === "pass_list" && <MenuCardPassList card={card} />}
              {card.type === "points" && <MenuCardPoints card={card} />}
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container >
  );
}
