var communityId;
var categoryId;
var selectedServ;
var data;
var info;
var dateString;
var searchValue;
var searchTrig;

$(document).ready(function () {

    //listen for ready    


    $(function () {
        dateString = $.datepicker.formatDate("mm/dd/yy", $("#datepicker").datepicker("getDate"))
    });





    $(".searchButton").click(function (e) {
        e.preventDefault();

        if ( typeof( e.isTrigger ) == 'undefined' ) {
            searchTrig = true;   
        }
        
        
        $("#datepicker").hide();

        if ($('.searchField').val() != '' || $('.searchField').val().length != 0) {
            searchValue = $('.searchField').val();
            $('.searchField').val('');

            $(".serviceHeader").empty();
            $(".loaded").empty();
            searchFunc();

        } else {

            $(".serviceHeader").empty();
            $(".loaded").empty();

            var q = "";
            q += "<h1 id='serviceHead'>Search field cannot be empty!</h1>";
            document.querySelector(".loaded").innerHTML += q;

        }


    });



    $("#location-nav").click(function (event) {
        event.preventDefault();
        $(".menu").slideToggle();

        //Set communityId for side menu link build     
    });

    $(".community").click(function (event) {
        event.preventDefault();

        communityId = $(this).attr("data-community");


        $("#main-nav").show();
        $("#main").animate({
            "left": "250px"
        }, "slow");


        var originalText = $(this).text();
        var modifiedText = originalText.replace("original", "cloned");
        $(".section-title>p").text(modifiedText);


        $(".col-1").empty()

    });


    $(".sdcommunity").click(function (event) {
        event.preventDefault();
        $("#datepicker").hide();
        $(".serviceHeader").empty();
        $(".loaded").empty();


        communityId = $(this).attr("data-community");

        $("#main-nav").show();
        $("#main").animate({
            "left": "250px"
        }, "slow");


        var originalText = $(this).text();
        var modifiedText = originalText.replace("original", "cloned");
        $(".section-title>p").text(modifiedText);


        $(".col-1").empty()
            //document.querySelector(".infoBody").innerHTML = "";
        $(".menu").slideToggle();

    });


    $(".service").click(function () {
        $("#datepicker").hide();
        $(".serviceHeader").empty();
        $(".loaded").empty();

        if ($(this).attr("data-category") === "22") {
            $("#datepicker").css('display', 'inline-block');
            categoryId = $(this).attr("data-category");
            getUpcomingByDay();
            //sendQryUpCome();
        } else if ($(this).attr("data-category") === "21") {
            categoryId = $(this).attr("data-category");
            sendQryOrg();

        } else {
            categoryId = $(this).attr("data-category");
            sendQry();
        }
        //Set categoryId for query out

        //link to a method to create query and send for the data    

        var originalText = $(this).text();
        var modifiedText = originalText.replace("original", "cloned");
        $(".serviceHeader").text(modifiedText);
    });

});
// end ready





function displayRes() {

    $(".loaded").empty();

 
    
    if(searchTrig === true){
        
        var q = "";

        q += "<h1 id='serviceHead'>Results for " + "'" + searchValue + "'" + "</h1>";

        document.querySelector(".loaded").innerHTML += q;
        
    } 
    
    if (data.length <= 0) {
        var q = "";

        q += "<h1 id='serviceHead'>Sorry, no results available.</h1>";

        document.querySelector(".loaded").innerHTML += q;
    }

    for (var i = 0; i < data.length; i++) {

        var s = "";


        if (data[0].org_id && data[0].program_id) {

            s += "<div class='listData' data-ref='" + data[i].program_id + "'>";

        } else if (data[0].event_id && !data[0].org_id && !data[0].program_id) {

            s += "<div class='listData' data-ref='" + data[i].event_id + "'>";

        } else {

            s += "<div class='listData' data-ref='" + data[i].org_id + "'>";

        }



        s += "<h3 class='serviceName'>" + data[i].name_en + "</h3>";

        if (data[i].address_line1) {
            s += "<p>" + data[i].address_line1 + "</p>";
        } else {};
        if (data[i].phone) {
            s += "<p>" + data[i].phone + "</p>";
        } else {};
        s += "</div>";
        document.querySelector(".loaded").innerHTML += s;

    }


    $(".listData").click(function (event) {
        //event.preventDefault();


        if (data[0].org_id && data[0].program_id) {

            selectedServ = $(this).attr("data-ref");
            console.log('Serv ' + selectedServ);
            getService();

        } else if (data[0].event_id && !data[0].org_id && !data[0].program_id) {

            selectedServ = $(this).attr("data-ref");
            console.log('Event ' + selectedServ);
            getEvent();

        } else {

            selectedServ = $(this).attr("data-ref");
            console.log('Org ' + selectedServ);
            getOrganization();

        }




        //displaySrv();    

    });

}


