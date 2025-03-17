import React from 'react';
import ReactDOM from 'react-dom/client'; // ✅ ESTA ES LA LÍNEA QUE FALTABA
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import { ThemeToggleProvider } from './components/dashboard/ThemeToggleProvider';

/**
 * Componente main.
 * @module main
 * @component
 */
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
