jQuery(document).ready(function(){var speed=5000;var run=setInterval(rotate,speed);var slides=jQuery('.slide');var container=jQuery('#slides ul');var elm=container.find(':first-child').prop("tagName");var item_width=container.width();var previous='prev';var next='next';slides.width(item_width);container.parent().width(item_width);container.width(slides.length*item_width);container.find(elm+':first').before(container.find(elm+':last'));resetSlides();jQuery('#buttons a').click(function(e){if(container.is(':animated')){return!1}
if(e.target.id==previous){container.stop().animate({'left':0},1500,function(){container.find(elm+':first').before(container.find(elm+':last'));resetSlides()})}
if(e.target.id==next){container.stop().animate({'left':item_width*-2},1500,function(){container.find(elm+':last').after(container.find(elm+':first'));resetSlides()})}
return!1});container.parent().mouseenter(function(){clearInterval(run)}).mouseleave(function(){run=setInterval(rotate,speed)});function resetSlides(){container.css({'left':-1*item_width})}});function rotate(){jQuery('#next').click()}