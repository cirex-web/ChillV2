/* global chrome */
import { useEffect, useState, useCallback } from "react";

const data = {
  blocked_sites: {
    "discord.com": {
      currently_blocked: true,
      date_blocked: 1622587544591,
    },
    "test.com": {
      currently_blocked: true,
      date_blocked: 1622566475429,
      request: {
        end_time: +new Date() - 20 * 1000,
        message: "sgfdfgsdfgsdgdsfgdfsgdfgsdfgsdfgsdgsdfg",
        reward_time: 2606640000,
        time_created: 1622566548493,
      },
    },
    "x.com": {
      currently_blocked: false,
      date_blocked: 1622494132514,
      reblock: +new Date() + 20 * 1000,
    },
    "y.co": {
      currently_blocked: true,
      date_blocked: 1622732278244,
    },
    "y.c123o": {
      currently_blocked: true,
      date_blocked: 1622732278244,
    },
    "y.2co": {
      currently_blocked: true,
      date_blocked: 1622732278244,
    },
    "y.123co": {
      currently_blocked: true,
      date_blocked: 1622732278244,
    },
    "y.1co": {
      currently_blocked: true,
      date_blocked: 1622732278244,
    },
    "y.21": {
      currently_blocked: true,
      date_blocked: 1622732278244,
    },
    y21: {
      currently_blocked: true,
      date_blocked: 1622732278244,
    },
  },
  requests: [
    {
      ac: false,
      message: "fsdfsdfsdfsdfds",
      time_created: 1622499650510,
      time_earned: 6000,
      url: "x.com",
    },
    {
      ac: true,
      message: "23",
      time_created: 1622500388167,
      time_earned: 1920000,
      url: "x.com",
    },
    {
      ac: false,
      message: "nnmmnnmnmnmnnmmnmnmnnmnmnmnnmnmmnmnnmnmmnmnmnnmn",
      time_created: 1622549938580,
      time_earned: 6000,
      url: "x.com",
    },
    {
      ac: true,
      message:
        "kmkmmmkmkmsfm kmkmmmkmkmsfm kmkmmmkmkmsfm kmkmmmkmkmsfm kmkmmmkmkmsfm kmkmmmkmkmsfm kmkmmmkmkmsfm kmkmmmkmkmsfm kmkmmmkmkmsfm kmkmmmkmkmsfm kmkmmmkmkmsfm kmkmmmkmkmsfm kmkmmmkmkmsfm kmkmmmkmkmsfm kmkmmmkmkmsfm kmkmmmkmkmsfm kmkmmmkmkmsfm kmkmmmkmkmsfm kmkmmmkmkmsfm kmkmmmkmkmsfm kmkmmmkmkmsfm kmkmmmkmkmsfm kmkmmmkmkmsfm kmkmmmkmkmsfm kmkmmmkmkmsfm kmkmmmkmkmsfm kmkmmmkmkmsfm kmkmmmkmkmsfm ",
      time_created: 1622550112658,
      time_earned: 6000,
      url: "x.com",
    },
    {
      ac: false,
      message: "idk I just w",
      time_created: 1622551388378,
      time_earned: 6000,
      url: "x.com",
    },
    {
      ac: true,
      message: "check slingshot",
      time_created: 1622649320173,
      time_earned: 60000,
      url: "discord.com",
    },
    {
      ac: true,
      message: "sdaf",
      time_created: 1622730766447,
      time_earned: 6000,
      url: "x.com",
    },
    {
      ac: true,
      message: "erg",
      time_created: 1622731601065,
      time_earned: 6000,
      url: "x.com",
    },
    {
      ac: true,
      message: "check slingshot",
      time_created: 1622733744090,
      time_earned: 60000,
      url: "discord.com",
    },
    {
      ac: false,
      message: "f",
      time_created: 1622734094701,
      time_earned: 60,
      url: "youtube.com",
    },
    {
      ac: false,
      message: "I just want to",
      time_created: 1622734110525,
      time_earned: 60,
      url: "youtube.com",
    },
    {
      ac: true,
      message: "wqfe",
      time_created: 1622736383855,
      time_earned: 30000,
      url: "hangouts.google.com",
    },
    {
      ac: true,
      message: "jkh",
      time_created: 1622745041632,
      time_earned: 0,
      url: "youtube.com",
    },
    {
      ac: true,
      message: "discuss",
      time_created: 1622851791974,
      time_earned: 30000,
      url: "hangouts.google.com",
    },
    {
      ac: true,
      message: "check slingshot",
      time_created: 1622851803797,
      time_earned: 60000,
      url: "discord.com",
    },
    {
      ac: true,
      message: "yes",
      time_created: 1622851920056,
      time_earned: 30000,
      url: "hangouts.google.com",
    },
    {
      ac: true,
      message: "talk",
      time_created: 1622854145881,
      time_earned: 60000,
      url: "hangouts.google.com",
    },
    {
      ac: true,
      message: "sgdf",
      time_created: 1622857180707,
      time_earned: 120000,
      url: "hangouts.google.com",
    },
    {
      ac: true,
      message: "ask about covid",
      time_created: 1622941505951,
      time_earned: 60000,
      url: "hangouts.google.com",
    },
    {
      ac: true,
      message: "nb grade",
      time_created: 1623078486012,
      time_earned: 60000,
      url: "hangouts.google.com",
    },
    {
      ac: true,
      message: "lol",
      time_created: 1623079913422,
      time_earned: 6000,
      url: "hangouts.google.com",
    },
    {
      ac: true,
      message: "1",
      time_created: 1623082616380,
      time_earned: 60000,
      url: "hangouts.google.com",
    },
    {
      ac: true,
      message: "tell michal",
      time_created: 1623105620426,
      time_earned: 60000,
      url: "hangouts.google.com",
    },
    {
      ac: true,
      message: "1",
      time_created: 1623115859184,
      time_earned: 60000,
      url: "hangouts.google.com",
    },
    {
      ac: true,
      message: "f",
      time_created: 1623157354572,
      time_earned: 60000,
      url: "hangouts.google.com",
    },
    {
      ac: true,
      message: "c",
      time_created: 1623165189763,
      time_earned: 60000,
      url: "hangouts.google.com",
    },
    {
      ac: true,
      message: "1",
      time_created: 1623166272679,
      time_earned: 60000,
      url: "hangouts.google.com",
    },
    {
      ac: true,
      message: "1",
      time_created: 1623191871491,
      time_earned: 60000,
      url: "hangouts.google.com",
    },
    {
      ac: true,
      message: "check slingshot",
      time_created: 1623338332622,
      time_earned: 120000,
      url: "discord.com",
    },
    {
      ac: true,
      message: "talk",
      time_created: 1623416246091,
      time_earned: 60000,
      url: "hangouts.google.com",
    },
    {
      ac: true,
      message: "2",
      time_created: 1623543365749,
      time_earned: 120000,
      url: "hangouts.google.com",
    },
    {
      ac: true,
      message: "fsd",
      time_created: 1623612089550,
      time_earned: 12000,
      url: "hangouts.google.com",
    },
    {
      ac: true,
      message: "cd",
      time_created: 1623612151296,
      time_earned: 12000,
      url: "hangouts.google.com",
    },
    {
      ac: true,
      message: "vs",
      time_created: 1623612630537,
      time_earned: 60000,
      url: "hangouts.google.com",
    },
    {
      ac: true,
      message: "ask for script/word counters",
      time_created: 1623622363720,
      time_earned: 300000,
      url: "hangouts.google.com",
    },
    {
      ac: true,
      message: "1",
      time_created: 1623628048398,
      time_earned: 18000,
      url: "hangouts.google.com",
    },
    {
      ac: true,
      message: "1",
      time_created: 1623628387591,
      time_earned: 18000,
      url: "hangouts.google.com",
    },
    {
      ac: true,
      message: "1",
      time_created: 1623628653115,
      time_earned: 12000,
      url: "hangouts.google.com",
    },
    {
      ac: true,
      message: "uplaod vid\\",
      time_created: 1623869179016,
      time_earned: 60000,
      url: "youtube.com",
    },
    {
      ac: true,
      message: "yes",
      time_created: 1623954352815,
      time_earned: 6000,
      url: "studio.youtube.com",
    },
    {
      ac: true,
      message: "yes",
      time_created: 1624024473028,
      time_earned: 60000,
      url: "studio.youtube.com",
    },
    {
      ac: true,
      message: "upload",
      time_created: 1624041025379,
      time_earned: 120000,
      url: "studio.youtube.com",
    },
    {
      ac: true,
      message: "check slingshot",
      time_created: 1624118531402,
      time_earned: 60000,
      url: "discord.com",
    },
    {
      ac: true,
      message: "sdf",
      time_created: 1624129309509,
      time_earned: 6000,
      url: "imgflip.com",
    },
    {
      ac: true,
      message: "upload vid + comments",
      time_created: 1624150023168,
      time_earned: 120000,
      url: "studio.youtube.com",
    },
    {
      ac: true,
      message: "5",
      time_created: 1624243195940,
      time_earned: 300000,
      url: "studio.youtube.com",
    },
    {
      ac: true,
      message: "ij",
      time_created: 1624320092546,
      time_earned: 60000,
      url: "discord.com",
    },
    {
      ac: true,
      message: "dsfa",
      time_created: 1624320398831,
      time_earned: 60000,
      url: "discord.com",
    },
    {
      ac: true,
      message: "hjb",
      time_created: 1624320662567,
      time_earned: 12000,
      url: "discord.com",
    },
    {
      ac: true,
      message: "5",
      time_created: 1624326560701,
      time_earned: 300000,
      url: "studio.youtube.com",
    },
    {
      ac: true,
      message: "10",
      time_created: 1624410935705,
      time_earned: 600000,
      url: "studio.youtube.com",
    },
    {
      ac: true,
      message: "jlk",
      time_created: 1624415216524,
      time_earned: 60000,
      url: "imgflip.com",
    },
    {
      ac: true,
      message: "safd",
      time_created: 1624415507080,
      time_earned: 6000,
      url: "imgflip.com",
    },
    {
      ac: true,
      message: "e",
      time_created: 1624415578452,
      time_earned: 60000,
      url: "imgflip.com",
    },
    {
      ac: true,
      message: ".1",
      time_created: 1624419417958,
      time_earned: 6000,
      url: "imgflip.com",
    },
    {
      ac: true,
      message: "jkl",
      time_created: 1624419451339,
      time_earned: 30000,
      url: "imgflip.com",
    },
    {
      ac: true,
      message: "1",
      time_created: 1624498777068,
      time_earned: 6000,
      url: "imgflip.com",
    },
    {
      ac: true,
      message: ".1",
      time_created: 1624498857778,
      time_earned: 6000,
      url: "imgflip.com",
    },
    {
      ac: true,
      message: "1",
      time_created: 1624498738617,
      time_earned: 60000,
      url: "studio.youtube.com",
    },
    {
      ac: true,
      message: "ijn",
      time_created: 1624500496374,
      time_earned: 12000,
      url: "studio.youtube.com",
    },
    {
      ac: true,
      message: "check comments",
      time_created: 1624571032402,
      time_earned: 60000,
      url: "studio.youtube.com",
    },
    {
      ac: true,
      message: "upload",
      time_created: 1624593982125,
      time_earned: 90000,
      url: "studio.youtube.com",
    },
    {
      ac: true,
      message: "uplad",
      time_created: 1624594920124,
      time_earned: 60000,
      url: "studio.youtube.com",
    },
    {
      ac: true,
      message: "afsd",
      time_created: 1624678095087,
      time_earned: 180000,
      url: "studio.youtube.com",
    },
    {
      ac: true,
      message: "up",
      time_created: 1624754015609,
      time_earned: 60000,
      url: "studio.youtube.com",
    },
    {
      ac: true,
      message: "gf",
      time_created: 1624754268514,
      time_earned: 6000,
      url: "studio.youtube.com",
    },
    {
      ac: true,
      message: "link thing in desc",
      time_created: 1624754344255,
      time_earned: 60000,
      url: "studio.youtube.com",
    },
    {
      ac: true,
      message: "uplado",
      time_created: 1624923875768,
      time_earned: 60000,
      url: "studio.youtube.com",
    },
    {
      ac: true,
      message: "sdf",
      time_created: 1624926515022,
      time_earned: 60000,
      url: "imgflip.com",
    },
    {
      ac: true,
      message: "gt",
      time_created: 1625858233614,
      time_earned: 12000,
      url: "studio.youtube.com",
    },
    {
      ac: true,
      message: "ijl",
      time_created: 1626127955624,
      time_earned: 60000,
      url: "mail.google.com",
    },
  ],
};

