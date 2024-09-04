import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { ThemeToggleProvider } from './components/dashboard/ThemeToggleProvider.jsx';

const Main = () => (
  <React.StrictMode>
    <ThemeToggleProvider>
      <Router>
        <App />
      </Router>
    </ThemeToggleProvider>
  </React.StrictMode>
);

ReactDOM.createRoot(document.getElementById('root')).render(<Main />);

