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

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(request);
  switch (request.type) {
    case "block_site": {
      block_site(request.URL).then((res) => {
        printBlockedSites();
        sendResponse(res);
      });
      break;
    }
    case "add_request": {
      addRequest(request.URL, request).then((res) => {
        printBlockedSites();
        sendResponse(res);
      });
      break;
    }
    case "process_request": {
      processRequest(request.URL, request.AC).then(() => {
        printBlockedSites();
        printRequests();
        sendResponse({
          success: true,
          message: "request processed!",
        });
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
        console.log(res);
        sendResponse({
          success: true,
          message: res,
        });
      });

      break;
    }
    case "send_unblock_request": {
      sendUnblockRequest(request).then(res=>{
        sendResponse(res);
      });
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
function printBlockedSites() {
  getKeyFromStorage("blocked_sites").then((re) => console.log(re));
}
function printRequests() {
  getKeyFromStorage("requests").then((re) => console.log(re));
}

async function block_site(url) {
  // if (!Util.isValidHttpUrl(url)) {
  //   return {
  //     success: false,
  //     message: "Invalid URL",
  //   };
  // }
  try {
    url = new URL(url).hostname;
  } catch (e) {
    //ignored
  }
  let blocked_sites = (await getKeyFromStorage("blocked_sites")) || {};

  if (!blocked_sites[url]) {
    blocked_sites[url] = {
      date_blocked: +new Date(),
      currently_blocked: true,
    };
    setKeyAndData("blocked_sites", blocked_sites);
    return {
      success: true,
      message: `${url} has been chilled!`,
    };
  } else {
    // blocked_sites[url].currently_blocked = true;
    // if(blocked_sites[url].request){
    //     delete blocked_sites[url].request; //just to clear all previous data
    // }
    // setKeyAndData("blocked_sites",blocked_sites);
    return {
      success: false,
      message: `${url} is already chilled`,
    };
  }
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
async function sendUnblockRequest({ MESSAGE, URL }) {
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
    sites[URL].unblock_request = {
      time_created: +new Date(),
      end_time: +new Date() + 24 * 60 * 60 * 1000,
      message: MESSAGE,
    };
    setKeyAndData("blocked_sites", sites);
    return {
      success: true,
      message: `Sent an unblock request for ${URL}!`,
    };
  }
}
async function addRequest(url, req) {
  // console.log(url,req);
  let blocked_sites = (await getKeyFromStorage("blocked_sites")) || {};
  if (!blocked_sites[url]) {
    return {
      success: false,
      message:
        "This site is currently unblocked. Refresh the page to gain access",
    };
  }
  blocked_sites[url].request = {
    end_time: +new Date() + req.WAIT_TIME * 60 * 1000,
    message: req.TXT,
    reward_time: req.TIME * 60 * 1000,
    time_created: +new Date(),
  };
  console.log("added request", blocked_sites[url].request);
  setKeyAndData("blocked_sites", blocked_sites);
  return {
    success: true,
    message: `Added request for ${url}!`,
  };
}
async function processRequest(url, accepted) {
  let blocked_sites = (await getKeyFromStorage("blocked_sites")) || {};
  let requests = (await getKeyFromStorage("requests")) || [];
  let site_request = blocked_sites[url].request;
  let ac = false;
  if (accepted) {
    blocked_sites[url].currently_blocked = false;
    blocked_sites[url].reblock = +new Date() + site_request.reward_time;
    ac = true;
    console.log("Starting reward");
    setTimeout(() => {
      console.log("Reward over!");
      blocked_sites[url].currently_blocked = true;
      delete blocked_sites[url].reblock;
      setKeyAndData("blocked_sites", blocked_sites);
    }, site_request.reward_time);
  }
  console.log("here", site_request);
  requests.push({
    url: url,
    ac: ac,
    time_earned: site_request.reward_time,
    message: site_request.message,
    time_created: site_request.time_created,
  });
  delete blocked_sites[url].request;

  setKeyAndData("blocked_sites", blocked_sites);
  setKeyAndData("requests", requests);
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
