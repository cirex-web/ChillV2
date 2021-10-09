/* eslint-disable no-restricted-globals */ //TODO: remove
/* global chrome */
/* global $ */

let blocked_sites, site_data, url;
getBlockedSites().then((res) => {
    blocked_sites = res;
    url = new URL(location.href).origin.replace("http://", "https://").replace("https://www.","https://");
    site_data = blocked_sites[url];
    main();
});



function main() {
    addStorageListener();
    setUpMessageRecieving();
    if (siteBlocked()) {
        console.log("blocking...");
        
        let style = document.documentElement.appendChild(document.createElement('style'));
        style.textContent = '* {display:none}';
        window.stop();
        beginBlock(style);
        // if(document.readyState === "interactive"){
        // }else{
        //     // window.stop();
        //     document.addEventListener("DOMContentLoaded", function() {
        //         beginBlock(style);
        //     });
        // }


    }
}
function setUpMessageRecieving(){
    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
          console.log(sender.tab ?
                      "from a content script:" + sender.tab.url :
                      "from the extension");
          sendResponse({success: true});
        }
      );
}
function addStorageListener() {
    chrome.storage.onChanged.addListener(function(changes) {
        for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
            if (key === "blocked_sites") {
                if (!oldValue||!newValue) {
                    location.reload();
                } else {

                    let old_site = oldValue[url];
                    let new_site = newValue[url];
                    if (JSON.stringify(old_site)!==JSON.stringify(new_site)) {
                        location.reload();
                    }
                }

                blocked_sites = newValue;
            }
        }
    });
}

function getBlockedSites() {
    return new Promise((re) => {
        chrome.storage.sync.get('blocked_sites', async function(result) {
            re(result['blocked_sites'] || {});

        });
    })

}

function siteBlocked() {
    console.log(site_data);
    if (!site_data || (site_data && !site_data.currently_blocked && site_data.reblock > +new Date())) {
        return false;
    } else {
        if(site_data.reblock <= +new Date()){
            sendMessage("block_site", { URL: url });
        }
        return true;
    }

}

function beginBlock(style) {
    console.log("beginning");
    const blockPageTemplate = '<html><head><title>Chilled!</title></head><body style="display:none !important;"></body></html>';
    document.documentElement.innerHTML = blockPageTemplate; 
    
    $("body").load(chrome.runtime.getURL("backend/html/blocked.html"), async() => {
        // Doesn't load input field but here's the css import
        
        var cssURL = chrome.runtime.getURL("backend/html/styles.css");
        var newstyle = document.createElement("link"); // Create a new link Tag
        newstyle.setAttribute("rel", "stylesheet");
        newstyle.setAttribute("type", "text/css");
        newstyle.setAttribute("href", cssURL);
        newstyle.onload = ()=>{
            $("body").css("display","flex");
        }
        document.getElementsByTagName("body")[0].appendChild(newstyle);

        if (site_data.request) {
            //check if it's outdated already
            if (new Date() >= site_data.request.end_time) {
                $("#message").html("\"" + site_data.request.message + "\"");
                $("#3").addClass("visible");

                $("#yes").on('click', () => {
                    sendMessage("process_request", {
                        URL: url,
                        AC: true
                    });
                });
                $("#no").on('click', () => {
                    sendMessage("process_request", {
                        URL: url,
                        AC: false
                    });
                });

            } else {
                $("#2").addClass("visible");
                beginCountdown();
            }

        } else {
            console.log("here");
            setUpForm();
        }
    });
}

function setUpForm() {
    $("#1").addClass("visible");
    showId("q1");
    let message;
    $("#next-request-button").on('click', (ev) => {
        message = $(ev.target).parent().find("input").val();
        if (message != "") {
            $("#q1").css("opacity", 0);
            setTimeout(() => {
                showId("q2");
                $("#q1").hide();
            }, 200);

        }
    });
    $("#next-request-input")[0].addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
          event.preventDefault();
          $("#next-request-button").click();
        }
      });


    $("#send-request-button").on('click', (ev) => {
        let time = $(ev.target).parent().find("input").val();
        if (time !== "" && !isNaN(time)) {
            time = parseFloat(time);
            sendMessage("add_request", {
                URL: url,
                TXT: message,
                WAIT_TIME: time * 3,
                TIME: time

            }).then(() => {
                $("#q2").css("opacity", 0);
                
            });
        }
    });
}

function showId(id) {
    $("#" + id).css("display","block");

    setTimeout(() => {

        $("#" + id).css("opacity", 1);
    }, 100);
}

function beginCountdown() {
    let prev = "";
    let interval = setInterval(() => {
        let dif = site_data.request.end_time - new Date();
        if (dif < 0) {
            clearInterval(interval);
            location.reload();
            return;
        }
        let str = createTimeString(dif);
        if (prev !== str) {
            prev = str;
            $("#time").html(str);
        }
    }, 10);
}


function createTimeString(dif) {
    let ms = "" + dif % 1000;
    dif = Math.floor(dif / 1000);
    let s = "" + dif % 60;
    dif = Math.floor(dif / 60);
    let m = "" + dif % 60;
    dif = Math.floor(dif / 60);
    let h = "" + dif;
    if (h == 0) {
        return m.padStart(2, 0) + ":" + s.padStart(2, 0);
    } else {
        return h.padStart(2, 0) + ":" + m.padStart(2, 0) + ":" + s.padStart(2, 0);
    }
}

function sendMessage(type, data) {
    return new Promise((re) => {
        data.type = type;
        chrome.runtime.sendMessage(data, function(response) {
            re(response);
        });
    });
}
