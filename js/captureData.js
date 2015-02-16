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
function launchHelplines() {
	categorydb({name_en:"Helplines"}).each(function(r) {
		f=r.category_id;
});
	$.jStorage.set("category",f);
	window.location="programslist.html";
}
function switchOrgFav() {
	var f = favsdb({org_id:program}).first();
	if(!f) {
		$("#favicon").attr('src','../images/category10_icon_filled.png');
		favsdb.insert({org_id:program});
	} else {
		$("#favicon").attr('src','../images/category10_icon.png');
		favsdb({org_id:program}).remove();
	}
	$.jStorage.set("favsdb",favsdb().stringify());
}
function switchEventFav() {
	var f = favsdb({event_id:eventid, uniqueid:uniqueid}).first();
	if(!f) {
		$("#favicon").attr('src','../images/category10_icon_filled.png');
		favsdb.insert({event_id:eventid, uniqueid:uniqueid});
	} else {
		$("#favicon").attr('src','../images/category10_icon.png');
		favsdb({event_id:eventid,uniqueid:uniqueid}).remove();
	}
	$.jStorage.set("favsdb",favsdb().stringify());
}
function switchFav() {
	var f = favsdb({program_id:program}).first();
	if(!f) {
		$("#favicon").attr('src','../images/category10_icon_filled.png');
		favsdb.insert({program_id:program});
	} else {
		$("#favicon").attr('src','../images/category10_icon.png');
		favsdb({program_id:program}).remove();
	}
	$.jStorage.set("favsdb",favsdb().stringify());
}
function checkOrganization() {
	program=$.jStorage.get("organization");
	if(!program) {
		window.location="index.html";
		return;
	}
// 	$.jStorage.deleteKey("program");	
	if(!programsdb) {
		updateDB();
	}
	var f = favsdb({org_id:program}).count();
	if(f == 0) {
		fav=0;
	}
	else {
		fav=1;
		$("#favicon").attr('src','../images/category10_icon_filled.png');
	}
	$('#facebookshare').prop('href','https://www.facebook.com/sharer/sharer.php?u=http://www.nscss.com/EAConnects/web_en/organization.php?org_id=' + program);
	$('#gshare').prop('href','https://plus.google.com/share?url=http://www.nscss.com/EAConnects/web_en/organization.php?org_id='+program);
	$('.searchboxnew').keydown(doSearch);
	orgdb({org_id:""+program}).each(function(r) {
		$('#name').html("<h3>" +r.name_en+"</h3>");
	$('#twittershare').prop('href','https://twitter.com/share?text=EAConnects! ' + $('#name').text() + '&url=http://www.nscss.com/EAConnects/web_en/organization.php?org_id='+program);
	$('#mailshare').prop('href','mailto:?subject=EAConnects:'+$('#name').text()+'&body=http://www.nscss.com/EAConnects/web_en/organization.php?org_id='+program);
		$('#desc').text(r.mission_statement_en);
		$('#category').text("");
		$('#organization').text("");
		if(r.phone) {
			r.phone = textToPhone(r.phone);
			$('#phone').html(r.phone);
		}
		else
			$('#phone').text("");
		if(r.fax) 
			$('#fax').text(r.fax);
		else
			$('#fax').text("");
			
        if(r.email) {
                $('#email').html("<a href=\"mailto:" + r.email + "\">" + r.email +"</a>");
                                    
        }
		else
			$('#email').text("");

		if(r.website) 
			$('#web').html("<a href=\"" +r.website +"\" target=\"_blank\">" + r.name_en + "</a>");
		else
			$('#web').text("");
		if(r.wheelchair_access === "undefined") {
			$('#wheelchair').remove();
		} else
		if(r.wheelchair_access ==1) {
			r.wheelchair_access="Yes";
			$('#wheelchair').text(" Wheel Chair Access: " +r.wheelchair_access);
		}
		else if(r.wheelchair_access == 0){
			r.wheelchair_access="No";
			$('#wheelchair').text(" Wheel Chair Access: " +r.wheelchair_access);
		}else {
			$('#wheelchair').remove();
		}
		if(r.address_line1)
			$('#addrline1').text(r.address_line1);
		else 
			$('#addrline1').text('');

		if(r.address_line2) 
			$('#addrline2').text(r.address_line2);
		else
			$('#addrline2').text('');
			
		if(r.city_and_state)
			$('#city').text(r.city_and_state);
		else
			$('#city').text('');
		areas = r.communities;
		var locName="";
		for(var i=0;i<areas.length; i++) {
			if(areas[i] == "") 
				continue;
			if(locName =="") 
				locName =communitydb({community_id:areas[i]}).first().name;
			else
				locName = locName + "," + communitydb({community_id:areas[i]}).first().name;
		}
		$('#area').text("Service Area(s): " + locName);
		if(!r.postal_code || r.postal_code=="")  {
			$('#wheelchair').remove();
			$('#pin_code').text("");
			$('#image1').attr('src','../images/category9_icon_red.png');
			$('#image1').addClass("image-half");
			$('#image1').removeClass("image-full");
			$('#image2').remove();
			$('#address').text("");
		} else {
		$('#image1').attr('src','http://www.nscss.com/EAConnects/admin/getimage.php?type=2&org_id='+r.org_id);
		$('#image2').attr('src','http://www.nscss.com/EAConnects/admin/getimage.php?type=1&org_id='+r.org_id);
		$('#pin_code').text(r.postal_code);
		$('#mapurl').attr('href',"http://maps.google.com/?q="+r.address_line1 + " " + r.city_and_state + " " + r.postal_code);
		$('#mapurl2').attr('href',"http://maps.google.com/?q="+r.address_line1 + " " + r.city_and_state + " " + r.postal_code);
		}
		if(r.notes_en) {
			r.notes_en=htmlForTextWithEmbeddedNewlines(r.notes_en);
			$('#notes').html(r.notes_en);
		}
		if(r.monday_start && r.monday_end)
		{
			$("#d1").text("Monday:");
			$("#d1val").text(getTime(r.monday_start) +" to " + getTime(r.monday_end));
		} else if(r.monday_start) {
			$("#d1").text("Monday:");
			$("#d1val").text(getTime(r.monday_start));
		}
		else
		{
			$("#d1").text("");
			$("#d1val").text("");
		}
		if(r.tuesday_start && r.tuesday_end)
		{ 
			$("#d2").text("Tuesday:");
			$("#d2val").text(getTime(r.tuesday_start) +" to " + getTime(r.tuesday_end));
		} else if(r.tuesday_start) {
			$("#d2").text("Tuesday:");
			$("#d2val").text(getTime(r.tuesday_start));
		}
		else
		{
			$("#d2").text("");
			$("#d2val").text("");
		}
		if(r.wednesday_start && r.wednesday_end)
		{
			$("#d3").text("Wednesday:");
			$("#d3val").text(getTime(r.wednesday_start) +" to " + getTime(r.wednesday_end));
		} else if(r.wednesday_start) {
			$("#d3").text("Wednesday:");
			$("#d3val").text(getTime(r.wednesday_start));
		}
		else
		{
			$("#d3").text("");
			$("#d3val").text("");
		}
		if(r.thursday_start && r.thursday_end)
		{
			$("#d4").text("Thursday:");
			$("#d4val").text(getTime(r.thursday_start) +" to " + getTime(r.thursday_end));
		} else if(r.thursday_start) {
			$("#d4").text("Thursday:");
			$("#d4val").text(getTime(r.thursday_start));
		}
		else
		{
			$("#d4").text("");
			$("#d4val").text("");
		}
		if(r.friday_start && r.friday_end)
		{
			$("#d5").text("Friday:");
			$("#d5val").text(getTime(r.friday_start) +" to " + getTime(r.friday_end));
		} else if(r.friday_start) {
			$("#d5").text("Friday:");
			$("#d5val").text(getTime(r.friday_start));
		}
		else
		{
			$("#d5").text("");
			$("#d5val").text("");
		}
		if(r.saturday_start && r.saturday_end) {
			$("#d6").text("Saturday:");
			$("#d6val").text(getTime(r.saturday_start) +" to " + getTime(r.saturday_end));
		} else if(r.saturday_start) {
			$("#d6").text("Saturday:");
			$("#d6val").text(getTime(r.saturday_start));
		}
		else
		{
			$("#d6").text("");
			$("#d6val").text("");
		}
		if(r.sunday_start && r.sunday_end)
		{
			$("#d7").text("Sunday:");
			$("#d7val").text(getTime(r.sunday_start) +" to " + getTime(r.sunday_end));
		} else if(r.sunday_start) {
			$("#d7").text("Sunday:");
			$("#d7val").text(getTime(r.sunday_start));
		}
		else
		{
			$("#d7").text("");
			$("#d7val").text("");
		}
	});
}
		
