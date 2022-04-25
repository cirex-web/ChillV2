/* eslint-disable no-restricted-globals */
/* global chrome */

const Util = {
  cleanUrl: (url) => {
    try {
      url = new URL(url).hostname;
    } catch (e) {
      //ignored
    }
    url = url.replace(/^(www\.)/, "");
    return url;
  },
};
const debug = false;
const DAY = debug ? 10 * 1000 : 24 * 60 * 60 * 1000;
const SETTINGS = {
  REQUEST_UNBLOCK_DELAY_MULTIPLIER: debug ? 0 : 3,
  REQUEST_PERM_UNBLOCK_DELAY: DAY,
  GRACE_PERIOD_DURATION: DAY, // how long before you need to send a request to unblock,
  REQUEST_UNBLOCK_EXPIRY_TIME: DAY,
  REQUEST_PERM_EXPIRY_TIME: DAY,
};
let originalSetTimeout = setTimeout;
// eslint-disable-next-line no-native-reassign
setTimeout = function (func, delay) {
  console.log("timeout set with delay", delay, func);

  return originalSetTimeout(func, delay);
};

const updateStorageVersion = async () => {
  let blocked_sites = (await getKeyFromStorage("blocked_sites")) || {};
  let requests = (await getKeyFromStorage("requests")) || [];
  let version = await getKeyFromStorage("version");

  switch (version) {
    case undefined:
      for (let url in blocked_sites) {
        let new_url = Util.cleanUrl(url);
        if (new_url !== url) {
          let obj = blocked_sites[url];
          delete blocked_sites[url];
          if (!blocked_sites[new_url]) {
            blocked_sites[new_url] = obj;
          }
        }
      }
      for (let request_entry of requests) {
        request_entry.url = Util.cleanUrl(request_entry.url);
      }
      console.log("Storage upgraded to version 1"); //all urls are now clean
    // falls through
    default:
      setKeyAndData("blocked_sites", blocked_sites);
      setKeyAndData("requests", requests);
      setKeyAndData("version", 1);
  }
};

const injectIntoTab = (tab, filePath) => {
  return new Promise((re, er) => {
    if (tab.discarded) er();
    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        files: [filePath],
      },
      () => {
        if (chrome.runtime.lastError) {
          //failed to inject; likely because it is a chrome:// site
          er(chrome.runtime.lastError);
        } else {
          // console.log("injected", filePath, "into", tab.url);
          re();
        }
      }
    );
  });
};
const getAllTabs = () => {
  return new Promise((re) => {
    chrome.windows.getAll(
      {
        populate: true,
        windowTypes: ["normal", "app"],
      },
      async (windows) => {
        let tabs = [];
        for (let window of windows) {
          tabs = tabs.concat(window.tabs);
        }
        re(tabs);
      }
    );
  });
};

let injectIntoAllExistingPages = async () => {
  let tabs = await getAllTabs();
  for (let tab of tabs) {
    injectIntoTab(tab, "external/jquery.js")
      .then(() => {
        injectIntoTab(tab, "backend/scripts/page-script.js");
      })
      .catch((ignored) => {});
  }
};
const injectBaton = async () => {
  const baton_id = await getKeyFromStorageLocal("baton_id");
  if (baton_id) return;

  const tabs = await getAllTabs();
  for (let tab of tabs) {
    try {
      await injectIntoTab(tab, "backend/scripts/baton.js");
      await setKeyAndDataLocal("baton_id", tab.id);
      return;
    } catch (e) {
      //ignored
    }
  }
  console.log("baton injection failed");
};
const firstInitialize = async () => {
  // await setKeyAndDataLocal("baton_id", false);
  await updateStorageVersion();
  await injectIntoAllExistingPages();
};
// chrome.tabs.onActivated.addListener(injectBaton);


const init = async () => {
  console.log("Init database timeouts at", new Date());

  let blocked_sites = (await getKeyFromStorage("blocked_sites")) || {};
  for (let [URL, { request, unblock_request, reblock }] of Object.entries(
    blocked_sites
  )) {
    if (request) {
      setTimeout(() => {
        processThawRequest({ URL, AC: false });
      }, Math.max(0, request.expiry_time - new Date()));
    }
    if (unblock_request) {
      setTimeout(() => {
        processUnblockRequest({ URL, OUTCOME: false });
      }, Math.max(0, unblock_request.expiry_time - new Date()));
    }
    if (reblock) {
      setTimeout(() => {
        _unthawSite(URL);
      }, Math.max(0, reblock - new Date()));
    }
  }
};

self.addEventListener("install", firstInitialize);
init();

// baton listener
// chrome.storage.onChanged.addListener((changes) => {
//   for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
//     if (key === "baton_id") {
//       console.log("baton_id: " + newValue);
//       if(!newValue){
//         injectBaton();
//       }
//     }
//   }
// });


