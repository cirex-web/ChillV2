/* global chrome */
import css from './App.module.css';
import React, { useState, useContext, createContext } from 'react';
import data from './Storage';

import Header from './components/Header';
import BlockedList from './components/BlockedList';
import SiteStatus from './components/SiteStatus';
import PanelButton from './components/PanelButton';

export const AppContext = createContext();
function App() {
  console.log(chrome);
  const [blockedSites, setBlockedSites] = useState(data);
  const [currentSite, setCurrentSite] = useState("example.com"); //TODO:
  const isBlocked = Object.keys(blockedSites).includes(currentSite); //TODO:
  // setBlockedSites(data);
  // setBlockedSites({hey:3});
  const toggleCurrentSite = () => {

    if(!isBlocked){
      blockedSites[currentSite] = {}; //TODO:

    }else{
      delete blockedSites[currentSite];
    }
    setBlockedSites({...blockedSites});
  }
  return (
    <AppContext.Provider value={blockedSites}>
        <Header/>

        <SiteStatus site={currentSite} isBlocked = {isBlocked} toggleCurrentSite = {toggleCurrentSite}/>
        <PanelButton text={"View all blocked sites"} type="list"/>
        <PanelButton text={"Show stats"} type="stats"/>

    </AppContext.Provider>
  );
}


export default App;
