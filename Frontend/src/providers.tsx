"use client";

import React, { useState, useEffect } from "react";
import { Provider } from "react-redux";
import { store, persistor } from "./store";
import { PersistGate } from "redux-persist/integration/react";
import SmoothScrollProvider from "./components/landing/SmoothScrollProvider";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    // Wrap setHasMounted in a timeout to avoid synchronous setState inside useEffect
    // and satisfy the react-hooks/set-state-in-effect rule.
    const timer = setTimeout(() => {
      setHasMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (!hasMounted) {
    return (
      <Provider store={store}>
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
        <Toaster position="top-center" richColors closeButton />
      </Provider>
    );
  }

  return (
    <Provider store={store}>
      {persistor ? (
        <PersistGate loading={null} persistor={persistor}>
          <SmoothScrollProvider>
            {children}
          </SmoothScrollProvider>
        </PersistGate>
      ) : (
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
      )}
      <Toaster position="top-center" richColors closeButton />
    </Provider>
  );
}
