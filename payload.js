// send the page title as a chrome message
//notes on PLATFORM at the bottom of the file

var CATEGORIES=[];
var PLATFORM=[];
var FEATURECOUNT=[];
var FEATURENOTE=[];
var ACCOUNTS=[];
var COLOR=[]
var nRecs=0;
const OneDayInSecs=86400


PLATFORM["QuoraQuestion"]=[
	{name:'row', element:'div.UnifiedAnswerPagedList div.pagedlist_item div.Answer', direction:1, features:1, multipage:0, autoScroll:1},
	{name:'Author Name', element:'div.Answer a.user'},
	{name:'Author', element:'div.Answer a.user', attribute:'href', transform:x=>"https://www.quora.com"+x},
	{name:'Credential', element:'div.feed_item_answer_user span.NameCredential', transform:x=>x.indexOf(", ")==0 ? x.substring(2): x},
	//{name:'Truncated', element:'div.ui_qtext_truncated_text'},
	{name:'Answer Text', element:'div.ui_qtext_expanded'},
	{name:'Timestamp', element:'a.answer_permalink'},
	{name:'ID', element:'a.answer_permalink', attribute:'href', transform:x=>"https://www.quora.com"+x}
	]

PLATFORM["QuoraProfile"]=[
	{name:'row', element:'div.UserPage', direction:1, features:0, multipage:0, autoScroll:0},
	{name:'ID', element:'div.ProfileNameAndSig span.user'},
	{name:'Credential', element:'div.ProfileNameAndSig span.UserCredential'},
	{name:'Description', element:'div.ProfileDescription'},
	{name:'Followers', element:'li.FollowersNavItem span.list_count'},
	{name:'Following', element:'li.FollowingNavItem span.list_count'},
	{name:'Questions', element:'li.QuestionsNavItem span.list_count'},
	{name:'Answers', element:'li.AnswersNavItem span.list_count'},
	{name:'Work', element:'div.WorkCredentialListItem'},
	{name:'School', element:'div.SchoolCredentialListItem'},
	{name:'Location', element:'div.LocationCredentialListItem'},
	{name:'Topic1', element:'li.ProfileExperienceItem:nth-child(1) a.topic_name'},
	{name:'Topic2', element:'li.ProfileExperienceItem:nth-child(2) a.topic_name'},
	{name:'Topic3', element:'li.ProfileExperienceItem:nth-child(3) a.topic_name'},
	{name:'Topic4', element:'li.ProfileExperienceItem:nth-child(4) a.topic_name'},
	{name:'Topic5', element:'li.ProfileExperienceItem:nth-child(5) a.topic_name'}
	]


PLATFORM["twitteruser"]=[
	{name:'row', element:'div#page-container', direction:-1, features:0, multipage:0},
	{name:'Full Name', element:'a.ProfileHeaderCard-nameLink'},
	{name:'Username', element:'span.username', transform:(x)=>x.substring(1)},
	{name:'Bio', element:'p.ProfileHeaderCard-bio'},
	{name:'Location', element:'span.ProfileHeaderCard-locationText'},
	{name:'URL', element:'span.ProfileHeaderCard-urlText a', attribute:'title'},
	{name:'Joined', element:'span.ProfileHeaderCard-joinDateText', attribute:'data-original-title', transform:function(x){return(x.substring(x.indexOf(" - ")+3))}},
	{name:'Tweets', element:'li.ProfileNav-item--tweets span.ProfileNav-value', attribute:'data-count'},
	{name:'Following', element:'li.ProfileNav-item--following span.ProfileNav-value', attribute:'data-count'},
	{name:'Followers', element:'li.ProfileNav-item--followers span.ProfileNav-value', attribute:'data-count'},
	{name:'Likes', element:'li.ProfileNav-item--favorites span.ProfileNav-value', attribute:'data-count'},
	{name:'Self-penned', featurecount:"Author", index:"username"},
	{name:'Ignored', featurecount:"NonResponse", index:"username"},
	{name:'Days Ago', featurecount:"DaysAgo"}
	]

