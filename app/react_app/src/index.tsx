import React, { lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import App from './App';
import './index.scss';
import reportWebVitals from './reportWebVitals';

const Home = lazy(() => import(/* webpackChunkName: "home" */ './Components/Home'));
const ClanList = lazy(() => import(/* webpackChunkName: "clanList" */ './Components/ClanList'));
const ProfileList = lazy(() => import(/* webpackChunkName: "profileList" */ './Components/ProfileList'));
const PassList = lazy(() => import(/* webpackChunkName: "passList" */ './Components/PassList'));
const BadgeList = lazy(() => import(/* webpackChunkName: "badgeList" */ './Components/BadgeList'));
const TrophyList = lazy(() => import(/* webpackChunkName: "trophyList" */ './Components/TrophyList'));
const PointList = lazy(() => import(/* webpackChunkName: "pointList" */ './Components/PointList'));
const ErrorGeneric = lazy(() => import(/* webpackChunkName: "errorGeneric" */ './Components/ErrorGeneric'));
const Error404 = lazy(() => import(/* webpackChunkName: "error404" */ './Components/Error404'));

const routerApp = createBrowserRouter([
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
    ]
  },
  {
    path: "*",
    element: <Error404 />
  }
], {
  basename: "/app",
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <RouterProvider router={routerApp} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
