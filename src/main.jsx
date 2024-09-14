import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { persistor, store } from './redux/store.js';
import { Provider } from 'react-redux';
//import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
//import { persistor, store } from './redux/store.js';
import 'assets/styles/styles.css';
import App from './App.jsx';
import { PersistGate } from 'redux-persist/integration/react';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <HelmetProvider>
            <App />
          </HelmetProvider>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </StrictMode>
);