PLATFORM["twitter"]=[
	{name:'row', element:'li.stream-item', direction:-1, features:1, multipage:0},
	{name:'ID', element:'', attribute:'data-item-id', transform:function(x){return '"'+x+'"'}},
	{name:'Author', element:'.tweet-timestamp', attribute:'href', transform:function(x){y=x.indexOf("/",1);return x.substring(1,y)}},
	{name:'Replies', element:'div.ProfileTweet-action--reply span.ProfileTweet-actionCount'},
	//Likes and Retweets may be rounded off to 1.2K or similar
	{name:'Retweets', element:'div.ProfileTweet-action--retweet span.ProfileTweet-actionCount', transform:function(x){return x.replace(/\.(\d)K/,'$1'+'00').replace(/K/,'000')} },
	{name:'Likes', element:'div.ProfileTweet-action--favorite span.ProfileTweet-actionCount', transform:function(x){return x.replace(/\.(\d)K/,'$1'+'00').replace(/K/,'000')} },
	{name:'NonResponse', special:'NonResponse'},
	{name:'Unusual', special:'Unusual'},
	// there is a separate place the original tweet author goes if this is a retweet. Get the original author from the URL instead
	//{name:'Author', element:'a.js-user-profile-link', attribute:'href', transform:function(x){return x.substring(1)}},
	{name:'Mentions', element:'.tweet', attribute:'data-mentions'},
	{name:'Reply To', element:'.ReplyingToContextBelowAuthor a', attribute:'href', transform:(x)=>x.substring(1)},
	{name:'Retweet', element:'.Icon--retweeted', transform:(x)=>"retweet"},
	{name:'Hashtags', element:'.js-tweet-text', transform:function(x){var sani=x.replace(/http\S+/g,'').replace(/pic.twitter.com\S+/g,''); var ht=sani.match(/\#\S+/g); return ht ? ht.join(" ") : "" }},
	// Doesn't exist in the standard tweetstream {name:'Place', element:'.permalink-tweet-geo-text', transform:function(x){ return x.replace(/from /,'')} },
	{name:'Text', element:'.js-tweet-text'},
	{name:'URL', element:'.tweet-timestamp', attribute:'href', transform:function(x){return "https://twitter.com"+x}},
	//{name:'Timestamp', element:'.tweet-timestamp ._timestamp', transform:function(x){return x}},
	{name:'Timestamp', element:'a.tweet-timestamp', attribute:'data-original-title', transform:function(x){return x.replace(/.* - /,'')}},
	{name:'Seconds', element:'.tweet-timestamp span', attribute:'data-time'}, //IMPORTANT NAME
	{name:'Days Ago', special:"DaysAgo"},
	{name:'Sanitised Text', element:'.js-tweet-text', transform:function(x){return x.replace(/http\S+/g,'').replace(/pic.twitter.com\S+/g,'').replace(/\B[\#@]\w+/g, '') }}
	];

FEATURECOUNT["Author"]=[];
FEATURECOUNT["Author2"]=[];
FEATURECOUNT["Mentions"]=[];
FEATURECOUNT["Mentions2"]=[];
FEATURECOUNT["Hashtags"]=[];
FEATURECOUNT["NonResponse"]=[];
FEATURECOUNT["DaysAgo"]=[];
FEATURECOUNT["IDs"]=[];

PLATFORM["template"]=[
	{name:'row',element:'', direction:-1, features:0, multipage:0},
	{name:'ID', element:''},
	{name:'Replies', element:''},
	{name:'Retweets', element:''},
	{name:'Likes', element:''},
	{name:'Author', element:''},
	{name:'Text', element:''},
	{name:'URL', element:''},
	{name:'Timestamp', element:''},
	{name:'Seconds since 1/1/1970', element:''}
	];

COLOR['User']=['#FF69B4','#FFB6C1','#FFE4E1'];
COLOR['Contents']=['#E5E7E9','#F2F3F4','#F8F9F9'];
COLOR['Hashtags']=['#85C1E9','#D6EAF8', '#EBF5FB'];
COLOR['Network']=['#F7DC6F','#FCF3CF', '#FEF9E7'];
COLOR['Accounts']=['#7DCEA0','#D4EFDF', '#E9F7EF'];

function platformToString(pName){
	var platform=PLATFORM[pName];
	var recs=document.querySelectorAll(platform[0].element);
	var colorChoice=COLOR['Contents']
	if(pName.endsWith("user")||pName.endsWith("rofile"))colorChoice=COLOR['User']
	
	var s="";

	if(platform[0].features==1){
		//reset all features
		//leaving features to be used by subsequent calls on the same page
		FEATURECOUNT["Author"]=[];
		FEATURECOUNT["Author2"]=[];
		FEATURECOUNT["Mentions"]=[];
		FEATURECOUNT["Mentions2"]=[];
		FEATURECOUNT["Hashtags"]=[];
		FEATURECOUNT["Hashtags2"]=[];
		FEATURECOUNT["Edges"]=[];
		FEATURECOUNT["NonResponse"]=[];
		FEATURECOUNT["DaysAgo"]=[];
		}
	
	var nthHead="<th>N</th>";
	var nthStart="";

	nRecs=recs.length
	if(nRecs>0){
		s+="<table><tr style='background:" + colorChoice[0] + "'>"+nthHead
		for(i=1;i<platform.length;i++){
		  var p=platform[i].name
		  var attr= (p=="URL" ? "style='width:10%'" : "")
		  s+="<th "+attr+">"+p+"</th>"
		  }
		s+="</tr>"

		var rowcol=0
		var pgPrefix=""
		if(platform[0].multipage==1)pgPrefix=curPage+"."
		for(i=(platform[0].direction>0 ? 0 : recs.length-1); (i>=0 && i<recs.length); i+=platform[0].direction){
		  nthStart="<td>"+pgPrefix+((i+1)+'').padStart(3,'0')+"</td>"
		  s+="<tr valign='top'  style='background:" + colorChoice[1+rowcol] + "'>"
		  s+=nthStart
		  rowcol = (rowcol + 1) % 2
		  if(platform[0].features==1)FEATURENOTE=[];

		  for(j=1;j<platform.length;j++){
		    var theNode=recs[i]
		    var theRes=""

		    if(platform[j].special){
			if(platform[j].special=="NonResponse"){
			    //Add an extra inferred FEATURE: NonResponse (yes if this tweet had no retweets, likes or replies)
			    if((FEATURENOTE["Retweets"]  && FEATURENOTE["Retweets"].length>0) || (FEATURENOTE["Likes"] && FEATURENOTE["Likes"].length>0)|| (FEATURENOTE["Replies"] && FEATURENOTE["Replies"].length>0))theRes=""
			    else theRes="1"
			    }
			else if(platform[j].special=="DaysAgo"){
			   theRes=Math.round((Math.round(new Date().getTime() / 1000) - parseInt(FEATURENOTE["Seconds"]))/OneDayInSecs)+"";
			   }
			else if(platform[j].special=="Unusual"){
			   //is this tweet promoted or pinned
		           if(theNode.querySelector("div.context .Icon--promoted"))theRes="promoted"
			   else if(theNode.querySelector("div.user-pinned"))theRes="pinned"
			   else theRes=""
			   }
			else theRes=""
			theNode=null
			}
		    else if(platform[j].featurecount){
			//assuming the featurecount is going to be indexed by the username, and that's in the tweet URL (yuk)
			var whoami=document.location.href.substring(20)
			if(whoami.indexOf("/")>0)whoami=whoami.substring(0,whoami.indexOf("/"))
			var dct=FEATURECOUNT[platform[j].featurecount]
			if(dct){
				if(dct[whoami])theRes=dct[whoami]+""
				else theRes=""
				}
			else theRes=""
			theNode=null
			}
		    else if(platform[j].element){
			theNode=theNode.querySelector(platform[j].element);
			}

		    if(theNode){
		      if(platform[j].attribute){
			var attr=platform[j].attribute
			theRes=theNode.getAttribute(attr);

			//this gets really hacky, but it seems to work for the data-original-title of Twitter
			if(theRes == null && attr.startsWith("data-original-")){
				attr=attr.substr(14)
				theRes=theNode.getAttribute(attr);
				}
			//hack - if the attribute name is data-X and
			//it doesn't exist, try just X. it works for google
			if(theRes == null && attr.startsWith("data-")){
				attr=attr.substr(5)
				theRes=theNode.getAttribute(attr);
				if(theRes==null)theRes="";
				}
			}
		      else {
			theRes=theNode.textContent
			if(platform[j].except){
			  theNode=theNode.querySelector(platform[j].except);
			  if(theNode){
			    var theExceptStr=theNode.textContent
			    //this SHOULD remove from beginning or end and CHECK
			    theRes=theRes.substr(theExceptStr.length-1)
			    }
			}
		      }

		    if(platform[j].transform){
			theRes=platform[j].transform(theRes)
			}
		    
		    }

		    if(typeof theRes === "string")theRes=theRes.trim()
		    else theRes=""

//*** START OF FEATURE PROCESSING ***
		    //the 'feature' has been dealth with, it's in theRes.
		    //now store it away in case it's needed as a the distinguished feature
		    if(platform[0].features==1)FEATURENOTE[platform[j].name]=theRes;

		    //count the number of unique authors in the Twitter list
		    if(platform[0].features==1 && platform[j].name=="Author"){

		    var dct=FEATURECOUNT[platform[j].name];
		    var dct2=FEATURECOUNT[platform[j].name+"2"];
		    if(dct){
			if(dct[theRes]) dct[theRes]++;
			else dct[theRes]=1;
			}
		    if(dct2){
			var RTs=0
			var RTStr=FEATURENOTE["Retweets"];
			if(RTStr!=null && RTStr.length>0)RTs=parseInt(RTStr,10);
			if(isNaN(RTs))RTs=0;
			if(dct2[theRes]) dct2[theRes]+=RTs+1;
			else dct2[theRes]=RTs+1;
			}
		     }

		    //count the number of unique mentions in the Twitter list
		    if(platform[0].features==1 && platform[j].name=="Mentions" && theRes.length>0){

		    var dct=FEATURECOUNT[platform[j].name];
		    var dct2=FEATURECOUNT[platform[j].name+"2"];
		    var dct3=FEATURECOUNT["Edges"];
		    var source=FEATURENOTE["Author"];

		    // but but but unlike authors, each tweet can have multiple mentions. sigh...
		    var theMentions=theRes.split(" ");
		    for(var key in theMentions){
		    var men=theMentions[key];

		    if(dct){
			if(dct[men]) dct[men]++;
			else dct[men]=1;
			}
		    if(dct2){
			var RTs=0
			var RTStr=FEATURENOTE["Retweets"];
			if(RTStr!=null && RTStr.length>0)RTs=parseInt(RTStr,10);
			if(isNaN(RTs))RTs=0;
			if(dct2[men]) dct2[men]+=RTs+1;
			else dct2[men]=RTs+1;
			}

		    //add in the author-mention edge for the graph
		    if(dct3){
			var k=source+" "+men;
			if(dct3[k])dct3[k]++;
			else dct3[k]=1;
			}

		     }

		     }

		    //count the number of unique hashtags in the Twitter list
		    if(platform[0].features==1 && platform[j].name=="Hashtags" && theRes.length>0){

		    var dct=FEATURECOUNT[platform[j].name];
		    var dct2=FEATURECOUNT[platform[j].name+"2"];

		    // but but but unlike authors, each tweet can have multiple hashtags. sigh...
		    var theHashtags=theRes.split(" ");
		    for(var key in theHashtags){
		    var ht=theHashtags[key];

		    if(dct){
			if(dct[ht]) dct[ht]++;
			else dct[ht]=1;
			}
		    if(dct2){
			var RTs=0
			var RTStr=FEATURENOTE["Retweets"];
			if(RTStr!=null && RTStr.length>0)RTs=parseInt(RTStr,10);
			if(isNaN(RTs))RTs=0;
			if(dct2[ht]) dct2[ht]+=RTs+1;
			else dct2[ht]=RTs+1;
			}

		     }

		     }

//DOES THIS WORK???
		    if(platform[0].features==1 && platform[j].special && platform[j].special=="DaysAgo" && theRes.length>0){ // BUT ITS NOT CALLED THAT
			//store the oldest tweet "seconds", as long as its not promoted or pinned and as long as the author is kosher
		        var dct=FEATURECOUNT[platform[j].special];
			var auth=FEATURENOTE["Author"];
		        if(dct && !FEATURENOTE["Unusual"]){
			  var theSecs=parseInt(theRes);
			  if(dct[auth]) {if(dct[auth]<theSecs)dct[auth]=theSecs;}
			  else dct[auth]=theSecs;
			  }
			}


		    if(platform[0].features==1 && platform[j].name=="NonResponse" && theRes.length>0){
		        var dct=FEATURECOUNT[platform[j].name];
			var auth=FEATURENOTE["Author"];
		        if(dct){
			  if(dct[auth]) dct[auth]++;
			  else dct[auth]=1;
			  }
		    }

//***END FEATURE PROCESSING ***

		    s+="<td>"+theRes+"</td>"

		  };
		  s+="</tr>"

                  if(platform[0].features==1){
			var fN=FEATURENOTE["ID"]
                  	if(fN && !FEATURECOUNT["IDs"].includes(fN)){
                  	  FEATURECOUNT["IDs"].push(fN)
                    	}
		     }

		}
		s+="</table>"

		if(platform[0].features==1){
		ACCOUNTS=[];
		if(FEATURECOUNT["Author"]){
			var dct=FEATURECOUNT["Author"]
			for(var k in dct){
				ACCOUNTS.push(k);
				}
			}
		if(FEATURECOUNT["Mentions"]){
			var dct=FEATURECOUNT["Mentions"]
			for(var k in dct){
				if(!ACCOUNTS.includes(k))ACCOUNTS.push(k);
				}
			}
		s+="<p></p>"
		s+="<table><tr style='background:"+ COLOR['Accounts'][0] +"'><th>Account</th><th>Author Count</th><th>...Inc RTs</th><th>Mention Count</th><th>...Inc RTs</th><th>NonResponse Count</th><th>Days Ago</th></tr>"
		ACCOUNTS.filter(v=>v!='') //remove blank entries - e.g. quora
		ACCOUNTS.sort();
		
		rowcol=0
		for(var k in ACCOUNTS){
			var v1=FEATURECOUNT["Author"][ACCOUNTS[k]], s1=v1?v1+"":"";
			var v2=FEATURECOUNT["Author2"][ACCOUNTS[k]], s2=v2?v2+"":"";
			var v3=FEATURECOUNT["Mentions"][ACCOUNTS[k]], s3=v3?v3+"":"";
			var v4=FEATURECOUNT["Mentions2"][ACCOUNTS[k]], s4=v4?v4+"":"";
			var v5=FEATURECOUNT["NonResponse"][ACCOUNTS[k]], s5=v5?v5+"":"";
			var v6=FEATURECOUNT["DaysAgo"][ACCOUNTS[k]], s6=v6?v6+"":"";
			s+="<tr style='background:"+ COLOR['Accounts'][1+rowcol] +"'><td><a href='http://twitter.com/"+ACCOUNTS[k]+"'>"+ACCOUNTS[k]+"</a></td><td>"+s1+"</td><td>"+s2+"</td><td>"+s3+"</td><td>"+s4+"</td><td>"+s5+"</td><td>"+s6+"</td></tr>"
			rowcol=(rowcol+1)%2
			}
		s+="</table>"

		s+="<p></p>"
		s+="<table><tr style='background:"+ COLOR['Network'][0] +"'><th>Source</th><th>Target</th><th>Weight</th></tr>"
		var dct=FEATURECOUNT["Edges"]
		var keys = Object.keys(dct);
		rowcol=0
		for(var k in keys.sort()){
			var v=keys[k];
			var a=v.split(" ");
			var src=a[0], dst=a[1];
			s+="<tr style='background:"+ COLOR['Network'][1+rowcol] +"'><td>"+src+"</td><td>"+dst+"</td><td>"+dct[keys[k]]+"</td></tr>"
			rowcol=(rowcol+1)%2
			}
		s+="</table>"

		if(FEATURECOUNT["Hashtags"]){
		s+="<p></p>"
		rowcol=0

		s+="<table><tr style='background:"+ COLOR['Hashtags'][0] +"'><th>Hashtags</th><th>Count</th><th>...Inc RTs</th></tr>"
		var dct=FEATURECOUNT["Hashtags"];
		var dct2=FEATURECOUNT["Hashtags2"];
		var keys = Object.keys(dct);
		for(var k in keys.sort()){
			s+="<tr style='background:"+ COLOR['Hashtags'][1+rowcol] +"'><td>"+keys[k]+"</td><td>"+dct[keys[k]]+"</td><td>"+dct2[keys[k]]+"</td></tr>"
			rowcol=(rowcol+1)%2
			}
		s+="</table>"
		}

		}
	    }
	else { s="<p><b>Error:</b> "+recs.length+"</p>" }
	return s;
	}


var lastGooglePage = 0;
var googleData=""
var curPage=1
function autoClickPage(platform) {
	var curPageN=document.querySelector(PLATFORM[platform][0].curPageSelector); 
	curPage=1; if(curPageN)curPage=Math.round(curPageN.textContent);
	if(curPage>lastGooglePage){ googleData=platformToString(platform) }
	chrome.runtime.sendMessage({url: document.URL, data:googleData});
	//var nN=document.querySelector("a#pnnext"); //if(nN){ nN.scrollIntoView(); }
	}

var lastScrollHeight = 0;
var toID=null
var twitterData=""
var twitterUserData=""
var keepGoing=true;
var dontEverStop=true;

/** THIS OLD VERSION DOESNT WORK
function trimUsedTweets(){
	//delete the first n-100 tweets to reserve only 100 tweets
	var recs=document.querySelectorAll(platform[0].element);
        if(recs&&recs.length>100){
		for(n=0; n<recs.length-100; n++)recs[n].remove();
		}
	}
**/

function scrollDownwards(){
  var sh = document.documentElement.scrollHeight;
  if (sh == lastScrollHeight) return;
  lastScrollHeight = sh;
  document.documentElement.scrollTop = sh;
  toID=window.setTimeout(scrollDownwards, 5000);
  }

function autoPilotTwitterUser(pageType) {
    //the twitterData goes first to calculate the user "feature metrics" like Ignored and Self-Penned
    twitterData=platformToString("twitter")
    twitterUserData=platformToString("twitteruser")

    var retVal=twitterUserData
    if(pageType=="primary")retVal+="<p></p>"+twitterData
    chrome.runtime.sendMessage({url:document.URL, tag:"twitteruser", accounts:ACCOUNTS, data:retVal});
    //trimUsedTweets()
    }

function autoPilotTwitter() {
    twitterData=platformToString("twitter")
    chrome.runtime.sendMessage({url:document.URL, tag:"twitterpage", accounts:ACCOUNTS, data:twitterData});
    //trimUsedTweets()
    }

function autoPilotQuoraQuestion() {
    twitterData=platformToString("QuoraQuestion")
    chrome.runtime.sendMessage({url:document.URL, tag:"quorapage", accounts:ACCOUNTS, data:twitterData});
    //trimUsedTweets()
    }

function autoPilotQuoraProfile() {
    twitterData=platformToString("QuoraProfile")
    chrome.runtime.sendMessage({url:document.URL, tag:"quorapage", accounts:ACCOUNTS, data:twitterData});
    //trimUsedTweets()
    }

function kickStart(pageType){
  if(document.title.indexOf(") | Twitter")>0 && document.title.indexOf("(@")>0 ) { autoPilotTwitterUser(pageType); }
  else if(document.title.indexOf("Twitter")>=0) { autoPilotTwitter(pageType); }
  else if(document.title.indexOf("- Quora")>=0 && document.location.href.substring(22).startsWith("profile/")) { autoPilotQuoraProfile(pageType); }
  else if(document.title.indexOf("- Quora")>=0 && document.location.href.substring(22).indexOf("/")<0) { autoPilotQuoraQuestion(pageType); }

}

function kickStop(){
	clearTimeout(toID);
	toID=null;
	}


document.addEventListener('keypress', (event) => {
  const keyName = event.key;
  if(keyName=='X')keepGoing=false;
  if(keyName=='Z')dontEverStop=true;
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.tag == "scrollDown") scrollDownwards();
    else if (request.tag == "kickStart") kickStart(request.pageType);
    else if (request.tag == "kickStop") kickStop();
  });

//Just to let the background script know that this is the tab to listen to
chrome.runtime.sendMessage({tag:"helo"}, (response) => { if(response.tag=="kickStart")toID=setTimeout(kickStart,5000,response.pageType); });


/***

This extension works on data-rich pages that are the results of
explicit search queries or timelines (implicit queries). It currently
deals with Twitter, Facebook and Google, each of whoch is considered
to be a specific example of a "platform".

There is a master array of platform entries, indexed by platform name.
  PLATFORM["twitter"]
  PLATFORM["facebook"]
  PLATFORM["Google"]

A platform is defined by an array of dictionaries:

- the first (zeroth) of these contains a selector to match all the
  records / query results / tweets / status updates, and also an
  indication of whether to iterate over them forwards (Google with
  the most important record at the top) or backwards (Twitter and
  Facebook, with the earliest records at the end)

- the rest of the entries entries control the processing of the
  different properties of an individual record.
    * element: a selector to match the representation of the property
      in the record.Its textContent will be used as the value of the
      property, unless there is an attribute specified.
    * attribute: a selector to match the representation of the property
      in the record if it is contained in an attribute of the element
      (e.g. href or data-foo). QuerySelector only returns element DOM
      Nodes and so this is a separate stage. Note this could simplified
      by using jquery.
    *transform: a function that modifies the text returned by the element
      or attribute specifications, e.g. to sanitise a date for Excel.
    * except: the name of an element that is a subpart of the property
      but whose contents should be removed from it. Used to remove the
      date from a Google snippet.
    * name: the title of the property that appears in the column heading

***/
