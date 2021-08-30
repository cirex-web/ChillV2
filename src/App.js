/* global chrome */
import React, { useState, createContext } from "react";
import data from "./Storage";

import Header from "./components/Header";
import SiteStatus from "./components/SiteStatus";
import NavButtons from "./components/NavButtons";
import NavBar from "./NavBar";
import css from "./App.module.css";
export const AppContext = createContext();
function App() {
  const [blockedSites, setBlockedSites] = useState(data);
  const [currentSite, setCurrentSite] = useState("example.com"); //TODO:
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
          <SiteStatus
            site={currentSite}
            isBlocked={isBlocked}
            toggleCurrentSite={toggleCurrentSite}
          />
        );
      default:
        return <div className={css.container}>
          404 Page Not Found
        </div>;
    }
  };
  return (
    <AppContext.Provider value={blockedSites}>
      <Header />
      <NavBar page={page} setPage={setPage} />
      {pageComponent(page)}

      {/* <NavButtons /> */}
    </AppContext.Provider>
  );
}

export default App;