function displaySrv(event) {
    $(".serviceHeader").empty();
    $(".loaded").empty();


    var q = "";

    q += "<h1 id='serviceHead'>" + info[0].name_en + "</h1>";
    q += "<div>";


    if (categoryId === "21") {
        q += "<img id='serviceimg' src='http://www.nscss.com/EAConnects/admin/getimage.php?type=2&amp;org_id=" + selectedServ + "'>";

    } else if (categoryId === "22") {
        q += "<img id='serviceimg' src='http://www.nscss.com/EAConnects/admin/getimage.php?type=2&amp;event_id=" + selectedServ + "'>";

    } else {
        q += "<img id='serviceimg' src='http://www.nscss.com/EAConnects/admin/getimage.php?type=2&amp;program_id=" + selectedServ + "'>";
    }



    q += "</div>";

    q += "<p id='desc'>" + info[0].description_en + "</p>";


    if (!info[0].monday_start && !info[0].tuesday_start && !info[0].wednesday_start && !info[0].thursday_start && !info[0].friday_start && !info[0].saturday_start && !info[0].sunday_start && !info[0].start_time && !info[0].end_time) {

        //DO Nothing

    } else if (!info[0].monday_start && !info[0].tuesday_start && !info[0].wednesday_start && !info[0].thursday_start && !info[0].friday_start && !info[0].saturday_start && !info[0].sunday_start && info[0].start_time && info[0].start_time) {

        //If there are no hours for Ops and an event start time

        q += "<div id='hop'>";
        q += "<h3>Event Time</h3>";
        q += "<p>" + getTime(info[0].start_time) + " - " + getTime(info[0].end_time) + "</p>";

        //show this

    } else if (info[0].monday_start !== null && info[0].monday_start !== "" || info[0].tuesday_start !== null && info[0].tuesday_start !== "" || info[0].wednesday_start !== null && info[0].wednesday_start !== "" || info[0].thursday_start !== null && info[0].thursday_start !== "" || info[0].friday_start !== null && info[0].friday_start !== "" || info[0].saturday_start !== null && info[0].saturday_start !== "" || info[0].sunday_start !== null && info[0].sunday_start !== "") {

        //IF there are hours to show, then show this

        q += "<div id='hop'>";
        q += "<h3>Hours of Operation</h3>";

        if (info[0].monday_start !== null && info[0].monday_end !== null) {
            q += "<p>Monday: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + getTime(info[0].monday_start) + " - " + getTime(info[0].monday_end) + "</p>";
        } else {

        }


        if (info[0].tuesday_start !== null && info[0].tuesday_end !== null) {
            q += "<p>Tuesday: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + getTime(info[0].tuesday_start) + " - " +
                getTime(info[0].tuesday_end) + "</p>";
        } else {

        };
        if (info[0].wednesday_start !== null && info[0].wednesday_end !== null) {
            q += "<p>Wednesday: &nbsp;" + getTime(info[0].wednesday_start) + " - " + getTime(info[0].wednesday_end) + "</p>";
        } else {

        };
        if (info[0].thursday_start !== null && info[0].thursday_end !== null) {
            q += "<p>Thursday: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + getTime(info[0].thursday_start) + " - " + getTime(info[0].thursday_end) + "</p>";
        } else {

        };
        if (info[0].friday_start !== null && info[0].friday_end !== null) {

            q += "<p>Friday: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + getTime(info[0].friday_start) + " - " + getTime(info[0].friday_end) + "</p>";
        } else {

        };
        if (info[0].saturday_start !== null && info[0].saturday_end !== null) {
            q += "<p>Saturday: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + getTime(info[0].saturday_start) + " - " + getTime(info[0].saturday_end) + "</p>";
        } else {

        }
        if (info[0].sunday_start !== null && info[0].sunday_end !== null) {
            q += "<p>Sunday: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + getTime(info[0].sunday_start) + " - " + getTime(info[0].sunday_end) + "</p>";
        } else {

        }

        if (info[0].monday_start !== null || info[0].tuesday_start !== null || info[0].wednesday_start !== null || info[0].thursday_start !== null || info[0].fridayday_start !== null || info[0].saturdayday_start !== null || info[0].sunday_start !== null) {
            q += "</div>";
        } else {}

    } // End logic



    q += "<div id='contactDiv'>";
    q += "<h3 id='contHead'>Contact Information</h3>";


    if (info[0].phone !== null && info[0].phone !== "") {
        q += "<p id='phone'>Phone:  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + info[0].phone + "</p>";
    } else {};

    if (info[0].fax !== null && info[0].fax !== "") {
        q += "<p id='fax'>Fax:  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;" + info[0].fax + "</p>";
    } else {};

    if (info[0].email !== null && info[0].email !== "") {
        q += "<p>Email:  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href=mailto:" + info[0].email + " id='email'>" + info[0].email + "</a></p>";
    } else {};

    if (info[0].website !== null && info[0].website !== "") {
        q += "<p>Website: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href=" + info[0].website + "id='webpage'>" + info[0].name_en + "</a></p>";
    } else {};

    q += "</div>";


    if (info[0].address_line1 !== "" && info[0].address_line1 !== null || info[0].address_line2 !== "" && info[0].address_line2 !== null) {
        q += "<div id='address'>";
        q += "<h3>Address: </h3>";
    } else {}


    if (info[0].address_line1 !== null) {
        q += "<p id='addLine1'>" + info[0].address_line1 + "</p>";
    } else {}
    if (info[0].address_line2 !== null) {
        q += "<p id='addLine2'>" + info[0].address_line2 + "</p>";
    } else {}


    if (info[0].city_and_state !== null) {
        q += "<p id='addLine1'>" + info[0].city_and_state + "</p>";
    } else {}

    if (info[0].postal_code !== null) {
        q += "<p id='addLine1'>" + info[0].postal_code + "</p>";
    } else {}

    q += "</div>";


    if (info[0].address_line1 !== null && info[0].address_line1 !== "" && info[0].city_and_state !== null && info[0].city_and_state !== "" && info[0].postal_code !== null && info[0].postal_code !== "") {
        q += "<iframe id='map' width='600' height='350' frameborder='0' style='border:0' src='https://www.google.com/maps/embed/v1/place?q=" + info[0].address_line1 + ',' + info[0].city_and_state + ',' + info[0].postal_code + " &key=AIzaSyBiHQYWPrjtUIlKgprnAcftiBtcO2iU0zw'></iframe>"
    } else {}





    document.querySelector(".loaded").innerHTML += q;

}




