import React, { useState, createContext } from "react";
import useStorage from "./useStorage";

import CurrentSite from "./components/pages/CurrentSite";
import NavBar from "./NavBar";
import css from "./App.module.css";
import BlockedList from "./components/pages/BlockedList";
import Stats from "./components/pages/Stats";
import toast, { Toaster } from 'react-hot-toast';



export const AppContext = createContext();
function showMessage(data) {
  if(data.success){

    toast.success(data.message);
  }else{
    toast.error(data.message);
  }
}
function App() {
  const { currentSiteUrl, blockedSites, blockSite, unblockSite } =
    useStorage(showMessage);
  const [page, setPage] = useState(0);
  
  const pageComponent = (page) => {
    switch (page) {
      case 0:
        return (
          <CurrentSite
            siteUrl={currentSiteUrl}
            siteData={blockedSites&&blockedSites[currentSiteUrl]}
            toggleCurrentSite={(isBlocked) => {
              if (isBlocked) {
                unblockSite(currentSiteUrl);
              } else {
                blockSite(currentSiteUrl);
              }
            }}
          />
        );
      case 1:
        return <BlockedList blockSite={blockSite}/>;
      case 2:
        return <Stats />;
      default:
        return <div className={css.container}>404 Page Not Found</div>;
    }
  };
  return (
    <AppContext.Provider value={blockedSites}>
      <Toaster position="top-right" gutter={8}/>
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
