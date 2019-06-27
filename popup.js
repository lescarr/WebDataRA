var bgPage=chrome.extension.getBackgroundPage();
var bid, b2id, b3id, b4id, bid5, eid;

window.addEventListener('load', function (evt) {
	bid=document.getElementById('saveOutput');
	bid.addEventListener("click", saveOutput, false);
	b2id=document.getElementById('clearOutput');
	b2id.addEventListener("click", clearOutput, false);
	b3id=document.getElementById('startOutput');
	b3id.addEventListener("click", startOutput, false);
	b4id=document.getElementById('refreshDisplay');
	b4id.addEventListener("click", refreshDisplay, false);
	b5id=document.getElementById('scrollDown');
	b5id.addEventListener("click", scrollDown, false);

	eid=document.getElementById('pagetitle');
	if(!eid)eid=document.getElementById('title');
	refreshDisplay()
});

chrome.runtime.onMessage.addListener(function (message, sender, respond) {
        if(message.tag=="refresh"){
		refreshDisplay();
		return
		}
        else if(message.tag=="cleared"){
		refreshDisplay();
		return
		}
});

function refreshDisplay(){
	if(bgPage.started==true){
		if(bgPage.STUFF=="")eid.innerHTML="Starting to collect data. Please wait a few seconds..."
		else eid.innerHTML=bgPage.STUFF
		bid.classList.remove("dissed")
		b2id.classList.remove("dissed")
		b3id.classList.add("dissed")
		}
	else {
		eid.innerHTML="All data has been cleared."
		bid.classList.add("dissed")
		b2id.classList.add("dissed")
		b3id.classList.remove("dissed")
		}

	}

function saveAsFile(link, content, filename) {
    // http://stackoverflow.com/a/16330385/574981
    var blob = new Blob([content], {type: "text/html"});
    var url  = URL.createObjectURL(blob);
    
    var a = link;
    a.download    = filename;
    a.href        = url;
    }

function saveOutput(){
    saveAsFile(bid, document.getElementById("pagetitle").outerHTML, "TwitterRA-"+new Date().toISOString().substring(0,19)+".html");
}

function clearOutput(){
    chrome.runtime.sendMessage({tag: "clear"});
    }

function scrollDown(){
    chrome.runtime.sendMessage({tag: "scrollDown"});
    }

function startOutput(){
    if(bgPage.STATE=="off" || bgPage.STATE=="preparing")chrome.runtime.sendMessage({tag: "start"});
    refreshDisplay()
    }
