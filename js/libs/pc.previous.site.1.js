
// as the page loads, call these scripts
jQuery(document).ready(function($) {

	// Event Tracking for specific clicks
	if($('[data-event-category]').length){
		$('[data-event-category]').on('touchstart click', function(){
			var event_category = $(this).data('eventCategory'),
				event_action = $(this).data('eventAction'),
				event_label = $(this).data('eventLabel');
			ga('send', 'event', event_category, event_action, event_label);
		});
	}

    /* getting viewport width */
    var responsive_viewport = $(window).width();

    /* if is below 481px */
    if (responsive_viewport < 481) {

    } /* end smallest screen */

    /* if is larger than 481px */
    if (responsive_viewport > 481) {

    } /* end larger than 481px */

    /* if is above or equal to 768px */
    if (responsive_viewport >= 768) {

        /* load gravatars */
        $('.comment img[data-gravatar]').each(function(){
            $(this).attr('src',$(this).attr('data-gravatar'));
        });

    }

    /* off the bat large screen actions */
    if (responsive_viewport > 1030) {

    }

	$('.tool_tip_list li').on({
		mouseenter : function(){ $(this).find('.tipTool').show(); },
		mouseleave : function(){ $(this).find('.tipTool').hide(); }
	});

	// Adding Google Analytics PDF
	 $('.pdf-link a').on({
            click : function(){
            	_gaq.push(['_trackEvent', 'registration', 'service school']);
            }
     });
     $('.new-cust a').on({
	     click : function(){
         	_gaq.push(['_trackEvent', 'registration', 'new customer']);
         }
     });
     $('.broch-fiveseven').on({
	     click : function(){
         	_gaq.push(['_trackEvent', 'brochure', '5700-C']);
         }
     });

    $('.gallery').bxSlider({
		auto:true,
		pause: 9000,
		pager: false,
		adaptiveHeight: true
	});
	$('.gallery a').attr('rel','gallery').fancybox({
		beforeLoad: function() {
			this.title = $(this.element).find('img').attr('alt');
		}
	});

	function filterResults($items, $results){
		var countries = false; var apps = false; var states = false;
		$.each($results, function(index, element){
			if(element['value']){
				if(element['name'] == 'search-countries'){ countries = element['value']; }
				if(element['name'] == 'search-applications'){ apps = element['value']; }
				if(element['name'] == 'search-states'){ states = element['value']; }
			}
		});

		$items.each(function(){
			var country_present = false;
			var state_present = false;
			var app_present = false;

			if(countries){
				var country_data = $(this).data('countries');
				$.each(country_data, function(index, element){
					if(countries == element){ country_present = true; }
				});
			} else {
				country_present = true;
				$.uniform.update();
			}

			if(states){
				var state_data = $(this).data('states');
				$.each(state_data, function(index, element){
					if(states == element){ state_present = true; }
				});
			} else {
				state_present = true;
			}

			if(apps){
				var apps_data = $(this).data('apps');
				$.each(apps_data, function(index, element){
					if(apps == element){ app_present = true; }
				});
			} else {
				app_present = true;
			}

			if(country_present && state_present && app_present){
				$(this).fadeIn().addClass('active');
			} else{
				$(this).fadeOut().removeClass('active');
			}

		});
	}


	var $search_results;
	$('.search-form select').on('keyup change', function(){
		$search_results = $(this).parents('.search-form').serializeArray();
		filterResults($('.newsletter-item'), $search_results);
	});
	$('.search-form').on('reset', function(){
		$search_results = $(this).parents('.search-form').serializeArray();
		filterResults($('.newsletter-item'), $search_results);
		// Some hack we found on the issues page of the uniform plugin
		setTimeout($.uniform.update, 100);
	});

}); /* end of as page load scripts */
