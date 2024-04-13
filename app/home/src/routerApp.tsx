import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from './App';

const Home = lazy(() => import(/* webpackChunkName: "home" */ './Components/Home'));
const ClanList = lazy(() => import(/* webpackChunkName: "clanList" */ './Components/ClanList'));
const ProfileAdd = lazy(() => {
  return import(/* webpackChunkName: "profile" */"./Components/Profile").then(module => {
    return { default: module.ProfileAdd };
  });
});
const ProfileList = lazy(() => {
  return import(/* webpackChunkName: "profile" */"./Components/Profile").then(module => {
    return { default: module.ProfileList };
  });
});
const ProfileView = lazy(() => {
  return import(/* webpackChunkName: "profile" */"./Components/Profile").then(module => {
    return { default: module.ProfileView };
  });
});
const PassList = lazy(() => import(/* webpackChunkName: "passList" */ './Components/PassList'));
const BadgeList = lazy(() => import(/* webpackChunkName: "badgeList" */ './Components/BadgeList'));
const TrophyList = lazy(() => import(/* webpackChunkName: "trophyList" */ './Components/TrophyList'));
const PointList = lazy(() => import(/* webpackChunkName: "pointList" */ './Components/PointList'));
const ErrorGeneric = lazy(() => import(/* webpackChunkName: "errorGeneric" */ './Components/ErrorGeneric'));
const Error404 = lazy(() => import(/* webpackChunkName: "error404" */ './Components/Error404'));
const NotificationList = lazy(() => import(/* webpackChunkName: "notificationList" */ './Components/NotificationList'));


export const routerApp = createBrowserRouter([
  {
    element: <App />,
    path: '/',
    errorElement: <div>Error!</div>,
    children: [
      {
        index: true,
        element: <Home />,
        errorElement: <ErrorGeneric />,
      },
      {
        path: "clans",
        element: <ClanList />,
        errorElement: <ErrorGeneric />,
      },
      {
        path: "profiles",
        element: <ProfileList />,
        errorElement: <ErrorGeneric />,
      },
      {
        path: "profiles/add",
        element: <ProfileAdd />,
        errorElement: <ErrorGeneric />,
      },
      {
        path: "profile",
        element: <ProfileView />,
        errorElement: <ErrorGeneric />,
      },
      {
        path: "passes",
        element: <PassList />,
        errorElement: <ErrorGeneric />,
      },
      {
        path: "badges",
        element: <BadgeList />,
        errorElement: <ErrorGeneric />,
      },
      {
        path: "trophies",
        element: <TrophyList />,
        errorElement: <ErrorGeneric />,
      },
      {
        path: "points",
        element: <PointList />,
        errorElement: <ErrorGeneric />,
      },
      {
        path: "notifications",
        element: <NotificationList />,
        errorElement: <ErrorGeneric />,
      },
    ]
  },
  {
    path: "*",
    element: <Error404 />
  }
], {
  basename: "/app",
});