function checkEvent() {
	eventid = $.jStorage.get("eventid");
	uniqueid = $.jStorage.get("uniqueid");
	if(!programsdb) {
		updateDB();
	}
	if(!eventid) {
		window.location="index.html";
		return;
	}
	eventsData = $.jStorage.get("eventsdata");
	if(!eventsData) {
		window.location="index.html";
		return;
	}
	var f = favsdb({event_id:eventid, uniqueid:uniqueid}).first();
	if(f == 0) {
		fav=0;
	}
	else {
		fav=1;
		$("#favicon").attr('src','../images/category10_icon_filled.png');
	}
	eventsData = TAFFY(eventsData);
	eventsData({event_id:""+eventid,uniqueid:uniqueid}).each(function(r) {
		$('#name').html("<h3>" +r.name_en+"</h3>");
		$('#_summary').text(r.name_en);
		$('#_desc').text(r.description_en);
		$('#desc').text(r.description_en);
		cats = r.categories;
		catName="";
		if(r.phone != null && r.phone !="") {
			r.phone = textToPhone(r.phone);
			$('#phone').html(r.phone);
		}
		else {
			$('#phone').remove();
		}
		for(var i=0;i<cats.length; i++) {
			if(cats[i] == "") 
				continue;
			if(catName =="") 
				catName =categorydb({category_id:cats[i]}).first().name_en;
			else
				catName = catName + "," + categorydb({category_id:cats[i]}).first().name_en;
		}
		$('#category').text("Category: " + catName);
		if(r.org_id != null && r.org_id != "") 
			$('#organization').html("Organization: <a href=\"javascript:loadOrganization(" + r.org_id + ");\">" + r.organization +"</a>");
		else if(r.organization != null && r.organization != "") 
			$('#organization').html("Organization:" + r.organization);
		else 
			$('#organization').remove();
		
		if(r.program && r.program != "null") {
			$('#program').text("Program: " + r.program);
			programsdb({name_en:r.program}).first(function(p) {
				$('#program').html("Program: <a href=\"javascript:loadProgram(" + p.program_id +");\">" + r.program + "</a>");	
			});
		}
		else 
		$('#program').remove();
		if(!r.end_time) {
			$('#notes').text(r.start_time);
			$('#_start').text(r.start_time);
		} else {
			var tmp1 = new Date();
			tmp1.setTime(r.timestamp);
			var tmp = getDate(r.end_time);
			tmp.setYear(tmp1.getFullYear());
			tmp.setMonth(tmp1.getMonth());
			tmp.setDate(tmp1.getDate());
			r.end_time = toDateString(tmp);
			$('#notes').text(r.start_time + " - " + r.end_time);
			$('#_start').text(r.start_time);
			$('#_end').text(r.end_time);
		}
		notestext = $('#notes').text();
		notestext = notestext.replace(/ /g,"_");
		$('#facebookshare').prop('href','https://www.facebook.com/sharer/sharer.php?u=http://www.nscss.com/EAConnects/web_en/event.php?event_id='+eventid+'notes' + notestext);
		$('#twittershare').prop('href','http://twitter.com/share?text=EAConnects! '+$('#name').text() +'&url=http://www.nscss.com/EAConnects/web_en/event.php?event_id='+eventid+'notes'+notestext);
		$('#gshare').prop('href','https://plus.google.com/share?url=http://www.nscss.com/EAConnects/web_en/event.php?event_id='+eventid+'notes'+notestext);
		$('#mailshare').prop('href','mailto:?subject=EAConnects:'+$('#name').text()+'&body=http://www.nscss.com/EAConnects/web_en/event.php?event_id='+eventid+'notes'+notestext);

		var addrtext="";
		var comma="";
		if(r.address_line1)  {
			$('#addrline1').text(r.address_line1);
			addrtext = r.address_line1;
			comma=",";
		}
		else
			$('#addrline1').text('');
		

		if(r.address_line2)  {
			$('#addrline2').text(r.address_line2);
			addrtext = addrtext + comma + r.address_line2;
		}
		else
			$('#addrline2').text('');
			
		if(r.city_and_state) {
			$('#city').text(r.city_and_state);
			addrtext = addrtext + comma + r.city_and_state;
		}
		else
			$('#city').text('');
		if(!r.postal_code)  {
			$('#pin_code').text("");
			r.postal_code="";
		} else {
			$('#pin_code').text(r.postal_code);
			addrtext = addrtext + comma + r.postal_code;
		}
		$('#_loc').text(addrtext);
		$('#image1').attr('src','http://www.nscss.com/EAConnects/admin/getimage.php?type=2&event_id='+r.event_id);
		$('#image2').attr('src','http://www.nscss.com/EAConnects/admin/getimage.php?type=1&event_id='+r.event_id);
		$('#mapurl').attr('href',"http://maps.google.com/?q="+r.address_line1 + " " + r.city_and_state + " " + r.postal_code);
		$('#mapurl2').attr('href',"http://maps.google.com/?q="+r.address_line1 + " " + r.city_and_state + " " + r.postal_code);
		}
	);
}
function checkProgram() {
	search=0;
	program=$.jStorage.get("program");
	if(!program) {
		eventid = $.jStorage.get("eventid");
		if(eventid) {
			checkEvent();
			return;
		}
		window.location="index.html";
		return;
	}
	$('.searchboxnew').keydown(doSearch);
	if(!programsdb) {
		updateDB();
	}
	var f = favsdb({program_id:program}).count();
	if(f == 0) {
		fav=0;
	}
	else {
		fav=1;
		$("#favicon").attr('src','../images/category10_icon_filled.png');
	}
	$('#facebookshare').prop('href','https://www.facebook.com/sharer/sharer.php?u=http://www.nscss.com/EAConnects/web_en/programs.php?program_id=' + program);
	$('#gshare').prop('href','https://plus.google.com/share?url=http://www.nscss.com/EAConnects/web_en/programs.php?program_id='+program);
	programsdb({program_id:""+program}).each(function(r) {
		$('#name').html("<h3>" +r.name_en+"</h3>");
	$('#twittershare').prop('href','http://twitter.com/share?text=EAConnects! ' + $('#name').text() + '&url=http://www.nscss.com/EAConnects/web_en/programs.php?program_id='+program);
	$('#mailshare').prop('href','mailto:?subject=EAConnects:'+$('#name').text()+'&body=http://www.nscss.com/EAConnects/web_en/programs.php?program_id='+program);
	//	$('#image1').attr('src','../images/street_program'+r.program_id +'.png');
	//	$('#image2').attr('src','../images/static_program'+r.program_id +'.png');
		$('#desc').text(r.description_en);
		cats = r.categories;
		catName="";
		for(var i=0;i<cats.length; i++) {
			if(cats[i] == "") 
				continue;
			if(catName =="") 
				catName =categorydb({category_id:cats[i]}).first().name_en;
			else
				catName = catName + "," + categorydb({category_id:cats[i]}).first().name_en;
		}
		$('#category').text("Category: " + catName);
		if(r.org_id) {
			orgName = orgdb({org_id:r.org_id}).first().name_en;
			if(orgName && orgName != "undefined") {
				$('#organization').html("Organization: <a href=\"javascript:loadOrganization(" + r.org_id + ");\">" + orgName +"</a>");
			}
		} else {
				$('#organization').remove();
		}
		areas = r.communities;
		var locName="";
		for(var i=0;i<areas.length; i++) {
			if(areas[i] == "") 
				continue;
			if(locName =="") 
				locName =communitydb({community_id:areas[i]}).first().name;
			else
				locName = locName + "," + communitydb({community_id:areas[i]}).first().name;
		}
		$('#area').text("Service Area(s): " + locName);
		if(r.notes_en) {
			r.notes_en=htmlForTextWithEmbeddedNewlines(r.notes_en);
			$('#notes').html(r.notes_en);
		}
		if(r.monday_start && r.monday_end)
		{
			$("#d1").text("Monday:");
			$("#d1val").text(getTime(r.monday_start) +" to " + getTime(r.monday_end));
		} else if(r.monday_start) {
			$("#d1").text("Monday:");
			$("#d1val").text(getTime(r.monday_start));
		}
		else
		{
			$("#d1").text("");
			$("#d1val").text("");
		}
		if(r.tuesday_start && r.tuesday_end)
		{ 
			$("#d2").text("Tuesday:");
			$("#d2val").text(getTime(r.tuesday_start) +" to " + getTime(r.tuesday_end));
		} else if(r.tuesday_start) {
			$("#d2").text("Tuesday:");
			$("#d2val").text(getTime(r.tuesday_start));
		}
		else
		{
			$("#d2").text("");
			$("#d2val").text("");
		}
		if(r.wednesday_start && r.wednesday_end)
		{
			$("#d3").text("Wednesday:");
			$("#d3val").text(getTime(r.wednesday_start) +" to " + getTime(r.wednesday_end));
		} else if(r.wednesday_start) {
			$("#d3").text("Wednesday:");
			$("#d3val").text(getTime(r.wednesday_start));
		}
		else
		{
			$("#d3").text("");
			$("#d3val").text("");
		}
		if(r.thursday_start && r.thursday_end)
		{
			$("#d4").text("Thursday:");
			$("#d4val").text(getTime(r.thursday_start) +" to " + getTime(r.thursday_end));
		} else if(r.thursday_start) {
			$("#d4").text("Thursday:");
			$("#d4val").text(getTime(r.thursday_start));
		}
		else
		{
			$("#d4").text("");
			$("#d4val").text("");
		}
		if(r.friday_start && r.friday_end)
		{
			$("#d5").text("Friday:");
			$("#d5val").text(getTime(r.friday_start) +" to " + getTime(r.friday_end));
		} else if(r.friday_start) {
			$("#d5").text("Friday:");
			$("#d5val").text(getTime(r.friday_start));
		}
		else
		{
			$("#d5").text("");
			$("#d5val").text("");
		}
		if(r.saturday_start && r.saturday_end) {
			$("#d6").text("Saturday:");
			$("#d6val").text(getTime(r.saturday_start) +" to " + getTime(r.saturday_end));
		} else if(r.saturday_start) {
			$("#d6").text("Saturday:");
			$("#d6val").text(getTime(r.saturday_start));
		}
		else
		{
			$("#d6").text("");
			$("#d6val").text("");
		}
		if(r.sunday_start && r.sunday_end)
		{
			$("#d7").text("Sunday:");
			$("#d7val").text(getTime(r.sunday_start) +" to " + getTime(r.sunday_end));
		} else if(r.sunday_start) {
			$("#d7").text("Sunday:");
			$("#d7val").text(getTime(r.sunday_start));
		}
		else
		{
			$("#d7").text("");
			$("#d7val").text("");
		}
		if(r.phone) {
			r.phone = textToPhone(r.phone);
			$('#phone').html(r.phone);
		}
		else
			$('#phone').text();
		if(r.fax) 
			$('#fax').text(r.fax);
		else
			$('#fax').text("");
			
        if(r.email) {
            $('#email').html("<a href=\"mailto:" + r.email + "\">" + r.email +"</a>");

        }
		else
			$('#email').text("");

		if(r.website) 
			$('#web').html("<a href=\"" +r.website +"\" target=\"_blank\">" + r.name_en + "</a>");
		else
			$('#web').text("");
		if(r.wheelchair_access === "undefined") {
			$('#wheelchair').remove();
		} else
		if(r.wheelchair_access ==1) {
			r.wheelchair_access="Yes";
			$('#wheelchair').text(" Wheel Chair Access: " +r.wheelchair_access);
		}
		else if(r.wheelchair_access == 0){
			r.wheelchair_access="No";
			$('#wheelchair').text(" Wheel Chair Access: " +r.wheelchair_access);
		}else {
			$('#wheelchair').remove();
		}
		if(r.address_line1)
			$('#addrline1').text(r.address_line1);
		else
			$('#addrline1').text('');

		if(r.address_line2) 
			$('#addrline2').text(r.address_line2);
		else
			$('#addrline2').text('');
			
		if(r.city_and_state)
			$('#city').text(r.city_and_state);
		else
			$('#city').text('');
		if(!r.postal_code || r.postal_code=="")  {
			$('#wheelchair').remove();
			$('#pin_code').text("");
			$('#image1').attr('src','../images/category9_icon_red.png');
			$('#image1').addClass("image-half");
			$('#image1').removeClass("image-full");
			$('#image2').remove();
			$('#address').text("");
		} else {
		$('#image1').attr('src','http://www.nscss.com/EAConnects/admin/getimage.php?type=2&program_id='+r.program_id);
		$('#image2').attr('src','http://www.nscss.com/EAConnects/admin/getimage.php?type=1&program_id='+r.program_id);
		$('#pin_code').text(r.postal_code);
		$('#mapurl').attr('href',"http://maps.google.com/?q="+r.address_line1 + " " + r.city_and_state + " " + r.postal_code);
		$('#mapurl2').attr('href',"http://maps.google.com/?q="+r.address_line1 + " " + r.city_and_state + " " + r.postal_code);
		}
	});
		
}
function checkMain() {
	checkCommunity();
	communityName = communitydb({community_id:selectedCommunity}).first().name;
	$('#titlefield').html("Info Bank: " + communityName);	
}
function loadFavorites() {
	checkCommunity();
	selectedCategory = $.jStorage.get("category");
	if(!selectedCategory || !programsdb) {
		window.location="index.html";
		return;
	}
	categoryName = "Favourites";
	communityName = communitydb({community_id:selectedCommunity}).first().name;
	$('#titlefield').html(communityName +": " + categoryName);	
	var html="";
	eventsData = $.jStorage.get("eventsdata");
	if(!eventsData) {
		eventsData="";
	}
	eventsData = TAFFY(eventsData);
	html="";
	favsdb({event_id:{isUndefined:false}}).each(function(r1) {
	eventsData({event_id:""+r1.event_id,uniqueid:r1.uniqueid}).each(function(r) {
if(r.phone != null && r.phone !="") {
                        r.phone = textToPhone(r.phone);
                        html=html +"<div class=\"listback\" onclick=\"loadEvent(" +r.event_id+"," + r.uniqueid +");\"><ul><li style=\"text-align:center\"><h9>"+r.name_en+"</h9></li><li class=\"fa fa-location-arrow\" style=\"text-align:center\"><a target=\"_blank\" href=\"http://maps.google.com/?q="+ r.address_line1 + "," + r.city_and_state+"\">" + r.address_line1 +"," + r.city_and_state + "</a></li><li class=\"fa fa-phone\" style=\"text-align:center\">" + r.phone + "</li><li class=\"fa fa-clock-o\" style=\"text-align:center\"> " + r.start_time + "</li></ul></div><div></div>";
} else {
		html=html +"<div class=\"listback\" onclick=\"loadEvent(" +r.event_id+"," + r.uniqueid +");\"><ul><li style=\"text-align:center\"><h9>"+r.name_en+"</h9></li><li class=\"fa fa-location-arrow\" style=\"text-align:center\"><a target=\"_blank\" href=\"http://maps.google.com/?q="+ r.address_line1 + "," + r.city_and_state+"\">" + r.address_line1 +"," + r.city_and_state + "</a></li><li class=\"fa fa-clock-o\" style=\"text-align:center\"> " + r.start_time + "</li></ul></div><div></div>"; 
	}} );});
        var programids = favsdb().distinct("program_id");
	for(var i=1; i<programids.length;i++) {
		programsdb({program_id:""+programids[i]}).each(function(r) {
		var mapdata="";	
		var comma="";
		if(r.address_line1) {
			mapdata = r.address_line1+" ";
			comma=",";
		}
		if(r.city_and_state) {
			mapdata=mapdata + comma + r.city_and_state;
			comma=",";
		}
		if(r.postal_code) {
			mapdata = mapdata + comma + r.postal_code;
		}
		if(mapdata != "") {
			var mapurl="http://maps.google.com/?q=" + mapdata;
			mapdata ="<li class=\"fa fa-location-arrow\" style=\"text-align:center\"><a target=\"_blank\" href=\""+ mapurl + "\">" + mapdata + "</a></li>"; 
		}
		r.phone = textToPhone(r.phone);
		html=html +"<div class=\"listback\" onclick=\"loadProgram(" + r.program_id +");\"><ul><li><h9>"+r.name_en+"</h9></li>" + mapdata + "<li class=\"fa fa-phone\" style=\"text-align:center\"> Phone: " + r.phone + "</li></ul></div><div></div>";
	});};
        var orgids = favsdb().distinct("org_id");
	for(var i=1; i<orgids.length;i++) {
		orgdb({org_id:""+orgids[i]}).each(function(r) {
		var mapdata="";	
		var comma="";
		if(r.address_line1) {
			mapdata = r.address_line1+" ";
			comma=",";
		}
		if(r.city_and_state) {
			mapdata=mapdata + comma + r.city_and_state;
			comma=",";
		}
		if(r.postal_code) {
			mapdata = mapdata + comma + r.postal_code;
		}
		if(mapdata != "") {
			var mapurl="http://maps.google.com/?q=" + mapdata;
			mapdata ="<li class=\"fa fa-location-arrow\" style=\"text-align:center\"><a target=\"_blank\" href=\""+ mapurl + "\">" + mapdata + "</a></li>"; 
		}
		r.phone = textToPhone(r.phone);
		html=html +"<div class=\"listback\" onclick=\"loadOrganization(" + r.org_id +");\"><ul><li><h9>"+r.name_en+"</h9></li>" + mapdata + "<li class=\"fa fa-phone\" style=\"text-align:center\"> Phone: " + r.phone + "</li></ul></div><div></div>";
	});};
	$('.mainpanel').empty();
	if(html == "") {
html="<h4>No Favourites found. Click on the star button in program/event/organization description page to add to favourites.</h4>";
	}
	$('.mainpanel').html(html);
	$('.mainpanel').scrollTop(0);
}
function loadOrganization(id) {
	$.jStorage.set("organization",id);
	window.location="organization.html";
	}
