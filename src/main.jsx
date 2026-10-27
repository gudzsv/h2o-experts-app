import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import RootComponent from './RootComponent';
import { store } from './redux/store.js';
import { refreshUser } from './redux/auth/operations.js';
import { setupInterceptors } from './helpers/axios.js';
import './i18n/i18n.js';
import 'assets/styles/styles.css';

setupInterceptors({
  refresh: () =>
    store
      .dispatch(refreshUser())
      .unwrap()
      .then(({ data }) => data.accessToken),
});

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
