/* global chrome */

chrome.runtime.onMessage.addListener(

    function (request, sender, sendResponse) {

        console.log("__");
        console.log(request);
        switch (request.type) {
            case "block_site": {
                block_site(request.URL).then((res) => {
                    printDatabase();
                    sendResponse(res);
                });
                break;
            }
            case "add_request":{
                addRequest(request.URL,request).then((res)=>{
                    printDatabase();
                    sendResponse(res);
                });
                break;
            }
            case "process_request":{
                
                processRequest(request.URL,request.AC).then(()=>{
                    printDatabase();
                    printRequests();
                    sendResponse("request processed!");
                });
                break;
            }
            default : {
                sendResponse("Invalid request");
            }
        }
        
    
        return true;
    }
);
function printDatabase(){
    getKeyFromStorage("blocked_sites").then((re)=>console.log(re));
}
function printRequests(){
    getKeyFromStorage("requests").then((re)=>console.log(re));

}
async function block_site(url) {
    let blocked_sites = await getKeyFromStorage('blocked_sites') || {};
    
    // console.log(blocked_sites);
    if (!blocked_sites[url]) {

        blocked_sites[url] = {
            date_blocked: + new Date(),
            currently_blocked: true
        }
        setKeyAndData("blocked_sites",blocked_sites);
        return "Successfully blocked " + url;
    } else {
        blocked_sites[url].currently_blocked = true;
        if(blocked_sites[url].request){
            delete blocked_sites[url].request; //just to clear all previous data
        }
        setKeyAndData("blocked_sites",blocked_sites);
        return url + " is already blocked!";
    }
}
async function addRequest(url, req){
    // console.log(url,req);
    let blocked_sites = await getKeyFromStorage('blocked_sites') || {};
    blocked_sites[url].request = {
        end_time: +new Date()+req.WAIT_TIME*60*1000,
        message: req.TXT,
        reward_time: req.TIME*60*1000,
        time_created: + new Date()
    }
    console.log("added request",blocked_sites[url].request);
    setKeyAndData("blocked_sites",blocked_sites);
    return "Added request";
}
async function processRequest(url, accepted){
    let blocked_sites = await getKeyFromStorage('blocked_sites') || {};
    let requests = await getKeyFromStorage('requests') || [];
    let site_request = blocked_sites[url].request;
    let ac = false;
    if(accepted){
        blocked_sites[url].currently_blocked = false;
        blocked_sites[url].reblock = + new Date() + site_request.reward_time;
        ac = true;
        console.log("Starting reward");
        setTimeout(()=>{
            console.log("Reward over!");
            blocked_sites[url].currently_blocked = true;
            delete blocked_sites[url].reblock;
            setKeyAndData("blocked_sites",blocked_sites);

        }, site_request.reward_time);
    }
    console.log("here",site_request);
    requests.push({
        url: url,
        ac: ac,
        time_earned: site_request.reward_time,
        message: site_request.message,
        time_created: site_request.time_created
    });
    delete blocked_sites[url].request;

    setKeyAndData("blocked_sites",blocked_sites);
    setKeyAndData("requests",requests);

}
function getKeyFromStorage(key) {
    return new Promise((re) => {
        chrome.storage.sync.get([key], function (result) {
            re(result[key]);
        });
    });
}
function setKeyAndData(key, data){
    chrome.storage.sync.set({[key]: data});
}