function sendQry() {
    var qry = "http://www.nscss.com/EAConnects/admin/index.php?-table=programs&-sort=name_en+asc&categories=%3D" + categoryId + "&communities=%3D" + communityId + "&-limit=200&-action=export_json";


    $(document).ajaxStart(function () {
            $("#ajaxSpinnerImage").remove();
            $('.infoBody').append("<img src='img/ajax-loader.gif' id='ajaxSpinnerImage'/></img>");
            $('#ajaxSpinnerImage').show();
        })
        .ajaxStop(function () {
            $('#ajaxSpinnerImage').hide();
        });

    var request =
        $.ajax({
            url: qry,
            type: "GET",
            dataType: "json"
        });

    request.done(function (msg) {
        data = msg;
        console.log(msg);
        console.log(data);
        displayRes();

    });

    request.fail(function (jqXHR, textStatus) {
        alert("Request failed: " + textStatus);
    });

}




function sendQryOrg() {

    var qryServ = "http://www.nscss.com/EAConnects/admin/index.php?-table=Organizations&communities=%3D" + communityId + "&-sort=name_en+asc&-limit=200&-action=export_json";

    var request = $.ajax({
        url: qryServ,
        type: "GET",
        dataType: "json"
    });

    request.done(function (org) {

        data = org;
        console.log(org);
        console.log(data);
        displayRes();

    });

    request.fail(function (jqXHR, textStatus) {
        alert("Request failed: " + textStatus);
    });

}