let lifeline;

keepAlive();

chrome.runtime.onConnect.addListener(port => {
  if (port.name === 'keepAlive') {
    lifeline = port;
    setTimeout(keepAliveForced, 295e3); // 5 minutes minus 5 seconds
    port.onDisconnect.addListener(keepAliveForced);
  }
});

function keepAliveForced() {
  lifeline?.disconnect();
  lifeline = null;
  keepAlive();
}

async function keepAlive() {
  if (lifeline) return;
  for (const tab of await chrome.tabs.query({ url: '*://*/*' })) {
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => chrome.runtime.connect({ name: 'keepAlive' }),
        // `function` will become `func` in Chrome 93+
      });
      console.log("switched to tab",tab);
      chrome.tabs.onUpdated.removeListener(retryOnTabUpdate);
      return;
    } catch (e) {}
  }
  chrome.tabs.onUpdated.addListener(retryOnTabUpdate);
}

async function retryOnTabUpdate(tabId, info, tab) {
  if (info.url && /^(file|https?):/.test(info.url)) {
    keepAlive();
  }
}



chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(request);
  // Note: util functions just return result whereas
  // everything else returns an object with a success property
  switch (request.TYPE) {
    case "block_site": {
      blockSite(request).then(sendResponse);
      break;
    }
    case "add_request": {
      addThawRequest(request).then((res) => {
        sendResponse(res);
      });
      break;
    }
    case "process_request": {
      processThawRequest(request).then((res) => {
        sendResponse(res);
      });
      break;
    }
    case "unblock_site": {
      unblockSite(request).then((res) => {
        sendResponse(res);
      });
      break;
    }
    case "check_blockability": {
      // let res = Util.isValidHttpUrl(request.URL);
      checkContentScriptAlive(request.TAB_ID).then((res) => {
        sendResponse({
          success: true,
          message: res,
        });
      });

      break;
    }
    case "send_unblock_request": {
      addUnblockRequest(request).then((res) => {
        sendResponse(res);
      });
      break;
    }
    case "process_unblock_request": {
      processUnblockRequest(request).then((res) => sendResponse(res));
      break;
    }
    case "get_blocked_sites": {
      getBlockedSites().then((res) => sendResponse(res));
      break;
    }
    case "util_clean_url": {
      sendResponse({url:Util.cleanUrl(request.URL)});
      break;
    }
    default: {
      sendResponse({
        success: false,
        message: "Invalid request",
      });
    }
  }

  return true;
});

// chrome.tabs.onRemoved.addListener(async (id)=>{
//   const cur_tab_id = await getKeyFromStorage("baton_tab");
//   if(id===cur_tab_id){
//     setKeyAndData("baton_tab",undefined);
//   }
// });

function checkContentScriptAlive(TAB_ID) {
  return new Promise((re) => {
    chrome.tabs.sendMessage(
      TAB_ID,
      { greeting: "just checking if you're alive lol" },
      function (response) {
        re(!chrome.runtime.lastError);
      }
    );
  });
}
async function getBlockedSites() {
  return (await getKeyFromStorage("blocked_sites")) || {};
}
function printRequests() {
  getKeyFromStorage("requests").then((re) => console.log(re));
}

