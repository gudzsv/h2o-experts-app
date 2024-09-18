import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import RootComponent from './RootComponent';
import './i18n/i18n.js';
import 'assets/styles/styles.css';

const environment = import.meta.env.VITE_APP_ENV;

if (environment === 'development') {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <RootComponent />
    </StrictMode>
  );
} else {
  createRoot(document.getElementById('root')).render(<RootComponent />);
}
