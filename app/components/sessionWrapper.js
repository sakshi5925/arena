"use client";

import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import { store,persistor } from "../store/store";
import { PersistGate } from "redux-persist/integration/react";

const Providers = ({ children }) => {
  return (
    <SessionProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
        {children}
        </PersistGate>
      </Provider>
    </SessionProvider>
  );
};

export default Providers;
