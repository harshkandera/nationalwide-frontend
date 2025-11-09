import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import {
  BrowserRouter,
  createRoutesFromChildren,
  matchRoutes,
  useLocation,
  useNavigationType,
} from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { Toaster } from "./component/ui/toaster";
import persistedReducer from "./reducer/index.js";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { listingApiSlice } from "./slices/apiSlices/carListingApiSlice";
import ErrorBoundary from "./ErrorBoundry";
// import { messaging } from "./service/firebaseConfig";
import {
  requestNotificationPermission,
  requestFirebaseToken,
} from "./service/firebaseMessaging";
import { SocketProvider } from "./lib/SocketContext";
import { HelmetProvider } from "react-helmet-async";
import * as Sentry from "@sentry/react";

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(listingApiSlice.middleware),
});

if ("serviceWorker" in navigator && "Notification" in window) {
  const userAgent = navigator.userAgent;
  const isInAppBrowser = /FBAV|FBAN|Instagram/.test(userAgent);

  if (!isInAppBrowser) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((registration) => {
          console.log(
            "Service Worker registered with scope:",
            registration.scope
          );
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    });

    requestNotificationPermission()
      .then(() => requestFirebaseToken())
      .catch((error) =>
        console.error("Error requesting Firebase Token:", error)
      );
  } else {
    console.log("Skipping Service Worker registration for in-app browsers.");
  }
} else {
  console.warn(
    "This browser does not support notifications or service workers."
  );
}

function disableConsoleLogs() {
  if (process.env.REACT_APP_ENV === "production") {
    console.log = () => {};
    console.debug = () => {};
  }
}
disableConsoleLogs();

Sentry.init({
  dsn: "https://c135bb5cf066ee987ffd7819488a607c@o4508236019990528.ingest.us.sentry.io/4508236021694464",
  integrations: [
    Sentry.reactRouterV6BrowserTracingIntegration({
      useEffect,
      useLocation,
      useNavigationType,
      createRoutesFromChildren,
      matchRoutes,
    }),
    Sentry.replayIntegration(),
  ], // Tracing settings
  tracesSampleRate: 1.0, // Capture 100% of transactions
  tracePropagationTargets: [/^\//, /^https:\/\/bid-drive\.com\/api/],
  replaysSessionSampleRate: 0.1, // Set to 10% in production
  replaysOnErrorSampleRate: 1.0, // Sample 100% of sessions on error
});

const persistor = persistStore(store);
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Sentry.ErrorBoundary fallback={<p>An error has occurred</p>}>
        <ErrorBoundary>
          <SocketProvider>
            <HelmetProvider>
              <BrowserRouter>
                <App />
                <Toaster />
              </BrowserRouter>
            </HelmetProvider>
          </SocketProvider>
        </ErrorBoundary>
      </Sentry.ErrorBoundary>
    </PersistGate>
  </Provider>
);

reportWebVitals();