function loadProgram(id) {
	$.jStorage.set("program",id);
	window.location="programs.html";
	}
function loadEvent(eventid, uniqueid) {
	$.jStorage.set("eventid",eventid);
	$.jStorage.set("uniqueid",uniqueid);
	window.location="event.html";
	}
function loadPrograms() {
	firsttime=false;
	if(!filterValue || filterValue=="") {
	checkCommunity();
	selectedCategory = $.jStorage.get("category");
	if(!selectedCategory || !programsdb) {
		window.location="index.html";
		return;
	}
//	$.jStorage.deleteKey("category");
	search = $.jStorage.get("search");
	if(!search) {
		search=0;
	}
	if(search ==1) {
		categoryName = selectedCategory;
	} else {
	categoryName = categorydb({category_id:selectedCategory}).first().name_en;
	}
	if(categoryName == "Organizations A-Z") {
		$('.index').addClass('current_page_item');
		loadOrganizations();
		return;
	}
	if(categoryName == "Helplines") {
		$('.help').addClass('current_page_item');
		loadHelplines();
		return;
	}
	if(categoryName == "What's Happening?") {
		$('.events').addClass('current_page_item');
		loadEvents();
		return;
	}
	$('.index').addClass('current_page_item');
	if(search ==1)
		communityName ="East-Algoma Search Results";
	else
		communityName = communitydb({community_id:selectedCommunity}).first().name;
	$('#titlefield').html(communityName +": " + categoryName);	
	filterValue="A";
	prevIndex = $('#defaultselected');
	firsttime=true;
	$('#glossary li').click(function ()
	{
	    var selected = $(this).text();
		prevIndex.removeClass('selected');
		$(this).addClass('selected');
		prevIndex=$(this);
		filterValue=selected;
		loadPrograms();
	});
	if(search ==0) {
	$('.mainpanel').height($('#glossary').height());
		$('.mainpanel').animate({'marginLeft' : "+15px"});
	}
	else $('.mainpanel').css('height', 'auto');
	}
	//alert(selectedCategory);
	var html="";
	var htmlData={};
	var headerValue = filterValue.charAt(0)+"";
	htmlData[headerValue] = "<div class=\"listheader\"><ul><li style=\"text-align:center \">"+headerValue+"</li></ul></div>";
	if(search ==1) {
	htmlData={};
	filterValue="";
	communitydb().each(function(c1) {
		headerValue = c1.name;
		htmlData[headerValue] = 
		"<div class=\"10u listbackh\"><ul><li style=\"text-align:center\">"+headerValue+"</li></ul></div>";
	programsdb({name_en:{likenocase:selectedCategory},communities:{has:c1.community_id}}).order('name_en').each(function(r) {
		if(r.name_en >= filterValue) {
		var mapdata="";	
		var comma="";
		if(r.address_line1) {
			mapdata = r.address_line1+" ";
			comma=",";
		}
		if(r.city_and_state) {
			mapdata=mapdata + comma + r.city_and_state;
			comma=",";
		}
		if(r.postal_code) {
			mapdata = mapdata + comma + r.postal_code;
		}
		if(mapdata != "") {
			var mapurl="http://maps.google.com/?q=" + mapdata;
			mapdata ="<li class=\"fa fa-location-arrow\" style=\"text-align:center\"><a target=\"_blank\" href=\""+ mapurl + "\">" + mapdata + "</a></li>"; 
		}
		r.phone = textToPhone(r.phone);
		htmlData[headerValue]=htmlData[headerValue] +"<div class=\"listback\" onclick=\"loadProgram(" + r.program_id +");\"><ul><li><h9>"+r.name_en+"</h9></li>" + mapdata + "<li class=\"fa fa-phone\" style=\"text-align:center\"> Phone: " + r.phone + "</li></ul></div><div></div>";
		}
	});
	programsdb({description_en:{likenocase:selectedCategory},communities:{has:c1.community_id}}).order('name_en').each(function(r) {
		if(r.name_en >= filterValue) {
		var mapdata="";	
		var comma="";
		if(r.address_line1) {
			mapdata = r.address_line1+" ";
			comma=",";
		}
		if(r.city_and_state) {
			mapdata=mapdata + comma + r.city_and_state;
			comma=",";
		}
		if(r.postal_code) {
			mapdata = mapdata + comma + r.postal_code;
		}
		if(mapdata != "") {
			var mapurl="http://maps.google.com/?q=" + mapdata;
			mapdata ="<li class=\"fa fa-location-arrow\" style=\"text-align:center\"><a target=\"_blank\" href=\""+ mapurl + "\">" + mapdata + "</a></li>"; 
		}
		r.phone = textToPhone(r.phone);
		htmlData[headerValue]=htmlData[headerValue] +"<div class=\"listback\" onclick=\"loadProgram(" + r.program_id +");\"><ul><li><h9>"+r.name_en+"</h9></li>" + mapdata + "<li class=\"fa fa-phone\" style=\"text-align:center\"> Phone: " + r.phone + "</li></ul></div><div></div>";
	}
	});
	var tmp={};
		orgdb({name_en:{likenocase:selectedCategory},communities:{has:c1.community_id}}).order('name_en').each(function(r) {
		if(!tmp[r.org_id] && r.name_en >= filterValue) {
		var mapdata="";	
		var comma="";
		if(r.address_line1) {
			mapdata = r.address_line1+" ";
			comma=",";
		}
		if(r.city_and_state) {
			mapdata=mapdata + comma + r.city_and_state;
			comma=",";
		}
		if(r.postal_code) {
			mapdata = mapdata + comma + r.postal_code;
		}
		if(mapdata != "") {
			var mapurl="http://maps.google.com/?q=" + mapdata;
			mapdata ="<li class=\"fa fa-location-arrow\" style=\"text-align:center\"><a target=\"_blank\" href=\""+ mapurl + "\">" + mapdata + "</a></li>"; 
		}
		r.phone = textToPhone(r.phone);
		htmlData[headerValue]=htmlData[headerValue] +"<div class=\"listback\" onclick=\"loadOrganization(" + r.org_id +");\"><ul><li><h9>"+r.name_en+"</h9></li>" + mapdata + "<li class=\"fa fa-phone\" style=\"text-align:center\"> Phone: " + r.phone + "</li></ul></div><div></div>";

		tmp[r.org_id]=1;
	}
	});
	orgdb({mission_statement_en:{likenocase:selectedCategory},communities:{has:c1.community_id}}).order('name_en').each(function(r) {
		if(!tmp[r.org_id] && r.name_en >= filterValue) {
		var mapdata="";	
		var comma="";
		if(r.address_line1) {
			mapdata = r.address_line1+" ";
			comma=",";
		}
		if(r.city_and_state) {
			mapdata=mapdata + comma + r.city_and_state;
			comma=",";
		}
		if(r.postal_code) {
			mapdata = mapdata + comma + r.postal_code;
		}
		if(mapdata != "") {
			var mapurl="http://maps.google.com/?q=" + mapdata;
			mapdata ="<li class=\"fa fa-location-arrow\" style=\"text-align:center\"><a target=\"_blank\" href=\""+ mapurl + "\">" + mapdata + "</a></li>"; 
		}

		r.phone = textToPhone(r.phone);
		htmlData[headerValue]=htmlData[headerValue] +"<div class=\"listback\" onclick=\"loadOrganization(" + r.org_id +");\"><ul><li><h9>"+r.name_en+"</h9></li>" + mapdata + "<li class=\"fa fa-phone\" style=\"text-align:center\"> Phone: " + r.phone + "</li></ul></div><div></div>";
		tmp[r.org_id]=1;
	}
	});
	});
	keys = Object.keys(htmlData);
	keys.sort();
	var len = keys.length;
	var i=0;
	for(i=0; i<len; i++) {
		html += htmlData[keys[i]];
	}
	$("#glossary").hide();
	$('#gototop').show();
	$('#gototop').click(function() {
          $(window).scrollTop(0);});
	} else {
	var headerAdded = 0;
	var headerValue = filterValue.charAt(0)+"";
	programsdb({name_en:{gte:filterValue},categories:{like:selectedCategory},communities:{like:selectedCommunity}}).order('name_en').each(function(r) {
		var mapdata="";	
		var comma="";
		if(r.address_line1) {
			mapdata = r.address_line1+" ";
			comma=",";
		}
		if(r.city_and_state) {
			mapdata=mapdata + comma + r.city_and_state;
			comma=",";
		}
		if(r.postal_code) {
			mapdata = mapdata + comma + r.postal_code;
		}
		if(mapdata != "") {
			var mapurl="http://maps.google.com/?q=" + mapdata;
			mapdata ="<li class=\"fa fa-location-arrow\" style=\"text-align:center\"><a target=\"_blank\" href=\""+ mapurl + "\">" + mapdata + "</a></li>"; 
		}
		var tmp = r.name_en.charAt(0).toUpperCase()+"";
		if(tmp != headerValue) {
			headerValue=tmp;
			headerAdded=0;
		}
	 	if(headerAdded ==0) {	
			html=html +"<div class=\"listheader\"><ul><li style=\"text-align:center\">"+headerValue+"</li></ul></div>";
			headerAdded=1;
		}
		r.phone = textToPhone(r.phone);
		html=html +"<div class=\"listback\" onclick=\"loadProgram(" + r.program_id +");\"><ul><li><h9>"+r.name_en+"</h9></li>" + mapdata + "<li class=\"fa fa-phone\" style=\"text-align:center\"> Phone: " + r.phone + "</li></ul></div><div></div>";
	});
	$('#gototop').hide();
	}
	$('.mainpanel').empty();
	if(html == "") {
		html="<h4 style=\"background:url('../images/listback@2x.png');\">No matches found!</h4>";
		if(firsttime) {
			$("#glossary").hide();
		}
	}
	 $('.mainpanel').html(html);
	$('.mainpanel').scrollTop(0);
$( ".listback a" ).click(function( event ) {
  event.stopPropagation();
  // Do something
});
}
function loadHelplines() {
	firsttime=false;
	if(!selectedValue ||selectedValue =="") {
		firsttime=true;
		$('#helplinemenu').addClass('current_page_item');
		checkCommunity();
		selectedCategory = $.jStorage.get("category");
		communityName = communitydb({community_id:selectedCommunity}).first().name;
		$('#titlefield').html(communityName +": " + categoryName);	
		selectedValue="A";
		prevIndex = $('#defaultselected');
		$('#glossary li').click(function ()
		{
		    var selected = $(this).text();
			prevIndex.removeClass('selected');
			$(this).addClass('selected');
			prevIndex=$(this);
			selectedValue=selected;
			loadHelplines();
		});
		$('.mainpanel').height($('#glossary').height());
		$('.mainpanel').animate({'marginLeft' : "+15px"});
	} 
	var html="";
	var headerAdded = 0;
	var headerValue = selectedValue.charAt(0)+"";
		programsdb({name_en:{gte:selectedValue},categories:{has:selectedCategory}},{communities:{has:selectedCommunity}}).order('name_en').each(function(r) {
		var mapdata="";	
		var comma="";
		if(r.address_line1) {
			mapdata = r.address_line1+" ";
			comma=",";
		}
		if(r.city_and_state) {
			mapdata=mapdata + comma + r.city_and_state;
			comma=",";
		}
		if(r.postal_code) {
			mapdata = mapdata + comma + r.postal_code;
		}
		if(mapdata != "") {
			var mapurl="http://maps.google.com/?q=" + mapdata;
			mapdata ="<li class=\"fa fa-location-arrow\" style=\"text-align:center\"><a target=\"_blank\" href=\""+ mapurl + "\">" + mapdata + "</a></li>"; 
		}
		var tmp1 = r.name_en.charAt(0).toUpperCase()+"";
		if(tmp1 != headerValue) {
			headerValue=tmp1;
			headerAdded=0;
		}
	 	if(headerAdded ==0) {	
			html=html +"<div class=\"listheader\"><ul><li style=\"text-align:center\">"+headerValue+"</li></ul></div>";
			headerAdded=1;
		}
		r.phone = textToPhone(r.phone);
		html=html +"<div class=\"listback\" onclick=\"loadProgram(" + r.program_id +");\"><ul><li><h9>"+r.name_en+"</h9></li>" + mapdata + "<li class=\"fa fa-phone helpline\" style=\"text-align:center;color:#f00;\"> Phone: " + r.phone + "</li></ul></div><div></div>";

	});
	$('.mainpanel').empty();
	if(html == "") {
		html="<h4 style=\"background:url('../images/listback@2x.png');\">No matches found!</h4>";
		if(firsttime) {
			$('#glossary').hide();
		}
	}
	$('.mainpanel').html(html);
	$('.mainpanel').scrollTop(0);
	$('#gototop').hide();
$( ".listback a" ).click(function( event ) {
  event.stopPropagation();
  // Do something
});
}
function loadOrganizations() {
	firsttime=false;
	if(!selectedValue || selectedValue =="" ) {
		selectedValue="A";
		prevIndex = $('#defaultselected');
		firsttime=true;
		communityName = communitydb({community_id:selectedCommunity}).first().name;
		$('#titlefield').html(communityName +": " + categoryName);	
		$('#glossary li').click(function ()
		{
		    var selected = $(this).text();
			prevIndex.removeClass('selected');
			$(this).addClass('selected');
			prevIndex=$(this);
			selectedValue=selected;
			loadOrganizations();
		});
		$('.mainpanel').height($('#glossary').height());
		$('.mainpanel').animate({'marginLeft' : "+15px"});
	}
	var html="";
	var tmp={};
	var headerAdded = 0;
	var headerValue = selectedValue.charAt(0)+"";
	orgdb({name_en:{gte:selectedValue},communities:{has:selectedCommunity}}).order('name_en').each(function(r1) {
		if(tmp[r1.org_id] == undefined) {
		var mapdata="";	
		var comma="";
		if(r1.address_line1) {
			mapdata = r1.address_line1+" ";
			comma=",";
		}
		if(r1.city_and_state) {
			mapdata=mapdata + comma + r1.city_and_state;
			comma=",";
		}
		if(r1.postal_code) {
			mapdata = mapdata + comma + r1.postal_code;
		}
		if(mapdata != "") {
			var mapurl="http://maps.google.com/?q=" + mapdata;
			mapdata ="<li class=\"fa fa-location-arrow\" style=\"text-align:center\"><a target=\"_blank\" href=\""+ mapurl + "\">" + mapdata + "</a></li>"; 
		}
		var tmp1 = r1.name_en.charAt(0).toUpperCase()+"";
		if(tmp1 != headerValue) {
			headerValue=tmp1;
			headerAdded=0;
		}
	 	if(headerAdded ==0) {	
			html=html +"<div class=\"listheader\"><ul><li style=\"text-align:center\">"+headerValue+"</li></ul></div>";
			headerAdded=1;
		}
		r1.phone = textToPhone(r1.phone);
		html=html +"<div class=\"listback\" onclick=\"loadOrganization(" + r1.org_id +");\"><ul><li><h9>"+r1.name_en+"</h9></li>" + mapdata + "<li class=\"fa fa-phone\" style=\"text-align:center\"> Phone: " + r1.phone + "</li></ul></div><div></div>";
		tmp[r1.org_id]=1;
	}
	});
	$('.mainpanel').empty();
	if(html == "") {
		html="<h4 style=\"background:url('../images/listback@2x.png');\">No matches found!</h4>";
		if(firsttime){
			$('#glossary').hide();
		}
	}
	$('.mainpanel').html(html);
	$('.mainpanel').scrollTop(0);
	$('#gototop').hide();
$( ".listback a" ).click(function( event ) {
  event.stopPropagation();
  // Do something
});	
}
function initMain() {
	if(!communitydb) {
		updateDB();
	}
}
function selectCategory(id) {
	$.jStorage.deleteKey("search");
	if(id == 9) {
		window.location="favorites.html";
		return;
        } else if(id == 10) {
		selectedCategory=$('.searchboxnew').val();
		$.jStorage.set("search","1");
	} else {
		var categories = categorydb();
		categories = categories.select("category_id");
		selectedCategory=categories[id];
	}
	$.jStorage.set("category",selectedCategory);
	window.location="programslist.html";
}

function loadData(url,fallback) {
	   //callApp(true);
	   $('#floatingBarsG').show();
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
             
             console.log(obj);
             
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

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-58171506-1', 'auto');
  ga('send', 'pageview');

    
    });