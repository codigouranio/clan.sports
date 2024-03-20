
import '@fontsource/train-one';
import '@fontsource/bangers';
import { AccountCircle } from '@mui/icons-material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import WebhookIcon from '@mui/icons-material/Webhook';
import { AppBar, Badge, Breadcrumbs, Divider, FormControlLabel, FormGroup, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Switch, Toolbar, Typography } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import {
  Experimental_CssVarsProvider as CssVarsProvider,
  ThemeProvider
} from '@mui/material/styles';
import * as _ from 'lodash';
import React, { Suspense, lazy } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import './App.scss';
import Copyright from './Components/Copyright';
import theme from './theme';

const NoAccess = lazy(() => import(/* webpackChunkName: "no-access" */ './NoAccess'));
const Test = lazy(() => import(/* webpackChunkName: "test" */ './Test'));



const permission = false;



function App() {

  const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAuth(event.target.checked);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const location = useLocation();
  const { hash, pathname, search } = location;

  return (
    <CssVarsProvider>
      <ThemeProvider theme={theme}>
        <div className="App">
          <Suspense fallback={<div>Loading...</div>}>
            {permission &&
              <Test></Test>
            }
            <CssBaseline />
            <AppBar position="relative"
              sx={{
                backgroundColor: 'transparent',
                // color: '#F74019',
                boxShadow: 'none',
                marginBottom: '1em'
              }}>
              <Toolbar variant="dense" sx={{
                paddingTop: '3px',
                paddingBottom: '3px'
              }}>
                <Typography
                  noWrap
                  variant="h5"
                  component="a"
                  href="/"
                  sx={{
                    fontFamily: 'Outfit, system-ui',
                    fontWeight: 700,
                    letterSpacing: '0em',
                    color: '#2C2323',
                    textDecoration: 'none',
                    // backgroundColor: '#DC0000',
                    paddingTop: '2px',
                    paddingBottom: '2px',
                    paddingLeft: '5px',
                    paddingRight: '2px',
                    stroke: 'ActiveBorder',
                    strokeWidth: '1.5px',
                    fill: 'yellow'
                    // margin: '0.5rem'
                  }}
                  className='anim-text-flow'
                >
                  <span>C</span><span>L</span><span>A</span><span>N</span> SPORTS
                </Typography>
              </Toolbar>
              <Toolbar variant="dense" sx={{
                backgroundColor: 'gray',
                paddingTop: '2px',
              }}>
                <Breadcrumbs aria-label="breadcrumb" style={{ textDecoration: "none", color: "inherit" }}>
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{ flexGrow: 1, textAlign: 'left', cursor: 'pointer' }}
                  >
                    <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>Home</Link>
                  </Typography>
                  {pathname !== "/" &&
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{ flexGrow: 1, textAlign: 'left', cursor: 'pointer' }}
                    >
                      {_.capitalize(pathname.replace("/", ""))}
                    </Typography>
                  }
                </Breadcrumbs>
                <Typography variant="subtitle1" component="div" sx={{ flexGrow: 1, textAlign: 'right', }}>
                </Typography>
                <IconButton
                  size="large"
                  aria-label="your-phone"
                  color="inherit"
                >
                  <SmartphoneIcon />
                </IconButton>
                <IconButton
                  size="large"
                  aria-label="show 17 new notifications"
                  color="inherit"
                  component={Link} to="/notifications"
                >
                  <Badge badgeContent={17} color="info">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                      <AccountCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>My Account</ListItemText>
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                      <MeetingRoomIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Logout</ListItemText>
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                      <WebhookIcon fontSize="small" />
                    </ListItemIcon>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Switch
                            // checked={auth}
                            // onChange={handleChange}
                            aria-label="login switch"
                          />
                        }
                        label={'API Developer'}
                      />
                    </FormGroup>
                  </MenuItem>
                </Menu>
              </Toolbar>
            </AppBar>
            <Outlet />
            <Copyright sx={{ pt: 4, mb: 3, ml: 2 }} />
          </Suspense>
        </div>
      </ThemeProvider>
    </CssVarsProvider >
  );
}

export default App;
