var communityId;
var categoryId;
var selectedServ;
var data;
var info;

$(document).ready(function () {

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
        //Set categoryId for query out
        console.log(this);
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



    console.log(communityId);
    console.log(categoryId);


    var qry = "http://www.nscss.com/EAConnects/admin/index.php?-table=programs&-sort=name_en+asc&categories=%3D" + categoryId + "&communities=%3D" + communityId + "&-action=export_json";




    var request = $.ajax({
        url: qry,
        type: "GET",
        dataType: "json"
    });

    request.done(function (msg) {
        console.log(msg)
        data = msg;

        displayRes();

    });

    request.fail(function (jqXHR, textStatus) {
        alert("Request failed: " + textStatus);
    });

}


function displayRes() {

    $(".loaded").empty();

    for (var i = 0; i < data.length; i++) {
        console.log(data[i].name_en)

        var s = "";

        s += "<div class='listData' data-ref='" + data[i].program_id + "'>";
        s += "<h3 class='serviceName'>" + data[i].name_en + "</h3>";
        s += "<p>" + data[i].address_line1 + "</p>";
        s += "<p>" + data[i].phone + "</p>";
        s += "</div>";
        document.querySelector(".loaded").innerHTML += s;

    }


    $(".listData").click(function (event) {
        //event.preventDefault();

        selectedServ = $(this).attr("data-ref");

        console.log(selectedServ);


        getService();


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
        console.log(svc)
        info = svc;

        displaySrv();

    });

    request.fail(function (jqXHR, textStatus) {
        alert("Request failed: " + textStatus);
    });


}



function displaySrv(event) {
    $(".serviceHeader").empty();
    $(".loaded").empty();



    var q = "";

    q += "<h1 id='serviceHead'>" + info[0].name_en + "</h1>";
    
    q += "<div>"
    
    q += "<img id='serviceimg' src='http://www.nscss.com/EAConnects/admin/getimage.php?type=2&amp;program_id="+ selectedServ +"'>";
    
    q += "</div>"
    
    q += "<p id='desc'>" + info[0].description_en + "</p>";
    q += "<p id='servArea'>Service Areas (take some info here blah blah)</p>";
    
    q += "<div id='contactDiv'>"
    q += "<p id='contHead'>Contact Information</p>";
    q += "<p id='phone'>" + info[0].phone + "</p>";
    q += "<p id='fax'>" + info[0].fax + "</p>";
    if (info[0].email == null) {

    } else {
        q += "<a href=mailto:" + info[0].email + " id='email'>" + info[0].email + "</a>";
    };

    if (info[0].website == null) {

    } else {
        q += "<a href=" + info[0].website + "id='webpage'>" + info[0].name_en + "</a>";
    };
    if (info[0].address_line1 == null) {} else {
        q += "<p id='addLine1'>" + info[0].address_line1 + "</p>";
    }
    if (info[0].address_line2 == null) {} else {
        q += "<p id='addLine2'>" + info[0].address_line2 + "</p>";
    }
    
    
    if (info[0].city_and_state == null) {} else {
        q += "<p id='addLine1'>" + info[0].city_and_state + "</p>";
    }
    
    if (info[0].postal_code == null) {} else {
        q += "<p id='addLine1'>" + info[0].postal_code + "</p>";
    }
    
    q += "</div>"
    
    
    
    if (info[0].address_line1 == null && info[0].city_and_state == null && info[0].postal_code == null) {} else {
        
    
    q += "<iframe id='map' width='600' height='350' frameborder='0' style='border:0' src='https://www.google.com/maps/embed/v1/place?q="+ info[0].address_line1 + ',' +  info[0].city_and_state + ',' + info[0].postal_code +" &key=AIzaSyBiHQYWPrjtUIlKgprnAcftiBtcO2iU0zw'></iframe>"
    
    }
    
    
    
    
    document.querySelector(".loaded").innerHTML += q;

}