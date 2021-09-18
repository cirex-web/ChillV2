import React, { useState, createContext } from "react";
import useStorage from "./useStorage";

import CurrentSite from "./components/pages/CurrentSite";
import NavBar from "./NavBar";
import css from "./App.module.css";
import BlockedList from "./components/pages/BlockedList";
import Stats from "./components/pages/Stats";

import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export const AppContext = createContext();
function showMessage(data) {
  toast.success(data);
}
function App() {
  const { currentSiteUrl, blockedSites, blockSite, unblockSite } =
    useStorage(showMessage);
  const [page, setPage] = useState(0);
  const isBlocked =
    blockedSites &&
    currentSiteUrl &&
    Object.keys(blockedSites).includes(currentSiteUrl) &&
    blockedSites[currentSiteUrl].currently_blocked; //TODO: Fix

  const pageComponent = (page) => {
    switch (page) {
      case 0:
        return (
          <CurrentSite
            site={currentSiteUrl}
            isBlocked={isBlocked}
            toggleCurrentSite={() => {
              if (isBlocked) {
                unblockSite(currentSiteUrl);
              } else {
                blockSite(currentSiteUrl);
              }
            }}
          />
        );
      case 1:
        return <BlockedList />;
      case 2:
        return <Stats />;
      default:
        return <div className={css.container}>404 Page Not Found</div>;
    }
  };
  return (
    <AppContext.Provider value={blockedSites}>
      <ToastContainer />
      <div className={css.header}>
        <div className={css.mainImgContainer}>
          <img src="../assets/chillLogo2.png" alt="img logo" />
        </div>
      </div>
      <NavBar page={page} setPage={setPage} />
      <div style={{ overflow: "scroll", maxHeight: "300px" }}>
        {pageComponent(page)}
      </div>
    </AppContext.Provider>
  );
}

export default App;
