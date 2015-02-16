$(document).ready(function () {


    $("#location-nav").click(function () {
        $(".menu").slideToggle();
    });

/* just an idea here
var width = 992;
$(window).resize(function(){
   if($(this).width() <= width){
      width = $(this).width();
$("#main-nav").hide(); 
   }
});
  */  
    
    
  
        $(".category").click(function () {
            event.preventDefault();

            
$("#main-nav").show(); 
$("#main").animate({"left":"250px"}, "slow"); 

            
  var originalText = $(this).text(); 
  var modifiedText = originalText.replace("original", "cloned"); 
  $(".section-title>p").text(modifiedText);
            

            $(".col-1").empty()



        });
    




});

