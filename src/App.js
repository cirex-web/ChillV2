import React, { useState, createContext, useCallback } from "react";
import useStorage from "./useStorage";

import CurrentSite from "./components/pages/CurrentSite";
import NavBar from "./NavBar";
import css from "./App.module.css";
import BlockedList from "./components/pages/BlockedList";
import Stats from "./components/pages/Stats";
import toast, { Toaster } from "react-hot-toast";

import "reactjs-popup/dist/index.css";
import SitePopup from "./components/misc/SitePopup";
import SendRequest from "./components/popup/SendRequest";
export const AppContext = createContext();
function showMessage(data) {
  data?.message?.replace("https://", "");
  if (data.success) {
    toast.success(data.message);
  } else {
    toast.error(data.message);
  }
}

function App() {


  const {
    currentSiteUrl,
    blockedSites,
    blockSite,
    unblockSite,
    siteBlockable,
    currentSiteFavicon,
    sendUnblockRequest
  } = useStorage(showMessage, showPopup);
  const [page, setPage] = useState(0);
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupContent, setPopupContent] = useState(undefined);
  let popupType;
  function processPopupResult(data){
    if(popupType==="unblock_request"){
      sendUnblockRequest(data);
    }
    setPopupOpen(false);
  }
  function showPopup(type,data) {
    popupType = type;
    if (type === "unblock_request") {
      setPopupContent(<SendRequest processResult={processPopupResult} data={data}/>);
      setPopupOpen(true);
    }
  }
  const pageComponent = (page) => {
    switch (page) {
      case 0:
        return (
          <CurrentSite
            siteUrl={currentSiteUrl}
            siteFavicon={currentSiteFavicon}
            siteData={blockedSites && blockedSites[currentSiteUrl]}
            siteBlockable={siteBlockable}
          />
        );
      case 1:
        return <BlockedList data={blockedSites} />;
      case 2:
        return <Stats />;
      default:
        return <div className={css.container}>404 Page Not Found</div>;
    }
  };
  return (
    <AppContext.Provider value={{ blockSite, unblockSite }}>
      <Toaster position="top-right" gutter={8} />
      <div className={css.header}>
        <div className={css.mainImgContainer}>
          <img src="../assets/chillLogo2.png" alt="img logo" />
        </div>
      </div>
      <div className={css.mainContainer}>
        <NavBar page={page} setPage={setPage} />
        <div style={{ overflow: "scroll", maxHeight: "300px" }}>
          {pageComponent(page)}
        </div>
      </div>
      <SitePopup open={popupOpen} setOpen={setPopupOpen} content={popupContent} />
    </AppContext.Provider>
  );
}

export default App;