const useStorage = (showMessage, showPopup) => {
  const [blockedSites, setBlockedSites] = useState(undefined);
  const [currentSiteUrl, setCurrentSiteUrl] = useState(undefined);
  const [currentSiteFavicon, setCurrentSiteFavicon] = useState(undefined);
  const [siteBlockable, setSiteBlockable] = useState(undefined);
  const listenForUpdates = () => {
    chrome.storage?.onChanged.addListener(function (changes) {
      for (let [key, { newValue }] of Object.entries(changes)) {
        if (key === "blocked_sites") {
          setBlockedSites(newValue);
        }
      }
    });
  };

  const sendMessage = useCallback(
    (type, data, callback) => {
      data.type = type;
      console.log("sending", type, data);
      if (!chrome.runtime) {
        if (!callback) {
          showMessage({
            success: Math.random() > 0.5,
            message: type,
          });
        } else {
          callback({
            success: Math.random() > 0.5,
            message: true,
          });
        }

        return;
      }

      chrome.runtime.sendMessage(data, function (response) {
        if (!callback) {
          showMessage(response);
        } else {
          callback(response);
        }
      });
    },
    [showMessage]
  );
  const getSiteMeta = function () {
    return new Promise((re) => {
      if (!chrome.windows) {
        re({ url: "discord.com", favicon: "" });
      } else {
        chrome.windows.getCurrent((w) => {
          chrome.tabs.query({ active: true, windowId: w.id }, (tabs) => {
            let url = new URL(tabs[0].url).hostname;
            re({ url, favicon: tabs[0].favIconUrl, id: tabs[0].id });
          });
        });
      }
    });
  };
  const getDataFromKey = function (key) {
    return new Promise((re) => {
      if (chrome.storage) {
        chrome.storage.sync.get([key], function (result) {
          re(result[key] || {});
        });
      } else {
        re(data[key]);
      }
    });
  };

  const blockSite = function (URL) {
    sendMessage("block_site", {
      URL,
    });
  };
  const unblockSite = (URL) => {
    let siteEntry = blockedSites[URL];
    if (
      new Date() - siteEntry.date_blocked >= 24 * 60 * 60 * 1000 &&
      +new Date() < ((siteEntry.unblock_request?.end_time)||Infinity)&&false
    ) {
      showPopup("unblock_request");//TODO:
    } else {
      sendMessage("unblock_site", {
        URL,
      });
    }
  };
  useEffect(() => {
    const init = async () => {
      setBlockedSites(await getDataFromKey("blocked_sites"));
      let { url, favicon, id } = await getSiteMeta();
      setCurrentSiteUrl(url);
      setCurrentSiteFavicon(favicon);
      sendMessage("check_blockability", { TAB_ID: id }, (resp) => {
        setSiteBlockable(resp.message);
      });
      listenForUpdates();
    };
    init();
  }, [sendMessage]);

  return {
    currentSiteUrl,
    blockedSites,
    siteBlockable,
    currentSiteFavicon,
    blockSite,
    unblockSite,
  };
};
export default useStorage;
