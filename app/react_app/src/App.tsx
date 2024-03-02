import './App.css';
import logo from './logo.svg';
import React, { Suspense, lazy } from 'react';
// import Dashboard from './Dashboard';

const NoAccess = lazy(() => import(/* webpackChunkName: "no-access" */ './NoAccess'));
const Test = lazy(() => import(/* webpackChunkName: "test" */ './Test'));
const Dashboard = lazy(() => import(/* webpackChunkName: "dashboard" */ './Dashboard'));

const permission = false;

function App() {
  return (
    <div className="App">
      <Suspense fallback={<div>Loading...</div>}>
        {permission &&
          <Test></Test>
        }
        <Dashboard></Dashboard>
        {/* <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header> */}
      </Suspense>
    </div>
  );
}

export default App;
