import { persistor, store } from './redux/store.js';
import { Provider } from 'react-redux';
//import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
//import { persistor, store } from './redux/store.js';
import App from './App.jsx';
import { PersistGate } from 'redux-persist/integration/react';

const RootComponent = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <HelmetProvider>
          <App />
        </HelmetProvider>
      </BrowserRouter>
    </PersistGate>
  </Provider>
);

export default RootComponent;