async function blockSite({ URL }) {
  URL = Util.cleanUrl(URL);
  let blocked_sites = (await getKeyFromStorage("blocked_sites")) || {};

  if (!blocked_sites[URL]) {
    blocked_sites[URL] = {
      date_blocked: +new Date(),
      currently_blocked: true,
    };
    setKeyAndData("blocked_sites", blocked_sites);
    return {
      success: true,
      message: `${URL} has been chilled!`,
    };
  } else {
    // blocked_sites[url].currently_blocked = true;
    // if(blocked_sites[url].request){
    //     delete blocked_sites[url].request; //just to clear all previous data
    // }
    // setKeyAndData("blocked_sites",blocked_sites);
    return {
      success: false,
      message: `${URL} is already chilled`,
    };
  }
}
async function _unthawSite(URL) {
  let blocked_sites = (await getKeyFromStorage("blocked_sites")) || {};
  if (!blocked_sites[URL]) return;
  blocked_sites[URL].currently_blocked = true;
  delete blocked_sites[URL].reblock;
  setKeyAndData("blocked_sites", blocked_sites);
}
async function unblockSite({ URL }) {
  let sites = (await getKeyFromStorage("blocked_sites")) || {};
  if (!sites[URL]) {
    return {
      success: false,
      message: `${URL} isn't blocked!`,
    };
  }

  delete sites[URL];
  setKeyAndData("blocked_sites", sites);
  return {
    success: true,
    message: `Unblocked ${URL}!`,
  };
}
async function addUnblockRequest({ MESSAGE, URL }) {
  let sites = (await getKeyFromStorage("blocked_sites")) || {};
  if (!sites[URL]) {
    return {
      success: false,
      message: `${URL} isn't blocked!`,
    };
  } else if (sites[URL].unblock_request) {
    return {
      success: false,
      message: `You've already sent an unblock request for ${URL}`,
    };
  } else {
    const curTime = +new Date();
    let endTime;
    sites[URL].unblock_request = {
      time_created: curTime,
      end_time: (endTime = curTime + SETTINGS.REQUEST_PERM_UNBLOCK_DELAY),
      message: MESSAGE,
      expiry_time: endTime + SETTINGS.REQUEST_PERM_EXPIRY_TIME,
    };
    setKeyAndData("blocked_sites", sites);
    setTimeout(() => {
      processUnblockRequest({ URL, OUTCOME: false });
    }, sites[URL].unblock_request.expiry_time - new Date());
    return {
      success: true,
      message: `Sent an unblock request for ${URL}!`,
    };
  }
}
async function processUnblockRequest({ URL, OUTCOME }) {
  let sites = (await getKeyFromStorage("blocked_sites")) || {};
  if (!sites[URL]) {
    return {
      success: false,
      message: `${URL} isn't blocked!`,
    };
  }
  if (!sites[URL].unblock_request) {
    return {
      success: false,
      message: `The unblock request for ${URL} has already expired!`,
    };
  }
  if (OUTCOME) {
    if (sites[URL].unblock_request.end_time > +new Date()) {
      return {
        success: false,
        message: "Request cooldown has not finished!",
      };
    }
    return await unblockSite({ URL });
  } else {
    delete sites[URL].unblock_request;
    setKeyAndData("blocked_sites", sites);
    return {
      success: true,
      message: `Unblock request for ${URL} cancelled!`,
    };
  }
}
async function addThawRequest({ URL, TXT, TIME }) {
  let blocked_sites = (await getKeyFromStorage("blocked_sites")) || {};
  if (!blocked_sites[URL]) {
    return {
      success: false,
      message:
        "This site is currently unblocked. Refresh the page to gain access",
    };
  }
  const curTime = +new Date();
  let endTime;
  blocked_sites[URL].request = {
    end_time: (endTime =
      curTime + TIME * SETTINGS.REQUEST_UNBLOCK_DELAY_MULTIPLIER),
    message: TXT,
    reward_time: TIME,
    time_created: curTime,
    expiry_time: endTime + SETTINGS.REQUEST_UNBLOCK_EXPIRY_TIME,
  };
  console.log("added request", blocked_sites[URL].request);
  setKeyAndData("blocked_sites", blocked_sites);
  setTimeout(() => {
    processThawRequest({ URL, AC: false });
  }, blocked_sites[URL].request.expiry_time - new Date());
  return {
    success: true,
    message: `Added request for ${URL}!`,
  };
}
async function processThawRequest({ URL, AC }) {
  let blocked_sites = (await getKeyFromStorage("blocked_sites")) || {};
  let requests = (await getKeyFromStorage("requests")) || [];
  if (!blocked_sites[URL]) {
    return {
      success: false,
      message: "Site isn't blocked!",
    };
  }
  let site_request = blocked_sites[URL].request;
  if (!site_request) {
    return {
      success: false,
      message: "Site request doesn't exist anymore!",
    };
  }
  if (AC) {
    blocked_sites[URL].currently_blocked = false;
    blocked_sites[URL].reblock = +new Date() + site_request.reward_time;
    setTimeout(() => {
      _unthawSite(URL);
    }, site_request.reward_time);
  }
  requests.push({
    url: URL,
    ac: AC,
    time_earned: site_request.reward_time,
    message: site_request.message,
    time_created: site_request.time_created,
  });
  delete blocked_sites[URL].request;

  setKeyAndData("blocked_sites", blocked_sites);
  setKeyAndData("requests", requests);

  return {
    success: true,
    message: "request processed!",
  };
}
function getKeyFromStorage(key) {
  return new Promise((re) => {
    chrome.storage.sync.get([key], function (result) {
      re(result[key]);
    });
  });
}
function getKeyFromStorageLocal(key) {
  return new Promise((re) => {
    chrome.storage.local.get([key], function (result) {
      re(result[key]);
    });
  });
}
function setKeyAndData(key, data) {
  return new Promise((re) => {
    chrome.storage.sync.set({ [key]: data }, re);
  });
}
function setKeyAndDataLocal(key, data) {
  return new Promise((re) => {
    chrome.storage.local.set({ [key]: data }, re);
  });
}
