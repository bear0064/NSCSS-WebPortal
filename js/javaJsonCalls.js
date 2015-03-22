var communityId;
var categoryId;
var qry;
var data;

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

        communityId = $(this).attr("data-community");

        $("#main-nav").show();
        $("#main").animate({
            "left": "250px"
        }, "slow");


        var originalText = $(this).text();
        var modifiedText = originalText.replace("original", "cloned");
        $(".section-title>p").text(modifiedText);


        $(".col-1").empty()
        $(".menu").slideToggle();

    });








    $(".service").click(function () {

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


    qry = "http://www.nscss.com/EAConnects/admin/index.php?-table=programs&-sort=name_en+asc&categories=%3D" + categoryId + "&communities=%3D" + communityId + "&-action=export_json";


    qry1 = 'http://www.nscss.com/EAConnects/admin/index.php?-table=programs&-sort=communities+asc&categories=%3D13&communities=%3D1&-action=export_json';



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
        
        s += "<div class='listData'>";
		s += "<p>"+data[i].name_en+"</hp>";
        s += "</div>";        
		document.querySelector(".loaded").innerHTML += s;
        
        

    }
}