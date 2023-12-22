import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import studioTheme from './ui-components/studioTheme';
import {ThemeProvider} from "@aws-amplify/ui-react";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={studioTheme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
