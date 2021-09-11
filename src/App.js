/* global chrome */
import React, { useState, createContext } from "react";
import data from "./Storage";

import CurrentSite from "./components/pages/CurrentSite";
import NavBar from "./NavBar";
import css from "./App.module.css";
import BlockedList from "./components/pages/BlockedList";
import Stats from "./components/pages/Stats";

export const AppContext = createContext();
function App() {
  const [blockedSites, setBlockedSites] = useState(data);
  const [currentSite, setCurrentSite] = useState("google.com"); //TODO:
  const [page, setPage] = useState(0);
  const isBlocked = Object.keys(blockedSites).includes(currentSite); //TODO:
  // setBlockedSites(data);
  // setBlockedSites({hey:3});
  const toggleCurrentSite = () => {
    if (!isBlocked) {
      blockedSites[currentSite] = {}; //TODO:
    } else {
      delete blockedSites[currentSite];
    }
    setBlockedSites({ ...blockedSites });
  };

  const pageComponent = (page) => {
    switch (page) {
      case 0:
        return (
          <CurrentSite
            site={currentSite}
            isBlocked={isBlocked}
            toggleCurrentSite={toggleCurrentSite}
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
      <div className={css.header}>
        <div className={css.mainImgContainer}>
          <img src="../assets/chillLogo2.png" alt="img logo" />
        </div>
      </div>
      <NavBar page={page} setPage={setPage} />
      <div style={{ overflow: "scroll", maxHeight: "300px" }}>{pageComponent(page)}</div>

      {/* <NavButtons /> */}
    </AppContext.Provider>
  );
}

export default App;
