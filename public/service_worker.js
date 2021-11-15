/* eslint-disable no-restricted-globals */
/* global chrome */
const Util = {
  isValidHttpUrl(string) {
    let url;

    try {
      url = new URL(string);
    } catch (_) {
      return false;
    }

    return url.protocol === "https:";
  },
};
const debug = false;
const DAY = debug ? 10 * 1000 : 24 * 60 * 60 * 1000;
const SETTINGS = {
  REQUEST_UNBLOCK_DELAY_MULTIPLIER: debug?0:3,
  REQUEST_PERM_UNBLOCK_DELAY: DAY,
  GRACE_PERIOD_DURATION: DAY, // how long before you need to send a request to unblock,
  REQUEST_UNBLOCK_EXPIRY_TIME: DAY,
  REQUEST_PERM_EXPIRY_TIME: DAY,
};
let originalSetTimeout = setTimeout;
let scriptInit = false;
setTimeout = function (func, delay) {
  if (func !== indicateAlive) {
    console.log("timeout set with delay", delay, func);
  }
  return originalSetTimeout(func, delay);
};

const indicateAlive = () => {
  setKeyAndDataLocal("service_worker_alive", +new Date());
  setTimeout(indicateAlive, 100);
};

const init = async () => {
  if (scriptInit) return;
  console.log("init database timeouts at", new Date());

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
  scriptInit = true;
  indicateAlive();
};

self.addEventListener("install", init);

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(request);
  init();
  switch (request.TYPE) {
    case "ping": {
      sendResponse({ success: true });
      break;
    }
    case "block_site": {
      block_site(request).then((res) => {
        sendResponse(res);
      });
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
    default: {
      sendResponse({
        success: false,
        message: "Invalid request",
      });
    }
  }

  return true;
});
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
  return await getKeyFromStorage("blocked_sites");
}
function printRequests() {
  getKeyFromStorage("requests").then((re) => console.log(re));
}

async function block_site({ URL }) {
  // if (!Util.isValidHttpUrl(url)) {
  //   return {
  //     success: false,
  //     message: "Invalid URL",
  //   };
  // }
  try {
    URL = new URL(URL).hostname;
  } catch (e) {
    //ignored
  }
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
  if(!blocked_sites[URL]){
    return {
      success: false,
      message: "Site isn't blocked!"
    }
  }
  let site_request = blocked_sites[URL].request;
  if(!site_request){
    return {
      success: false,
      message: "Site request doesn't exist anymore!"
    }
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
function setKeyAndData(key, data) {
  chrome.storage.sync.set({ [key]: data });
}
function setKeyAndDataLocal(key, data) {
  chrome.storage.local.set({ [key]: data });
}
