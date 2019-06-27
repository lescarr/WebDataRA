var bgPage=chrome.extension.getBackgroundPage();
var LIMIT=2000000
var bid;


if(!bgPage.ALREADYUSED){
bgPage.ALREADYUSED=true
// Inject the payload.js script into the current tab after the popout has loaded
window.addEventListener('load', function (evt) {
	chrome.extension.getBackgroundPage().chrome.tabs.executeScript(null, {
		file: 'payload.js'
	});;

	bid=document.getElementById('saveOutput');
	if(bid)bid.addEventListener("click", saveOutput, false);
});
}


// Listen to messages from the payload.js script and write to popout.html
chrome.runtime.onMessage.addListener(function (message) {
	var eid=document.getElementById('pagetitle');
	if(!eid)eid=document.getElementById('title');
	if(eid){
		var str
		var offset=0
		var start = message.url.search(/[?&]start=/) // GOOGLE & scholar
		if(start<0) start=message.url.search(/[?&]npage=/) // SSRN
		if(start<0) start=message.url.search(/[?&]page=/) // Core
		if(start<0) start=message.url.search("[?&]p=") //github
		if(start<0){
			//JUST TESTING. DELETE COMMENTS WHEN FINISHED
			bgPage.STUFF="";
			offset=0;
			}
		else{
			var realStart=message.url.indexOf("=",start);
			str=message.url.substr(realStart+1);
			var end=str.indexOf("&");
			if(end>0)str=str.substr(0,end);
			offset=str*1
			}
		//if(offset==0)bgPage.STUFF=message.data
		if(offset==0)bgPage.STUFF="<p>Captured "+message.nrecs+" records.</p>"+message.data
		else if(offset<0)bgPage.STUFF+="<hr>"+message.data //DELETE THIS
		else bgPage.STUFF=bgPage.STUFF.slice(0,-7)+message.data.substr(8);

		eid.innerHTML = bgPage.STUFF;
		if(bgPage.STUFF.length<LIMIT){
			//copyToClipboard(bgPage.STUFF);
    			//saveAsFile(bid, bgPage.STUFF, "WebDataRA-"+new Date().toISOString().substring(0,19)+".html");
			}
		else{
			eid.innerHTML="<p style='color:red'><b>WARNING: The results are too big to be automatically copied to the clipboard. You may still save the spreadsheet data to an HTML file and open the file in Excel.</p>"+eid.innerHTML
			}
		}
});


function copyToClipboard(text) {
  const input = document.createElement('input');
  input.style.position = 'fixed';
  input.style.opacity = 0;
  input.value = text;
  document.body.appendChild(input);
  input.select();
  document.execCommand('Copy');
  document.body.removeChild(input);
};

function saveAsFile(link, content, filename) {
    // http://stackoverflow.com/a/16330385/574981
    var blob = new Blob([content], {type: "text/html"});
    var url  = URL.createObjectURL(blob);
    
    console.log("update download link:");
    var a = link;
    a.download    = filename;
    a.href        = url;
    }

function saveOutput(){
    console.log("saveOutput clicked");
    saveAsFile(bid, document.getElementById("pagetitle").outerHTML, "WebDataRA-"+new Date().toISOString().substring(0,19)+".html");
}
