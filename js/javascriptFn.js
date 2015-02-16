$(document).ready(function () {


    $("#location-nav").click(function () {
        $(".menu").slideToggle();
    });


    var winWidth = $(window).width();
    if (winWidth >= 768) {
        $(".category").click(function () {
            event.preventDefault();

            
$("#main-nav").show(); 
$("#main").animate({"left":"250px"}, "slow"); 

            
  var originalText = $(this).text(); 
  var modifiedText = originalText.replace("original", "cloned"); 
  $(".section-title>p").text(modifiedText);
            

            $(".col-1").empty()



        });
    }




});

