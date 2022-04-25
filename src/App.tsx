import React, { useState, createContext } from "react";
import useStorage, { unblockData } from "./useStorage";

import CurrentSite from "./components/pages/CurrentSite";
import NavBar from "./NavBar";
import css from "./App.module.css";
import BlockedList from "./components/pages/BlockedList";
import Stats from "./components/pages/Stats";
import toast, { Toaster } from "react-hot-toast";

import "reactjs-popup/dist/index.css";
import SitePopup from "./components/misc/SitePopup";
import SendRequest from "./components/popup/SendRequest";
interface globalContext {
  blockSite: (URL: string) => void;
  unblockSite: (URL: string) => void;
  loaded: boolean;
}
interface popupResponse {
  data: {
    res: boolean|string; //depending on what the action was
    url: string;
  };
  type: string;
}
export interface popupData {
  url: string;
  request: unblockData|undefined
}
export interface messageData {
  success: boolean;
  message: string;
}
export const AppContext = createContext<globalContext | undefined>(undefined);

function showMessage(data: messageData) {
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
    loaded,
    sendUnblockRequest,
    processUnblockRequest,
  } = useStorage(showMessage, showPopup);

  const [page, setPage] = useState<number>(0);
  const [popupOpen, setPopupOpen] = useState<boolean>(false);
  const [popupContent, setPopupContent] = useState<JSX.Element | undefined>(
    undefined
  );
  function processPopupResult(resp: popupResponse) {
    //we know these type assertions to be true cuz hopefully they are
    if (resp.type === "send_unblock_request") {
      sendUnblockRequest(resp.data.url, resp.data.res as string);
    } else if (resp.type === "process_unblock_request") {
      processUnblockRequest(resp.data.url, resp.data.res as boolean);
    }

    setPopupOpen(false);
  }
  function showPopup(type: string, data: popupData) {
    if (type === "unblock_request") {
      setPopupContent(
        <SendRequest processResult={processPopupResult} data={data} />
      );
      setPopupOpen(true);
    }
  }
  const pageComponent = (page: number) => {
    switch (page) {
      case 0:
        return (
          <CurrentSite
            siteUrl={currentSiteUrl}
            siteFavicon={currentSiteFavicon}
            siteData={blockedSites?.[currentSiteUrl]}
            siteBlockable={siteBlockable}
          />
        );
      case 1:
        return <BlockedList blockedSites={blockedSites} />;
      case 2:
        return <Stats />;
      default:
        return <div className={css.container}>404 Page Not Found</div>;
    }
  };
  return (
    <AppContext.Provider value={{ blockSite, unblockSite, loaded }}>
      <Toaster position="top-right" gutter={8} />
      <div className={css.header}>
        <div className={css.mainImgContainer}>
          <img src="../assets/logo3.png" alt="img logo" />
        </div>
      </div>
      <div className={css.mainContainer}>
        <NavBar page={page} setPage={setPage} />
        <div style={{ overflow: "scroll", maxHeight: "300px" }}>
          {pageComponent(page)}
        </div>
      </div>
      <SitePopup
        open={popupOpen}
        setOpen={setPopupOpen}
        content={popupContent}
      />
    </AppContext.Provider>
  );
}

export default App;
