import React from 'react';
import ReactDOM from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import './index.css';
import App from './App';
import { UserContextProvider } from './userContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ToastContainer />
    <UserContextProvider>
    <App />
    </UserContextProvider>
  </React.StrictMode>
);


