/* eslint-disable no-restricted-globals */
/*global chrome*/
let fromTab = window.location.search.substring(1)==="";
if(fromTab){
  document.getElementById("root").style.display = 'none';
  document.getElementById("notice").style.display = 'block';
}
navigator.serviceWorker.getRegistrations().then((re) => {
  if (!re.length) {
    navigator.serviceWorker
      .register(chrome.runtime.getURL("service_worker.js"))
      .then(
        function (registration) {
          // Registration was successful
          console.log(
            "ServiceWorker registration successful with scope: ",
            registration.scope
          );
        },
        function (err) {
          // registration failed :(
          console.log("ServiceWorker registration failed: ", err);
        }
      ).finally(()=>{
        if(!fromTab){
          location.reload();
        }else{
          window.close();

        }
      });
  }
});
