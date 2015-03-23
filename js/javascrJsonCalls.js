var communityId;
var categoryId;
var selectedServ;
var data;
var info;



$(document).ready(function () {

    //listen for ready    


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

        $(".serviceHeader").empty();
        $(".loaded").empty();

        categoryId = $(this).attr("data-category");

        if ($(this).attr("data-category") === "22") {

            //sendQry2();

        }

        if ($(this).attr("data-category") === "21") {
            categoryId = $(this).attr("data-category");
            sendQryOrg();
        }
        //Set categoryId for query out
        
        //link to a method to create query and send for the data    

        var originalText = $(this).text();
        var modifiedText = originalText.replace("original", "cloned");
        $(".serviceHeader").text(modifiedText);


        //$(".col-1").empty()

        sendQry();


    });

});
// end ready



function sendQry() {

    //prep ajax call and qry to server

    var qry = "http://www.nscss.com/EAConnects/admin/index.php?-table=programs&-sort=name_en+asc&categories=%3D" + categoryId + "&communities=%3D" + communityId + "&-action=export_json";


    
    

$( document ).ajaxStart(function() {

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

        displayRes();

    });

    request.fail(function (jqXHR, textStatus) {
        alert("Request failed: " + textStatus);
    });

}




function getService() {

    var qryServ = "http://www.nscss.com/EAConnects/admin/index.php?-table=programs&program_id=" + selectedServ + "&-action=export_json"


    var request = $.ajax({
        url: qryServ,
        type: "GET",
        dataType: "json"
    });

    request.done(function (svc) {
        
        info = svc;

        displaySrv();

    });

    request.fail(function (jqXHR, textStatus) {
        alert("Request failed: " + textStatus);
    });


}



function sendQryOrg() {

    //prep ajax call and qry to server

    var qryServ = "http://www.nscss.com/EAConnects/admin/index.php?-table=Organizations&communities=%3D" + communityId + "&-sort=name_en+asc&-limit=200&-action=export_json";





    var request = $.ajax({
        url: qryServ,
        type: "GET",
        dataType: "json"
    });

    request.done(function (org) {
        
        data = org;
        
        displayRes();

    });

    request.fail(function (jqXHR, textStatus) {
        alert("Request failed: " + textStatus);
    });

}



