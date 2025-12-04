/**
 * Standalone Entry Point
 * 
 * This file is used for independent deployment and development.
 * When the app is consumed as a microfrontend, the host app
 * will import and mount the App component directly with custom config.
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App 
      standalone={true}
      basePath=""
      graphqlEndpoint="http://localhost:8080/graphql"
    />
  </React.StrictMode>
);
