var SLOG=""
var STUFF="";
var ACCOUNTS=[];
var DONEACCOUNTS=[]
var lastURL="";
var lastAccount="";
var nextAccount="";
var stabid=null;
var started=false;
var LASTSTATUS="";
var STATE="off"; // one of {off, scrolling, waiting, receivedPrimary, receivingSecondaries, finished}


// Listen to messages from the payload.js script 
chrome.runtime.onMessage.addListener(function (message, sender, respond) {
	SLOG+="++MESSAGE["+message.tag+"]++\n" //debugging suplicate messages
	if(message.tag=="helo"){
		stabid=sender.tab.id;
		if(STATE=="receivingSecondaries")respond({tag:"kickStart", pageType:"secondary"});
		else respond({tag:"doNothing"})
		return;
		}
	if(message.tag=="clear"){
		STUFF=""; ACCOUNTS=[]; DONEACCOUNTS=[]; lastURL=""; started=false;
		if(STATE=="preparing")chrome.tabs.sendMessage(stabid, {tag:"kickStop"})
		STATE="off";
		SLOG+="**CLEARED**\n"
		respond({tag:"cleared"});
		return;
		}
	if(message.tag=="scrollDown" && STATE=="off"){
		STUFF=""; ACCOUNTS=[]; DONEACCOUNTS=[]; lastURL="";
		started=false;
		STATE="preparing"
		chrome.tabs.sendMessage(stabid, {tag:"scrollDown"})
		}
	if(message.tag=="start" && (STATE=="off" || STATE=="preparing")){
		STUFF=""; ACCOUNTS=[]; DONEACCOUNTS=[]; lastURL="";
		started=true;
		STATE="waiting";
		chrome.tabs.sendMessage(stabid, {tag:"kickStart", pageType:"primary"})
		}
	if(message.tag.startsWith("twitter") && STATE=="waiting"){
		STUFF=message.data; ACCOUNTS=message.accounts; lastURL=message.url; lastAccount="";
		chrome.runtime.sendMessage({tag:"refresh"});
		STATE="receivedPrimary";
		if(fireOffNextUserAccount())STATE="receivingSecondaries";
		}
	else if(message.tag.startsWith("twitter") && STATE=="receivingSecondaries"){
		//is this the first secondary?
		if(DONEACCOUNTS.length==1) STUFF+="<p></p>"+message.data;
		else {SLOG+="DELETING:"+STUFF.substring(STUFF.length-8)+":\n";STUFF=STUFF.substring(0,STUFF.length-8)+"<WTF/>"+message.data.substring(message.data.indexOf("</th></tr><tr")+10)}
		lastURL=message.url; lastAccount=lastURL.substring(20);
		LASTSTATUS="LastAccount: '"+lastAccount+"', NextAccount: '"+nextAccount+"'"
		chrome.runtime.sendMessage({tag:"refresh"});
		if(!fireOffNextUserAccount())STATE="finished";
		}
	else if(message.tag.startsWith("quora") && STATE=="waiting"){
		STUFF=message.data; ACCOUNTS=message.accounts; lastURL=message.url; lastAccount="";
		chrome.runtime.sendMessage({tag:"refresh"});
		STATE="receivedPrimary";
		if(fireOffNextUserAccount())STATE="receivingSecondaries";
		}
	else if(message.tag.startsWith("quora") && STATE=="receivingSecondaries"){
		//is this the first secondary?
		if(DONEACCOUNTS.length==1) STUFF+="<p></p>"+message.data;
		else {SLOG+="DELETING:"+STUFF.substring(STUFF.length-8)+":\n";STUFF=STUFF.substring(0,STUFF.length-8)+"<WTF/>"+message.data.substring(message.data.indexOf("</th></tr><tr")+10)}
		lastURL=message.url; lastAccount=lastURL.substring(20);
		LASTSTATUS="LastAccount: '"+lastAccount+"', NextAccount: '"+nextAccount+"'"
		chrome.runtime.sendMessage({tag:"refresh"});
		if(!fireOffNextUserAccount())STATE="finished";
		}
	else SLOG+="---MISSEDMESSAGE["+message.tag+"] in STATE("+STATE+")---\n"
});
	
function fireOffNextUserAccount(){
	var theURL=""
	if(ACCOUNTS.length>0){
		nextAccount=ACCOUNTS.shift();
		//sometimes a rogue blank account slips through
		while(ACCOUNTS.length>0 && nextAccount=="")nextAccount=ACCOUNTS.shift();
		DONEACCOUNTS.push(nextAccount)
		if(nextAccount.startsWith("https://www.quora.com/"))
			theURL=nextAccount
		else theURL="https://twitter.com/"+nextAccount
		chrome.tabs.update(stabid, {url: theURL});
		return(true)
		}
	else {
		return(false);
		}
	}
