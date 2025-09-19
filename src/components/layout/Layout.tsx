"use client";
import { persistor, store } from "@/redux/store";
import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import MainLoader from "../MainLoader";
import { UserSyncProvider } from "../UserSyncProvider";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <Provider store={store}>
        <PersistGate loading={<MainLoader />} persistor={persistor}>
          <UserSyncProvider>{children}</UserSyncProvider>
        </PersistGate>
      </Provider>
    </SessionProvider>
  );
};

export default Layout;
