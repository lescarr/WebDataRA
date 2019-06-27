var ALREADYUSED=false // in this state, the popup knows to inject the content
//script into the new content page and start the cycle of abuse

var STUFF="" // this is where the record of the abuse is kept

//Wait for a content script to make contact
//it means that a new page is being scraped
chrome.extension.onConnect.addListener(function(port) {
  //and wait for it to die, so that the context is reset
  port.onDisconnect.addListener(function() { STUFF=""; ALREADYUSED=false});
});