function getService() {

    var qryServ = "http://www.nscss.com/EAConnects/admin/index.php?-table=programs&program_id=" + selectedServ + "&-limit=200&-action=export_json"


    var request = $.ajax({
        url: qryServ,
        type: "GET",
        dataType: "json"
    });

    request.done(function (svc) {

        info = svc;
        console.log(svc);
        console.log(info);
        displaySrv();

    });

    request.fail(function (jqXHR, textStatus) {
        alert("Request failed: " + textStatus);
    });


}


function getOrganization() {


    //        beforeSend:function(){(function () {
    //
    //            $("#ajaxSpinnerImage").remove();
    //
    //            $('.infoBody').append("<img src='img/ajax-loader.gif' id='ajaxSpinnerImage'/></img>");
    //            $('#ajaxSpinnerImage').show();
    //
    //        })
    //        .ajaxStop(function () {
    //            $('#ajaxSpinnerImage').hide();
    //
    //        });    

    var qryServ = "http://www.nscss.com/EAConnects/admin/index.php?-table=programs&org_id=" + selectedServ + "&-limit=200&-action=export_json"


    var request = $.ajax({
        url: qryServ,
        type: "GET",
        dataType: "json"
    });

    request.done(function (svc) {
        info = svc;
        console.log(svc);
        console.log(info);
        displaySrv();

    });

    request.fail(function (jqXHR, textStatus) {
        alert("Request failed: " + textStatus);
    });


}







function getEvent() {

    var qryServ = "http://www.nscss.com/EAConnects/admin/index.php?-table=new_events&event_id=" + selectedServ + "&-limit=200&-action=export_json";



    var request = $.ajax({
        url: qryServ,
        type: "GET",
        dataType: "json"
    });

    request.done(function (svc) {

        info = svc;
        console.log(svc);
        console.log(info);
        displaySrv();

    });

    request.fail(function (jqXHR, textStatus) {
        alert("Request failed: " + textStatus);
    });


}



function getTime(obj) {
    var hours = obj.hours;
    var mins = obj.minutes;
    var im = parseInt(mins);
    var ih = parseInt(hours);
    if (ih < 12) {
        ap = " AM";
    } else {
        ap = " PM";
    }
    if (ih > 12) {
        ih -= 12;
    }
    if (im < 10)
        return ih + ":0" + im + ap;
    else
        return ih + ":" + im + ap;

}




$(function () {
    $('#datepicker').datepicker({
        onSelect: function (dateText) {
            dateString = dateText; //the first parameter of this function
            //var dateAsObject = $(this).datepicker( 'getDate' ); //the getDate method    
            //    console.log(encodeURIComponent(dateString));
            getUpcomingByDay();

        },
        minDate: 0


    });


});




function getUpcomingByDay() {


    var qryServ = "http://www.nscss.com/EAConnects/admin/index.php?-table=new_events&-limit=30&-sort=start_date+asc&start_date=" + encodeURIComponent(dateString) + "&-action=export_json";


    var request = $.ajax({
        url: qryServ,
        type: "GET",
        dataType: "json",
        error: function (x, e) {
            if (x.status == 500) {
                var q = "";

                q += "<h1 id='serviceHead'>Sorry, No Events for" + dateString + "</h1>";
                q += "<div>";
                document.querySelector(".loaded").innerHTML += q;

            }
        }

    });

    request.done(function (msg) {
        data = msg;
        displayRes();
    });

    request.fail(function (jqXHR, textStatus) {
        alert("Request failed: " + textStatus);
    });
}









function searchFunc() {


    var qrySearch = "http://www.nscss.com/EAConnects/admin/index.php?-action=list&-table=programs&-limit=100&name_en=" + searchValue + "&-action=export_json";


    var request = $.ajax({
        url: qrySearch,
        type: "GET",
        dataType: "json",
        error: function (x, e) {
            if (x.status == 500) {
                var q = "";

                q += "<h1 id='serviceHead'>Sorry, no results availiable.</h1>";

                document.querySelector(".loaded").innerHTML += q;

            }
        }
    });

    request.done(function (src) {

        data = src;
        console.log(src);

        displayRes();

    });

    request.fail(function (jqXHR, textStatus) {

    });

}