function displayRes() {

    $(".loaded").empty();

    for (var i = 0; i < data.length; i++) {

        var s = "";
        if (!data[i].program_id) {
            s += "<div class='listData' data-ref='" + data[i].org_id + "'>";
        } else {
            s += "<div class='listData' data-ref='" + data[i].program_id + "'>";

        }
        s += "<h3 class='serviceName'>" + data[i].name_en + "</h3>";
        s += "<p>" + data[i].address_line1 + "</p>";
        s += "<p>" + data[i].phone + "</p>";
        s += "</div>";
        document.querySelector(".loaded").innerHTML += s;

    }


    $(".listData").click(function (event) {
        //event.preventDefault();

        if (!data[0].program_id) {

            selectedServ = $(this).attr("data-ref");

            getOrganization();

        } else {
            selectedServ = $(this).attr("data-ref");

            getService();
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

    if (categoryId === "21"){
        q += "<img id='serviceimg' src='http://www.nscss.com/EAConnects/admin/getimage.php?type=2&amp;org_id=" + selectedServ + "'>";

    }else{
    q += "<img id='serviceimg' src='http://www.nscss.com/EAConnects/admin/getimage.php?type=2&amp;program_id=" + selectedServ + "'>";
    }

    

    q += "</div>";

    q += "<p id='desc'>" + info[0].description_en + "</p>";

    
    if (info[0].monday_start !== null && info[0].monday_start !== "" || info[0].tuesday_start !== null && info[0].tuesday_start !== "" || info[0].wednesday_start !== null && info[0].wednesday_start !== "" || info[0].thursday_start !== null  && info[0].thursday_start !== "" || info[0].friday_start !== null  && info[0].friday_start !== ""  || info[0].saturday_start !== null  && info[0].saturday_start !== ""  || info[0].sunday_start !== null && info[0].sunday_start !== "" ) {
        q += "<div id='hop'>";
        q += "<h3>Hours of Operation</h3>";
    } else {
        
    }


    if (info[0].monday_start !== null && info[0].monday_end !== null) {
        q += "<p>Monday: " + info[0].monday_start.hours + ":" + info[0].monday_start.minutes + " - " + info[0].monday_end.hours + ":" + info[0].monday_end.minutes + "</p>";
    } else {

    }


    if (info[0].tuesday_start !== null && info[0].tuesday_end !== null) {
        q += "<p>Tuesday: " + info[0].tuesday_start.hours + ":" +
            info[0].tuesday_start.minutes + " - " +
            info[0].tuesday_end.hours + ":" +
            info[0].tuesday_end.minutes + "</p>";
    } else {

    };
    if (info[0].wednesday_start !== null && info[0].wednesday_end !== null) {
        q += "<p>Wednesday: " + info[0].wednesday_start.hours + ":" +
            info[0].wednesday_start.minutes + " - " +
            info[0].wednesday_end.hours + ":" +
            info[0].wednesday_end.minutes + "</p>";
    } else {

    };
    if (info[0].thursday_start !== null && info[0].thursday_end !== null) {
        q += "<p>Thursday: " + info[0].thursday_start.hours + ":" +
            info[0].thursday_start.minutes + " - " +
            info[0].thursday_end.hours + ":" +
            info[0].thursday_end.minutes + "</p>";
    } else {

    };
    if (info[0].friday_start !== null && info[0].friday_end !== null) {

        q += "<p>Friday: " + info[0].friday_start.hours + ":" +
            info[0].friday_start.minutes + " - " +
            info[0].friday_end.hours + ":" +
            info[0].friday_end.minutes + "</p>";
    } else {

    };
    if (info[0].saturday_start !== null && info[0].saturday_end !== null) {
        q += "<p>Saturday: " + info[0].saturday_start.hours + ":" +
            info[0].saturday_start.minutes + " - " +
            info[0].saturday_end.hours + ":" +
            info[0].saturday_end.minutes + "</p>";
    } else {

    }
    if (info[0].sunday_start !== null && info[0].sunday_end !== null) {
        q += "<p>Sunday: " + info[0].sunday_start.hours + ":" +
            info[0].sunday_start.minutes + " - " +
            info[0].sunday_end.hours + ":" +
            info[0].sunday_end.minutes + "</p>";
    } else {

    }

    if (info[0].monday_start !== null || info[0].tuesday_start !== null || info[0].wednesday_start !== null || info[0].thursday_start !== null || info[0].fridayday_start !== null || info[0].saturdayday_start !== null || info[0].sunday_start !== null) {
        q += "</div>";
    } else {

    }



    q += "<div id='contactDiv'>";
    q += "<h3 id='contHead'>Contact Information</h3>";
    q += "<p id='phone'>Phone: " + info[0].phone + "</p>";
    q += "<p id='fax'>Fax: " + info[0].fax + "</p>";

    if (info[0].email !== null) {
        q += "<p>Email: <a href=mailto:" + info[0].email + " id='email'>" + info[0].email + "</a></p>";
    } else {};

    if (info[0].website !== null) {
        q += "<p>Website: <a href=" + info[0].website + "id='webpage'>" + info[0].name_en + "</a></p>";
    } else {};

    q += "</div>";


    if (info[0].address_line1 !== "" || info[0].address_line2 !== "") {
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



function getOrganization() {

    var qryServ = "http://www.nscss.com/EAConnects/admin/index.php?-table=programs&org_id=" + selectedServ + "&-action=export_json"


    var request = $.ajax({
        url: qryServ,
        type: "GET",
        dataType: "json"
    });

    request.done(function (svc) {
        info = svc;

        displaySrv();

    });

    request.fail(function (jqXHR, textStatus) {
        alert("Request failed: " + textStatus);
    });


}








//
//function sendQry2() {
//
//    //prep ajax call and qry to server
//
//    var qry = "http://www.nscss.com/EAConnects/admin/index.php?-table=new_events&-action=list&-cursor=0&-mode=list&-limit=744&-action=export_json";
//
//
//
//
//    var request = $.ajax({
//        url: qry,
//        type: "GET",
//        dataType: "json"
//    });
//
//    request.done(function (msg) {
//        console.log(msg)
//        data = msg;
//        
//        console.log(msg);
//        displayRes();
//
//    });
//
//    request.fail(function (jqXHR, textStatus) {
//        alert("Request failed: " + textStatus);
//    });
//
//}