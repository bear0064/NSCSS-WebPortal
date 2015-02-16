$( document ).ready(function() {


var selectedCommunity;
var keyword;
var category;
var program;
var organization;
var db;
var serverUrl;
var lang="en";
var programsdb;
var orgdb;
var eventsdb;
var communitydb;
var categorydb;
var search=0;
var favsdb;
var fav=0;
var program;
var eventsData;
var initComm=false;
var eventspage=0;
var selectedValue="";
var filterValue="";


//Ajax Call Starts -- Functions of get data for all appends

function loadData(url,fallback) {
	   //callApp(true);
	   var http_request;
	   try{
	      http_request = new XMLHttpRequest();
	   }catch (e){
	      // Internet Explorer Browsers
	      try{
	         http_request = new ActiveXObject("Msxml2.XMLHTTP");
	      }catch (e) {
	         try{
	            http_request = new ActiveXObject("Microsoft.XMLHTTP");
	         }catch (e){
	            return false;
	         }
	      }
	   }
	   http_request.onerror = function() {
          	 if(fallback ==0) dataFailureHandling();
           }
	   http_request.onreadystatechange  = function(){

	      if (http_request.readyState == 4  )
	      {
		 try {
		      var obj =http_request.responseText;
		console.log(obj);
		      var jsonObj = JSON.parse(http_request.responseText);
		      var other_data = jsonObj['other_data'];
		      if(other_data != "") {
			other_data = JSON.parse(other_data);
		      }
    		      var programs = jsonObj['programs'];
    		      if( programs != "")
				programs = JSON.parse(programs);
    		      var org = jsonObj['organizations'];
		      if(org != "")
	    		      org = JSON.parse(org);
    		      var events = jsonObj['events'];
	  	      if(events != "")
    		      	events = JSON.parse(events);
    		      var communities = jsonObj['communities'];
		      if(communities != "")
    		      	communities = JSON.parse(communities);
    		      var categories = jsonObj['categories'];
		      if(categories != "")
    		      	categories = JSON.parse(categories);
		      if(other_data != "") {
				otherdatadb = TAFFY(JSON.stringify(other_data));
				$.jStorage.set("otherdatadb",otherdatadb().stringify());
			}
		      if(programs !="") {
		      	programsdb = TAFFY(JSON.stringify(programs));
		        $.jStorage.set("programsdb",programsdb().stringify());
		      }
                      if(org != "") {
            		      orgdb = TAFFY(JSON.stringify(org));
		      		$.jStorage.set("orgdb",orgdb().stringify());
                      }
		      if(events != "") {
		      	eventsdb = TAFFY(JSON.stringify(events));
  		        $.jStorage.set("eventsdb",eventsdb().stringify());
		      } else {
			eventsdb = TAFFY("");
			$.jStorage.set("eventsdb",eventsdb().stringify());
		      }
		      if(communities != "") {
		      		communitydb = TAFFY(JSON.stringify(communities));
		      		communitydb.sort("name");
		      		$.jStorage.set("communitydb",communitydb().stringify());
	              }
		      if(categories != "") {
	       		      categorydb = TAFFY(JSON.stringify(categories));
				categorydb.sort("order");
		      		$.jStorage.set("categorydb",categorydb().stringify());
		      }
			if(fallback ==0)
                        $.jStorage.set("last_updated", last_updated);
	   	      $('#floatingBarsG').hide();
		      if(initComm) {
		          initCommunity();
		      } else {
		    	  initMain();
		      }
			} catch(e) {
                        if(fallback ==0) dataFailureHandling();
                  	}
		}
	   };
	   http_request.open("GET", url, true);
	   http_request.send();
}
function openCustomURLinIFrame(src)
{
    var rootElm = document.documentElement;
    var newFrameElm = document.createElement("IFRAME");
    newFrameElm.setAttribute("src",src);
    rootElm.appendChild(newFrameElm);
    //remove the frame now
    newFrameElm.parentNode.removeChild(newFrameElm);
}
function callApp(status) {
//	url="app://status=" + status;
//	openCustomURLinIFrame(url);
}
function updateDB() {
last_updated = $.jStorage.get("last_updated");
        favsdb = $.jStorage.get("favsdb");
        if(!favsdb) {
                favsdb={};
        }
        favsdb = TAFFY(favsdb);
        programsdb = $.jStorage.get("programsdb");
        orgdb = $.jStorage.get("orgdb");
        eventsdb = $.jStorage.get("eventsdb");
        categorydb = $.jStorage.get("categorydb");
        communitydb = $.jStorage.get("communitydb");
        if(!last_updated) {
                last_updated=0;
        }
        if(!programsdb || !orgdb || !eventsdb || !categorydb || !communitydb) {
                        last_updated=0;
        }
        eventsdb = TAFFY(eventsdb);
        programsdb = TAFFY(programsdb);
        orgdb = TAFFY(orgdb);
        communitydb = TAFFY(communitydb);
        categorydb = TAFFY(categorydb);
	if('onLine' in navigator && !navigator.onLine) {
                dataFailureHandling();
                return;
        }
        if(last_updated ==0 || $.now() - last_updated >3600000) {
                var data_file = "http://www.nscss.com/EAConnects/admin/refresh.php?last_updated=" +last_updated;
                last_updated=$.now();
                loadData(data_file,0);
        }
}
function search(keyword) {
	createProgramList(keyword, false);
}
function getCommunityID(name) {
	
}
function getCommunityName(id) {
	
}
function getOrgId(name) {
	
}
function getOrgName(id) {
	
}
function getProgramId(name) {
	
}
function getProgramName(id) {
	
}
function createCommunityList() {
	
}
function createMainList() {
	
}
function createProgramList(keyword, onlyCategory) {
	
}
function getLang() {
	if (navigator
            && navigator.userAgent
            && (lang = navigator.userAgent
                    .match(/android.*\W(\w\w)-(\w\w)\W/i))) {
        lang = lang[1];
    }

    if (!lang && navigator) {
        if (navigator.language) {
            lang = navigator.language;
        } else if (navigator.browserLanguage) {
            lang = navigator.browserLanguage;
        } else if (navigator.systemLanguage) {
            lang = navigator.systemLanguage;
        } else if (navigator.userLanguage) {
            lang = navigator.userLanguage;
        }
        lang = lang.substr(0, 2);
    }
    if(!lang)
    	lang="en";
    else {
    	lang = lang.toLowerCase();
    	if(lang != "fr") {
    		lang="en";
    	}
    }
}
function checkDB() {
	if(!programsdb) {
		return "0";
	}
	return "1";
}
function checkContactUs() {
	updateDB();
	otherdatadb = $.jStorage.get("otherdatadb");
	if(!otherdatadb) {
		otherdatadb={};
	}
	otherdatadb = TAFFY(otherdatadb);
	var f = otherdatadb({name:"eaconnects_menu"}).first();
	if(!f) {
	} else {
		$('#otherdatapanel').html(f.value_en);
	}
}
function checkTerms() {
	updateDB();
	otherdatadb = $.jStorage.get("otherdatadb");
	if(!otherdatadb) {
		favsdb={};
	}
	otherdatadb = TAFFY(otherdatadb);
	var f = otherdatadb({name:"terms_menu"}).first();
	if(!f) {
	} else {
		$('#otherdatapanel').html(f.value_en);
	}
}
function checkCommunity() {
	updateDB();
	value = $.jStorage.get("community");
	getLang();
	if(!value) {
		window.location="communities.html";
	}else {
		selectedCommunity = value;
    		$('.searchboxnew').keydown(doSearch);
		$('.mobilemoveup').css('z-index',10000);
		num=9999;
		$('.moveup').each(function(i,c) {
			$(c).css('z-index',num-i);
		});
	}
}
function selectCommunity(id) {
	communities = communitydb();
	communities = communities.select("community_id");
	$.jStorage.set("community",communities[id]);
	selectedCommunity=communities[id];
	window.location="index.html";
} 

function initCommunity() {
	try {
    initComm=true;
	if(!communitydb) {
		updateDB();
	}
	if(!communitydb) {
		return;
	}
	$('.searchboxnew').keydown(doSearch);
	$('#langbox').change(changeLang);
	initComm=false;
	communities = communitydb();//communitydb({name:"Elliot Lake"});
	//communities = JSON.parse(communities);
//	communities = communities.stringify();
//	communities = JSON.parse(communities);
	var len = communities.count();
	communities = communities.select("name");
	$('.commlist').click(selectCommunity);
	$('.mobilemoveup').css('z-index',10000);
                num=9999;
                $('.moveup').each(function(i,c) {
                        $(c).css('z-index',num-i);
                });
/*
	if(len ==0) {
		$('.commlist').click(selectCommunity);
		return;
	}
	$("#list1").empty();
	$("#list2").empty();
	for(var i=0; i<len/2; i++)  {
		name = communities[i];
		$("#list1").append("<li><a href=\"#\" class=\"button medium fa fa-arrow-circle-right\">" + name + "</a></li>");
	};
	if(len ==1) return;
	for(var i=len/2; i<len; i++)  {
		name = communities[i];
		$("#list2").append("<li><a href=\"#\" class=\"button medium fa fa-arrow-circle-right\">" + name + "</a></li>");
	};
	$('.commlist').click(selectCommunity);
*/
	} catch(e) {
		//alert(e.message);
	} 
}
function getDate(obj) {
	var year = obj.year;
	var month = obj.month;
	var day = obj.day;
/*
	var dateStr = year +"/" ;
	if(month <10) 
	    dateStr = dateStr + "0" + month + "/";
	else
		dateStr = dateStr + month+ "/";
        if(day <10)
		dateStr = dateStr + "0" + day;
	else
		dateStr = dateStr + day;
	dateStr = dateStr + " " + getTime(obj);
	var d = Date.parse(dateStr);*/
	return new Date(year,month-1, day,obj.hours, obj.minutes,0);
}
function getTime(obj) {
	var hours = obj.hours;
	var mins = obj.minutes;
	var im = parseInt(mins);
	var ih = parseInt(hours);
	if(ih<12) {
		ap = " AM";
	} else {
		ap = " PM";
	}
	if(ih >12) {
		ih -=12;
	}
	if(im <10)
		return ih + ":0" + im + ap;
	else
		return ih + ":" + im + ap;

}
function htmlForTextWithEmbeddedNewlines(text) {
    var htmls = [];
    var lines = text.split(/\n/);
    // The temporary <div/> is to perform HTML entity encoding reliably.
    //
    // document.createElement() is *much* faster than jQuery('<div/>')
    // http://stackoverflow.com/questions/268490/
    //
    // You don't need jQuery but then you need to struggle with browser
    // differences in innerText/textContent yourself
    var tmpDiv = jQuery(document.createElement('div'));
    for (var i = 0 ; i < lines.length ; i++) {
        htmls.push(tmpDiv.text(lines[i]).html());
    }
    return htmls.join("<br>");
}

function loadEvents() {
	eventspage=1;
	checkCommunity();
	selectedCategory = $.jStorage.get("category");
	if(!selectedCategory || !programsdb) {
		window.location="index.html";
		return;
	}
//	$.jStorage.deleteKey("category");
	categoryName = categorydb({category_id:selectedCategory}).first().name_en;
	communityName = communitydb({community_id:selectedCommunity}).first().name;
	$('#titlefield').html(communityName +": " + categoryName);	
	//alert(selectedCategory);
	var html="";
	var date="";
	eventsData = new TAFFY();
	var i=0;
	$("#glossary").hide();
	eventsdb().order("start_time").each(function(r) {
		var today = new Date();
	 	today.setHours(0);
		today.setMinutes(0);
		today.setSeconds(0);
		if(r.repeat == 'once') {
			if(getDate(r.start_time).getTime() >= today.getTime()) {
				r.timestamp = getDate(r.start_time).getTime();
				r.uniqueid = i;
				r.start_time=toDateString(getDate(r.start_time));
				eventsData.insert(JSON.parse(JSON.stringify(r)));
				i=i+1;
			}			
		} else if(r.repeat == "daily") {
			var tmp = getDate(r.start_time);
			var tmp1="";
			today.setHours(tmp.getHours());
			today.setMinutes(tmp.getMinutes());
			if(r.end_time) {
				tmp1 = getDate(r.end_time);
			}
			for(var j=0; j<60;j++) {
				today.setDate(today.getDate()+1);
				if(tmp1 != "" && tmp1.getTime() < today.getTime())
				    break;
				r.start_time=toDateString(today);
				r.timestamp = today.getTime();
				r.uniqueid = i;
				eventsData.insert(JSON.parse(JSON.stringify(r)));
				i++;
			}	
		} else if(r.repeat == "M-F") {
			var tmp = getDate(r.start_time);
			today.setHours(tmp.getHours());
			today.setMinutes(tmp.getMinutes());
			var tmp1 = "";
			if(r.end_time) 
				tmp1=getDate(r.end_time);
			for(var j=0; j<60;j++) {
				today.setDate(today.getDate()+1);
				if(tmp1 != "" && tmp1.getTime() < today.getTime())
				    break;
				if(today.getDay() >0 && today.getDay()<6) {
					r.start_time=toDateString(today);
					r.uniqueid = i;
					r.timestamp = today.getTime();
					eventsData.insert(JSON.parse(JSON.stringify(r)));
					i++;
				}
			}	
		} else if(r.repeat == "weekly") {
			var tmp = getDate(r.start_time);
			var tmp1 = "";
			if(r.end_time) {
				tmp1=getDate(r.end_time);
			}
			while(tmp.getTime() < today.getTime()) {
				tmp.setDate(tmp.getDate()+7);
			}
			for(var j=0; j<60;j+=7) {
				tmp.setDate(tmp.getDate()+7);
				if(tmp1 != "" && tmp1.getTime() < tmp.getTime()) 					break;
				r.start_time=toDateString(tmp);
				r.timestamp = tmp.getTime();
				r.uniqueid = i;
				eventsData.insert(JSON.parse(JSON.stringify(r)));
				i++;
			}	
		} else if(r.repeat == "monthly") {
			var tmp = getDate(r.start_time);
			var tmp1 = "";
			if(r.end_time) 
				tmp1=getDate(r.end_time);
			while(tmp.getTime() < today.getTime()) {
				tmp.setMonth(tmp.getMonth()+1);
			}
			for(var j=0; j<2;j++) {
				tmp.setMonth(tmp.getMonth()+1);
				if(tmp1 != "" && tmp1.getTime() < tmp.getTime()) 					break;
				r.start_time=toDateString(tmp);
				r.timestamp = tmp.getTime();
				r.uniqueid = i;
				eventsData.insert(JSON.parse(JSON.stringify(r)));
				i++;
			}	
			
		} else if(r.repeat == "Every 4 Weeks") {
			var tmp = getDate(r.start_time);
			var tmp1 = "";
			if(r.end_time)
				tmp1=getDate(r.end_time);
			while(tmp.getTime() < today.getTime()) {
				tmp.setDate(tmp.getDate()+28);
			}
			for(var j=0; j<2;j++) {
				tmp.setDate(tmp.getDate()+28);
				if(tmp1 !="" && tmp.getTime() > tmp1.getTime()) 
					break;
				r.start_time=toDateString(tmp);
				r.timestamp = tmp.getTime();
				r.uniqueid = i;
				eventsData.insert(JSON.parse(JSON.stringify(r)));
				i++;
			}	
			
		} else if(r.repeat == "Every 2 Weeks") {
			var tmp = getDate(r.start_time);
			var tmp1 = "";
			if(r.end_time)
				tmp1=getDate(r.end_time);
			while(tmp.getTime() < today.getTime()) {
				tmp.setDate(tmp.getDate()+14);
			}
			for(var j=0; j<4;j++) {
				tmp.setDate(tmp.getDate()+14);
				if(tmp1 != "" && tmp1.getTime() < tmp.getTime())
					break;
				r.start_time=toDateString(tmp);
				r.timestamp = tmp.getTime();
				r.uniqueid = i;
				eventsData.insert(JSON.parse(JSON.stringify(r)));
				i++;
			}	
			
		} });
	html="";
	var dateString = new Date();
	var d = (dateString.toUTCString()).split(' ');
	dateString = [d[1], d[2], d[3]].join(' ');
	html = "<div id=\"datepicker-container\" class=\"12u\"><div class=\"calendar\" id=\"datepicker\"></div> </div>";
//	html=html +"<div class=\"listback\"><ul><li style=\"text-align:center\"><button type=\"button\" id=\"dateButton\"\">"+dateString+"</button></li></ul></div>";
	
	html=html +"<div class=\"listbackh\"><ul><li style=\"text-align:center\">"+dateString+"</li></ul></div>";
	$.jStorage.set("eventsdata",eventsData().stringify());
	eventsData().order("timestamp").limit(50).each(function(r) {
        	var d = (r.start_time+"").split(' ');
		var newDateString = [d[0],d[1],d[2]].join(' ');
		if(newDateString != dateString) {
			html=html +"<div></div><div class=\"listbackh\"><ul><li style=\"text-align:center\">"+newDateString+"</li></ul></div>";
			dateString = newDateString;
		}
		if(r.phone != null && r.phone !="") {
			r.phone = textToPhone(r.phone);
			html=html +"<div class=\"listback\" onclick=\"loadEvent(" +r.event_id+"," + r.uniqueid +");\"><ul><li style=\"text-align:center\"><h9>"+r.name_en+"</h9></li><li class=\"fa fa-location-arrow\" style=\"text-align:center\"><a target=\"_blank\" href=\"http://maps.google.com/?q="+ r.address_line1 + "," + r.city_and_state+"\">" + r.address_line1 +"," + r.city_and_state + "</a></li><li class=\"fa fa-phone\" style=\"text-align:center\">" + r.phone + "</li><li class=\"fa fa-clock-o\" style=\"text-align:center\"> " + r.start_time + "</li></ul></div><div></div>"; 
		} else {
		html=html +"<div class=\"listback\" onclick=\"loadEvent(" +r.event_id+"," + r.uniqueid +");\"><ul><li style=\"text-align:center\"><h9>"+r.name_en+"</h9></li><li class=\"fa fa-location-arrow\" style=\"text-align:center\"><a target=\"_blank\" href=\"http://maps.google.com/?q="+ r.address_line1 + "," + r.city_and_state+"\">" + r.address_line1 +"," + r.city_and_state + "</a></li><li class=\"fa fa-clock-o\" style=\"text-align:center\"> " + r.start_time + "</li></ul></div><div></div>"; 
	}
});
	$('.mainpanel').empty();
	if(html == "") {
		html="<h4 style=\"background:url('../images/listback@2x.png');\">No matches found!</h4>";
	} 
	$('.mainpanel').html(html);
	$('.mainpanel').scrollTop(0);
	$('.mainpanel').css('height', 'auto');
	$('#datepicker').datepicker({
		onSelect:function(dateText) {
			var d = new Date(dateText);
			filterEvents(d);
		},
		minDate: 0
	});
	$('#gototop').click(function() {
		$(window).scrollTop(0);});
$( ".listback a" ).click(function( event ) {
  event.stopPropagation();
});
	
}
function filterEvents(date) {
	var html="";
	var search=0;
	var txt="";
	if(!date)
	{
		var txt = $('.searchboxnew').val();
		if(txt =="") 
			return;
		search=1;
		date = new Date();
	}
	var d = (date.toUTCString()).split(' ');
	dateString = [d[1], d[2], d[3]].join(' ');
	html = html + "<div id=\"datepicker-container\"><div id=\"datepicker-center\"><div class=\"calendar\" id=\"datepicker\"></div> </div> </div>";
//	html=html +"<div class=\"listbackh\"><ul><li style=\"text-align:center\"><button type=\"button\" id=\"dateButton\" >"+dateString+"</button></li></ul></div>";
	html=html +"<div class=\"listbackh\"><ul><li style=\"text-align:center\">"+dateString+"</li></ul></div>";
	var query={};
	if(search ==1) {
		query ={name_en:{likenocase:txt}};
	}
	else {
		query = {timestamp:{gte:date.getTime()}};
	}
	eventsData(query).order("timestamp").limit(50).each(function(r) {
        	var d = (r.start_time+"").split(' ');
		var newDateString = [d[0],d[1],d[2]].join(' ');
		if(newDateString != dateString) {
			html=html +"<div></div><div class=\"listbackh\"><ul><li style=\"text-align:center\">"+newDateString+"</li></ul></div>";
			dateString = newDateString;
		}
		if(r.phone != null && r.phone !="") {
                        r.phone = textToPhone(r.phone);
                        html=html +"<div class=\"listback\" onclick=\"loadEvent(" +r.event_id+"," + r.uniqueid +");\"><ul><li style=\"text-align:center\"><h9>"+r.name_en+"</h9></li><li class=\"fa fa-location-arrow\" style=\"text-align:center\"><a target=\"_blank\" href=\"http://maps.google.com/?q="+ r.address_line1 + "," + r.city_and_state+"\">" + r.address_line1 +"," + r.city_and_state + "</a></li><li class=\"fa fa-phone\" style=\"text-align:center\">" + r.phone + "</li><li class=\"fa fa-clock-o\" style=\"text-align:center\"> " + r.start_time + "</li></ul></div><div></div>";
} else {
		html=html +"<div class=\"listback\" onclick=\"loadEvent(" +r.event_id+"," + r.uniqueid +");\"><ul><li style=\"text-align:center\"><h9>"+r.name_en+"</h9></li><li class=\"fa fa-location-arrow\" style=\"text-align:center\"><a target=\"_blank\" href=\"http://maps.google.com/?q="+ r.address_line1 + "," + r.city_and_state+"\">" + r.address_line1 +"," + r.city_and_state + "</a></li><li class=\"fa fa-clock-o\" style=\"text-align:center\"> " + r.start_time + "</li></ul></div><div></div>"; 
}
});
	$('.mainpanel').empty();
	if(html == "") {
		html="<h4 style=\"background:url('../images/listback@2x.png');\">No matches found!</h4>";
	} 
	$('.mainpanel').html(html);
	$('.mainpanel').scrollTop(0);
	$('#datepicker').datepicker({
		onSelect:function(dateText) {
			var d = new Date(dateText);
			filterEvents(d);
		},
		'defaultDate':date,
		minDate: 0
	});
	search=0;
$( ".listback a" ).click(function( event ) {
  event.stopPropagation();
});
}
function toDateString(d1) {
	var d = d1.toUTCString().split(' ');
	var hours = d1.getHours();
	var minutes = d1.getMinutes();
	  var ampm = hours >= 12 ? 'pm' : 'am';
	  hours = hours % 12;
	  hours = hours ? hours : 12; // the hour '0' should be '12'
	  minutes = minutes < 10 ? '0'+minutes : minutes;
	  var strTime = hours + ':' + minutes + ' ' + ampm;
	return [d[1], d[2], d[3],strTime].join(' ');
}

function textToPhone(txt) {
	if(txt && txt.indexOf("href") >-1)
		return txt;
	var regex = /((\(\d{3}\) ?)|(1-\d{3}-)|(\d{3}-))?\d{3}-\d{4}/g; 
	//var regex = /((\(\d{3}\) ?)|(\d{3}-))?\d{3}-\d{4}/g; 
	return txt.replace(regex, "<a href=\"tel:$&\">$&</a>");
}
function doSearch() {
	if (event.keyCode == 13) {
		$('.searchboxnew').blur();
                var txt = $('.searchboxnew').val();
                if(txt =="" || txt == "Search")
	                return;
                if(eventspage==1) {
	                filterEvents();
                } else
       	         	selectCategory(10);
                $(this).val("");
                return false;
        }
}
function changeLang() {
	window.location="../web_fr/communities.html";		
	callApp("lang=fr");		
}

function dataFailureHandling() {
        try {
                programsdb = $.jStorage.get("programsdb");
                orgdb = $.jStorage.get("orgdb");
                eventsdb = $.jStorage.get("eventsdb");
                categorydb = $.jStorage.get("categorydb");
                communitydb = $.jStorage.get("communitydb");
                if(!programsdb || !orgdb || !eventsdb || !categorydb || !communitydb) {
                loadData("../images/fallback.json",1);
                return;
                }

            
                eventsdb = TAFFY(eventsdb);
                programsdb = TAFFY(programsdb);
                orgdb = TAFFY(orgdb);
                communitydb = TAFFY(communitydb);
                categorydb = TAFFY(categorydb);
                $('#floatingBarsG').hide();
                if(initComm) {
		      initCommunity();
                } else {
                      initMain();
                }
        } catch(e) {
                loadData("../images/fallback.json",1);
        }
}


//analytics
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-58171506-1', 'auto');
  ga('send', 'pageview');

    
    });