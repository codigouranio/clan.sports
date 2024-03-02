import './App.css';
import logo from './logo.svg';
import React, { Suspense, lazy } from 'react';
import {
  Experimental_CssVarsProvider as CssVarsProvider,
  useColorScheme,
} from '@mui/material/styles';
import Button from '@mui/material/Button';
// import Dashboard from './Dashboard';

// ModeSwitcher is an example interface for toggling between modes.
// Material UI does not provide the toggle interface—you have to build it yourself.
const ModeSwitcher = () => {
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // for server-side rendering
    // learn more at https://github.com/pacocoursey/next-themes#avoid-hydration-mismatch
    return null;
  }

  return (
    <Button
      variant="outlined"
      onClick={() => {
        if (mode === 'light') {
          setMode('dark');
        } else {
          setMode('light');
        }
      }}
    >
      {mode === 'light' ? 'Dark' : 'Light'}
    </Button>
  );
};

const NoAccess = lazy(() => import(/* webpackChunkName: "no-access" */ './NoAccess'));
const Test = lazy(() => import(/* webpackChunkName: "test" */ './Test'));
const Dashboard = lazy(() => import(/* webpackChunkName: "dashboard" */ './Dashboard'));

const permission = false;

function App() {
  return (
    <CssVarsProvider>
      <ModeSwitcher />

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

    </CssVarsProvider>
  );
}

export default App;
