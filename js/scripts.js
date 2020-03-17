//=require libs/lazysizes.js  // Lazysizes
//=require libs/jquery.hoverIntent.1.8.1.js  // HoverIntent
//=require libs/jquery.superfish.1.7.4.js  // Superfish - jQuery Menus
//=require libs/slick.js // Slick Carousel
//=require libs/jquery.fancybox.2.1.5.js  // Fancybox
//=require libs/jquery.uniform.2.1.2.js  // Uniform JS
//=require libs/jRespond.0.1.js  // Responsive JS
//=require libs/isotope.pkgd.3.0.1.js  // Isotope for Isotopeyt hings
//=require libs/imagesloaded.pkgd.4.1.1.js  // imagesLoaded because Isotope chokes without imgs loaded


// Prevent conflicts between jQuery and other javascript libraries
jQuery.noConflict();

(function(window, document, $, jRespond) {

	$('.fancybox').fancybox();

	// ===== GLOBAL BREAKPOINT VALUES
	// ================================================================================

	var bp = {
		col4:  { min: 0,	max: 639 },
		col8:  { min: 640,	max: 959 },
		col12: { min: 960,	max: 1279 },
		col16: { min: 1280,	max: 10000 }
	};



	// ===== GLOBAL HELPER OBJECT
	// ================================================================================

	var globalHelper = {
		// Determines if an elements exists on the page
		elementExists: function(e) {
			if(e.length > 0) {
				return true;
			} else {
				return false;
			}
		},

		// Determines if an element is within the viewport
		isElementInViewport:  function(e, offset) {
			offset = ((typeof offset !== 'undefined') ? offset : 0);
			var vals = {
				eTop: (e.offset().top + offset),
				winTop: $(window).scrollTop(),
				winHeight: $(window).height(),
			};
			if((vals.winTop <= vals.eTop) && (vals.eTop < (vals.winTop + vals.winHeight))) {
				return true;
			} else {
				return false;
			}
		},

		// Scroll the browser to the given target.
		// Note:  'target' can be an integer or DOM node.
		scrollTo: function(target, duration) {
			duration = ((typeof duration !== 'undefined') ? duration : 500);
			target = ((typeof target === 'object') ? target.offset().top : target);
			$('html,body').animate({ scrollTop: target }, duration);
		},

		// Returns a function that, as long as it continues to be invoked, will not
		// be triggered. The function will be called after it stops being called for
		// N milliseconds. If 'immediate' is passed, trigger the function on the
		// leading edge, instead of the trailing.
		//
		// Use:  $(window).resize(globalHelper.debounce(function() { ...[your code here]... }, 500));
		// Source:  http://davidwalsh.name/javascript-debounce-function
		debounce: function(func, wait, immediate) {
			var timeout;
			return function() {
				var context = this, args = arguments;
				var later = function() {
					timeout = null;
					if(!immediate) { func.apply(context, args); }
				};
				var callNow = immediate && !timeout;
				clearTimeout(timeout);
				timeout = setTimeout(later, wait);
				if(callNow) { func.apply(context, args); }
			};
		}
	};



	// ===== GLOBAL ELEMENTS / FEATURES
	// ================================================================================

	var globalFeatures = {
		settings: {
			empty_p: $('p:empty'),
		},
		init: function() {
			this.removeEmptyPTags();
		},

		// Removes empty <p> tags from the page
		removeEmptyPTags: function() {
			this.settings.empty_p.remove();
		}
	};
	globalFeatures.init();



	// ===== EVENT TRACKING
	// ================================================================================

	var eventTracking = {
		settings: {
			tracker: $('.tracker'),
			phone_link: $('[data-store-location]')
		},
		init: function() {
			this.bindUIActions();
		},
		bindUIActions: function() {
			this.settings.tracker.on('click', function() {
				var data = {
					category: $(this).data('trackCategory'),
					action: $(this).data('trackAction'),
					label: $(this).data('trackLabel')
				};
				eventTracking.track(data.category, data.action, data.label);
			});
			this.settings.phone_link.on('click', function() {
				if($('html.touchevents').length) {
					eventTracking.track('Click-To-Call', 'Mobile Call', $(this).data('storeLocation'));
				} else {
					return false;
				}
			});
		},

		// Initiate a Google Analytics tracking event
		track: function(category, action, label) {
			label = ((typeof label !== 'undefined') ? label : '');
			console.log(label);
			gtag('event', action, {
				'event_category' : category,
			  'event_label' : label
			});
		}
	};
	eventTracking.init();


	//Facebook Tracking Locations Text
	$('#trackFacebookLocation').on('click', function() {
					    fbq('trackCustom', 'LocationsClick', {

					    });
					});



	// ===== CONTACT FORMS
	// ================================================================================

	var contactForm = {
		settings: {
			input: $('.form-label-inline .input-text'),
			uniform_elems: 'select, input[type="checkbox"], input[type="radio"]'
		},
		init: function() {
			this.uniformInit();
			this.setInitialState();
			this.bindUIActions();
		},
		bindUIActions: function() {
			this.settings.input.on('focus blur', function(e) {
				contactForm.toggleLabelPosition($(this), e);
			});
			$(this.settings.select).on('change', function(e) {
				contactForm.uniformUpdate();
				contactForm.toggleSelect();
			});
		},

		// Applies uniform styling to form elements (i.e. <select>)
		uniformInit: function() {
				$(this.settings.uniform_elems).uniform({
					selectAutoWidth: false
				});
		},

		// Updates the current status of all Uniform elements.
		// Useful for configurable products with multiple configuration options (some options will be
		// disabled/enabled as the user interacts with the add-to-cart form).
		uniformUpdate: function() {
			$.uniform.update();
		},

		// Looks for the presence of values witin form fields to determine if form
		// aesthetics (e.g. labels) need to change.
		setInitialState: function() {
			this.settings.input.each(function(i) {
				if($(this).val() != '') {
					$(this).parent('.form-row').addClass('label-up');
				}
			});
		},

		// Toggles the display of uniform select menus.
		// This is needed within Magento when toggling one select menu may show/hide another.
		toggleSelect: function() {
			$(this.settings.select).each(function(i) {
				if($(this).css('display') == 'block') {
					$(this).parent('.selector').show();
				}
				if($(this).css('display') == 'none') {
					$(this).parent('.selector').hide();
				}
			});
		},

		// Determines the position of a field's label based on focus and value
		toggleLabelPosition: function(elem, e) {
			if(e.type == 'focus') {
				elem.parent('.form-row').addClass('label-up');
			}
			if((e.type == 'blur') && (elem.val() == '')) {
				elem.parent('.form-row').removeClass('label-up');
			}
		}
	};
	contactForm.init();



	// ===== HEADER
	// ================================================================================

	var header = {
		settings: {
			body: $('body'),
			header: $('.header-top'),
			nav_trigger: $('.header-nav-trigger'),
			subnav_trigger: $('.header-nav .subnav-trigger'),
			search_trigger: $('.header-utility-link.search'),
			search_input: $('.header-search input'),
			search_close: $('.header-search .search-close'),
			account_trigger: $('.header-utility-link.account'),
			account_menu: $('.header-utility-link.account').parent('li'),
			call_trigger: $('.header-call-dropdown-trigger'),
			call_menu: $('.header-call-dropdown-wrapper'),
			desktop_nav: $('#menu-primary-navigation'),
			scroll: {
				scrolled: false,
				last_scroll_top: 0,
				delta: 20,    // change in scroll position required to show/hide header
				offset: 100   // scroll position required to hide header initially (scrolling down)
			},
			promos: {
				elem: $('.header-promos .promos'),
				options: {
					arrows: false,
					autoplay: true,
					autoplaySpeed: 5000,
					infinite: true,
					fade: true,
				}
			},
		},
		init: function() {
			this.bindUIActions();
			this.manageHeaderState(true);
			this.scrollListener();
			this.promosInit();
			this.toggleSuperFish('setup');
		},
		bindUIActions: function() {
			$(window).scroll(function(e) {
				this.settings.scroll.scrolled = true;
			}.bind(this));
			this.settings.header.on('mouseenter', function() {
				header.manageHeaderState(true, true);
			});
			this.settings.nav_trigger.on('touchstart click', function(e) {
				e.preventDefault(); // prevent double-firing on touch
				header.toggleNav();
			});
			this.settings.subnav_trigger.on('touchend click', function(e) {
				e.preventDefault(); // prevent double-firing on touch
				header.toggleSubNav($(this).parent('a').parent('li'));
				return false;
			});
			this.settings.promos.elem.on('init', function(e, slick) {
				slick.$slider.parent('.header-promos').addClass('enabled');
			});
			this.settings.search_trigger.on('click', function() {
				header.toggleSearch('on');
				return false;
			});
			this.settings.search_input.on('keyup', function(e) {
				if(e.keyCode == 27) {
					header.toggleSearch('off');
				}
			});
			this.settings.search_close.on('click', function() {
				header.toggleSearch('off');
				return false;
			});
			this.settings.account_trigger.on('click', function() {
				header.toggleAccountMenu();
			});
			this.settings.call_trigger.on('click', function() {
				header.toggleCallMenu();
				return false;
			});
		},

		// Listens for scroll events (registered above)
		scrollListener: function() {
			setInterval(function() {
				if(header.settings.scroll.scrolled) {
					header.manageHeaderState();
					header.settings.scroll.scrolled = false;
				}
			}, 250);
		},

		// Determines the state of the header (i.e. condensed, etc.).
		manageHeaderState: function(bypass_delta, hover) {
			bypass_delta = (typeof bypass_delta !== 'undefined') ? bypass_delta : false;
			hover = (typeof hover !== 'undefined') ? hover : false;
			var top = $(window).scrollTop();
			// Change in scroll position must be greater than or equal to "delta" to trigger an action
			if((Math.abs(this.settings.scroll.last_scroll_top - top) > this.settings.scroll.delta) || bypass_delta) {
				// If scroll position is passed offset ...
				if(top > this.settings.scroll.offset) {
					// If scrolling down ...
					if((top > this.settings.scroll.last_scroll_top) || bypass_delta) {
						this.settings.body.addClass('header-condensed-full').removeClass('header-condensed-partial');
					} else {
						this.settings.body.addClass('header-condensed-partial').removeClass('header-condensed-full');
					}
					// If triggered by hover ...
					if(hover) {
						this.settings.body.addClass('header-condensed-partial').removeClass('header-condensed-full');
					}
				} else {
					this.settings.body.removeClass('header-condensed-full header-condensed-partial');
				}
				this.settings.scroll.last_scroll_top = top;
			}
		},

		// Header Promos - Initialize
		promosInit: function() {
			this.settings.promos.elem.slick(this.settings.promos.options);
		},

		// Toggle the display of the main navigation menu
		toggleNav: function() {
			this.settings.body.toggleClass('header-nav-enabled');
		},

		// Toggle the display of any subnav menu
		toggleSubNav: function(subnav) {
			subnav.toggleClass('enabled');
		},

		// Toggle the display of the search bar
		toggleSearch: function(status) {
			switch(status) {
				case 'on':
					this.settings.body.addClass('header-search-enabled');
					this.settings.search_input.focus();
					break;
				case 'off':
					this.settings.body.removeClass('header-search-enabled');
					break;
			}
		},

		// Toggle the display of the "My Account" menu
		toggleAccountMenu: function() {
			this.settings.account_menu.toggleClass('active');
		},

		// Toggle the display of the "Call/Phone" menu
		toggleCallMenu: function() {
			this.settings.call_menu.toggleClass('active');
		},

		// Setup Superfish ONLY on larger breakpoints
		toggleSuperFish: function(state) {
			if(($(window).width() > bp.col12.min) && (state === 'setup')){
				this.settings.desktop_nav.superfish({
					popUpSelector: '.mega-menu',
					speed: 0,
					speedOut: 0
				})
			}
			if(this.settings.desktop_nav.hasClass('sf-js-enabled') && state === 'destroy') {
				this.settings.desktop_nav.superfish('destroy');
			}
		},
	};
	header.init();



	// ===== HERO ASSET (IMAGES / VIDEOS / SLIDER) AREA
	// ================================================================================

	var heroArea = {
		settings: {
			required_element: $('.hero-wrapper'),
			slider: {
				elem: $('.hero-wrapper .slider'),
				slide: $('.hero-wrapper .slide'),
				ctrl: $('.hero-wrapper .hero-ctrl'),
				options: {
					adaptiveHeight: true,
					autoplay: true,
					autoplaySpeed: 8000,
					prevArrow: $('.hero-wrapper .hero-ctrl-prev'),
					nextArrow: $('.hero-wrapper .hero-ctrl-next'),
				}
			}
		},
		init: function() {
			if(globalHelper.elementExists(this.settings.required_element)) {
				this.bindUIActions();
				this.sliderInit();
				this.objectFitFallback();
			}
		},
		bindUIActions: function() {
			this.settings.slider.ctrl.on('touchstart click', function(e) {
				e.preventDefault(); // prevent double-firing on touch
				heroArea.sliderStopAutoPlay();
			});
		},

		// Slider - Initialize
		sliderInit: function() {
			if(this.settings.slider.slide.length > 1) {
				this.settings.slider.elem.slick(this.settings.slider.options);
			}
		},

		// Slider - Stop AutoPlay
		sliderStopAutoPlay: function() {
			this.settings.slider.elem.slick('slickPause');
		},

		// Custom fallback for displaying hero imagery on browsers without "object-fit" capabilities.
		objectFitFallback: function() {
			if(!Modernizr.objectfit && (window.innerWidth >= bp.col12.min)) {
				$('.hero-asset-img').each(function() {
					var imgsrc = $(this).find('img')[0].currentSrc || $(this).find('img')[0].src;
					$(this).addClass('polyfilled').css('background-image', 'url("'+imgsrc+'")');
				});
			}
		}
	};
	heroArea.init();



	// ===== CARDS / MASONRY GRID
	// ================================================================================

	var card = {
		settings: {
			card_deck: $('.isotope-card-deck'),
			card_clickable: $('.card.clickable'),
			isotope: {
				instance: {},
				options: {
					itemSelector: '.card-item',
					percentPosition: true,
					layoutMode: 'masonry',
					masonry: {
						gutter: 0
					}
				}
			}
		},
		init: function() {
			this.isotopeInit();
		},
		// isotope:  initialize masonry grid
		isotopeInit: function() {
			this.settings.isotope.instance = this.settings.card_deck.isotope(this.settings.isotope.options);
			this.settings.isotope.instance.imagesLoaded().progress( function() {
				card.settings.isotope.instance.isotope('layout');
			});
		}
	};
	card.init();



	// ===== SEND FOOTER EMAIL
	// ================================================================================

	var email_signup = {
		settings:{
			required: $('form.signup-form'),
			email_address_field: $('form.signup-form [name="user_email"]'),
		},
		init: function(){
			this.bindUiActions();
		},
		bindUiActions: function(){
			this.settings.required.submit(function(){
				if($(this).find('[name="user_email"]').val() != ''){
					email_signup.sendToMailChimp($(this).find('[name="user_email"]').val());
				} else {
					$(this).find('[name="user_email"]').addClass('error');
				}
				return false;
			});
		},
		sendToMailChimp: function(email_address){
			// MailChimp Integration
			$.ajax({
				url: '/wp-content/themes/baileys/library/ajax-functions/send-to-mailchimp.php',
				type: 'POST',
				dataType: 'json',
				data: {'email' : email_address},
				beforeSend: function(){
					email_signup.settings.required.append('<p class="signup-form-status">Please Wait...</p>');
				},
				success: function(data){
					$('.form.email-signup').find('[name="user_email"]').val('');
					$('.signup-form-status').html('You are signed up!');
				}
			});
		}

	}
	email_signup.init();



	// ===== PAGE - HOME
	// ================================================================================

	var pgHome = {
		settings: {
			required_element: $('.pg-home'),
			newsletter_promo: $('.newsletter-promo'),
			newsletter_promo_header: $('.newsletter-promo-header'),
			newsletter_promo_close: $('.newsletter-promo .close'),
			newsletter_promo_form: $('.newsletter-promo form'),
			testimonials: {
				elem: $('.home-testimonials-slider .slider'),
				options: {
					autoplay: true,
					autoplaySpeed: 9000,
					dots: true,
					appendDots: $('.home-testimonials-slider .slider-pager'),
					nextArrow: $('.home-testimonials-slider .ctrl-next'),
					prevArrow: $('.home-testimonials-slider .ctrl-prev'),
				}
			}
		},
		init: function() {
			if(globalHelper.elementExists(this.settings.required_element)) {
				this.bindUIActions();
				this.testimonialsInit();
			}
		},
		bindUIActions: function() {
			this.settings.newsletter_promo_header.on('click', function() {
				this.handleNewsletterPromoDisplay('enable');
			}.bind(this));
			this.settings.newsletter_promo_close.on('click', function() {
				this.handleNewsletterPromoDisplay('disable');
				return false;
			}.bind(this));
			this.settings.newsletter_promo_form.on('submit', function() {
				return this.processNewsletterPromoForm();
			}.bind(this));
		},

		// Manages the display of the Newsletter Promo
		handleNewsletterPromoDisplay: function(action) {
			if((action === 'enable') && !this.settings.newsletter_promo.hasClass('active')) {
				this.settings.newsletter_promo.addClass('active');
			}
			if(action === 'disable') {
				this.settings.newsletter_promo.removeClass('active').addClass('disabled');
			}
		},

		// Process the Newsletter Promo Form
		processNewsletterPromoForm: function() {
			$.ajax({
				url: '/wp-content/themes/baileys/library/ajax-functions/send-to-mailchimp.php',
				type: 'POST',
				dataType: 'json',
				data: this.settings.newsletter_promo_form.serialize(),
				beforeSend: function() {
					pgHome.settings.newsletter_promo.find('.btn').html('Please Wait ...').prop('disabled', 1);
				},
				success: function(data) {
					pgHome.settings.newsletter_promo.find('.intro').html('<br/>Thanks for signing up!<br/><br/>');
					pgHome.settings.newsletter_promo_form.html('');
				}
			});
			return false;
		},

		// Testimonials - Initialize
		testimonialsInit: function() {
			this.settings.testimonials.elem.slick(this.settings.testimonials.options);
		}
	};
	pgHome.init();



	// ===== PAGE - ENAGEMENT RINGS
	// ================================================================================

	var pgEngagement = {
		settings: {
			required_element: $('.pg-engagement'),
			rings: {
				elem: $('.section-designers .rings'),
				options: {
					autoplay: true,
					centerMode: true,
					mobileFirst: true,
					slidesToShow: 1,
					prevArrow: $('.section-designers .slider-ctrl-prev'),
					nextArrow: $('.section-designers .slider-ctrl-next'),
					responsive: [
						{
							breakpoint: 639,
							settings: { slidesToShow: 2 }
						},{
							breakpoint: 959,
							settings: { slidesToShow: 3 }
						},{
							breakpoint: 1279,
							settings: { slidesToShow: 4 }
						}
					]
				}
			},
			social: {
				elem: $('.section-social .gallery'),
				options: {
					mobileFirst: true,
					slidesToShow: 2,
					prevArrow: $('.section-social .slider-ctrl-prev'),
					nextArrow: $('.section-social .slider-ctrl-next'),
					responsive: [
						{
							breakpoint: 639,
							settings: { slidesToShow: 3 }
						},{
							breakpoint: 959,
							settings: { slidesToShow: 4 }
						},{
							breakpoint: 1199,
							settings: { slidesToShow: 5 }
						}
					]
				}
			}
		},
		init: function() {
			if(globalHelper.elementExists(this.settings.required_element)) {
				this.bindUIActions();
				this.sliderInit();
			}
		},
		bindUIActions: function() {
			this.settings.rings.options.prevArrow.on('click', function() {
				this.sliderStopAutoPlay();
			}.bind(this));
			this.settings.rings.options.nextArrow.on('click', function() {
				this.sliderStopAutoPlay();
			}.bind(this));
		},

		// Slider - Initialize
		sliderInit: function() {
			this.settings.rings.elem.slick(this.settings.rings.options);
			this.settings.social.elem.slick(this.settings.social.options);
		},

		// Slider - Stop AutoPlay
		sliderStopAutoPlay: function() {
			this.settings.rings.elem.slick('slickPause');
		}
	};
	pgEngagement.init();



	// ===== PAGE - DESIGNERS W/ IMAGE GALLERIES
	// ================================================================================

	var pgDesignerGallery = {
		settings: {
			required_element: $('.image-gallery-slider'),
			slider: {
				display: {
					elem: $('.image-gallery-slider .display .slider'),
					options: {
						adaptiveHeight: true,
						fade: true,
						asNavFor: '.image-gallery-slider .navigation .slider',
						prevArrow: $('.image-gallery-slider .display .ctrl-prev'),
						nextArrow: $('.image-gallery-slider .display .ctrl-next'),
					}
				},
				nav: {
					elem: $('.image-gallery-slider .navigation .slider'),
					slides: $('.image-gallery-slider .navigation .slide'),
					options: {
						arrows: false,
						centerMode: true,
						focusOnSelect: true,
						mobileFirst: true,
						slidesToShow: 2,
						asNavFor: '.image-gallery-slider .display .slider',
						responsive: [
							{
								breakpoint: 450,
								settings: { slidesToShow: 3 }
							},{
								breakpoint: 640,
								settings: { slidesToShow: 4 }
							},{
								breakpoint: 800,
								settings: { slidesToShow: 5 }
							},{
								breakpoint: 960,
								settings: { slidesToShow: 6 }
							}
						]
					}
				}
			}
		},
		init: function() {
			if(globalHelper.elementExists(this.settings.required_element)) {
				this.sliderInit();
			}
		},

		// Slider - Initialize
		sliderInit: function() {
			this.sliderConfigure();
			this.settings.slider.display.elem.slick(this.settings.slider.display.options);
			this.settings.slider.nav.elem.slick(this.settings.slider.nav.options);
		},

		// Slider - Configure
		sliderConfigure: function() {
			var numSlides = this.settings.slider.nav.slides.length;
			var dataAttr = '';
			for(var i = 0; i < this.settings.slider.nav.options.responsive.length; i++) {
				var bp = this.settings.slider.nav.options.responsive[i].breakpoint;
				var configOriginal = this.settings.slider.nav.options.responsive[i].settings.slidesToShow;
				var configNew = Math.min(numSlides, configOriginal);
				this.settings.slider.nav.options.responsive[i].settings.slidesToShow = configNew;
				dataAttr += '[bp'+bp+':'+configNew+']';
			}
			this.settings.slider.nav.elem.attr('data-config', dataAttr);
		}
	};
	pgDesignerGallery.init();



	// ===== PAGE - LOCATIONS
	// ================================================================================

	var pgLocations = {
		settings: {
			locations: $('.location'),
			locationInfo: $('.location-info')
		},
		init: function() {
			this.bindUIActions();
			this.settings.locations.eq(0).trigger('click');
		},
		bindUIActions: function() {
			this.settings.locations.on('click', function() {
				var el = this;
				pgLocations.expandInfo(el);
				pgLocations.settings.locations.removeClass('location-active');
				$(this).addClass('location-active');
			});
		},
		// Display expanded data depending on what location is clicked on
		expandInfo: function(e) {
			this.settings.locationInfo.css('display', 'none');
			$('.location-info[data-loc="' + e.dataset.button + '"]').show();
		}
	};
	pgLocations.init();



	// ===== PAGE - LOCATIONS - SINGLE
	// ================================================================================

	var pgLocationSingle = {
		settings: {
			testimonials: {
				elem: $('.pg-locations-single .testimonials .slider'),
				options: {
					dots: true,
					appendDots: $('.testimonials .slider-pager'),
					nextArrow: $('.testimonials .ctrl-next'),
					prevArrow: $('.testimonials .ctrl-prev'),
				}
			}
		},
		init: function() {
			if(globalHelper.elementExists(this.settings.testimonials.elem)) {
				this.testimonialsInit();
			}
		},

		// Testimonials - Initialize
		testimonialsInit: function() {
			this.settings.testimonials.elem.slick(this.settings.testimonials.options);
		}
	}
	pgLocationSingle.init();



	// ===== PAGE - LOCATIONS - SINGLE FLAGSHIP
	// ================================================================================

	var pgLocationFlagship = {
		settings: {
			designers: {
				elem: $('.pg-locations-flagship .featured-designers .slider'),
				options: {
					mobileFirst: true,
					slidesToShow: 1,
					prevArrow: $('.ctrl-prev'),
					nextArrow: $('.ctrl-next'),
					responsive: [
						{
							breakpoint: 400,
							settings: { slidesToShow: 2 }
						},{
							breakpoint: 680,
							settings: { slidesToShow: 3 }
						},{
							breakpoint: 1080,
							settings: { slidesToShow: 4 }
						},{
							breakpoint: 1280,
							settings: { slidesToShow: 5 }
						}
					]
				}
			}
		},
		init: function() {
			if(this.settings.designers.elem.length) {
				this.designerInit();
			}
		},

		// Featured Designers - Initialize
		designerInit: function() {
			this.settings.designers.elem.slick(this.settings.designers.options);
		}
	}
	pgLocationFlagship.init();



	// ===== PAGE - CUSTOM JEWELRY DESIGN
	// ================================================================================

	var pgCustomJewelryDesign = {
		settings: {
			required_element: $('.page-id-205'),
			sliderTestimonial: {
				elem: $('.page-id-205 .testimonials .slider'),
				options: {
					adaptiveHeight: true,
					autoplay: true,
					autoplaySpeed: 9000,
					prevArrow: $('.page-id-205 .testimonials .prev'),
					nextArrow: $('.page-id-205 .testimonials .next')
				}
			},
			sliderClientTestimonials: {
				elem: $('.page-id-205 .client-testimonials .slider'),
				options: {
					adaptiveHeight: true,
					prevArrow: $('.page-id-205 .client-testimonials .prev'),
					nextArrow: $('.page-id-205 .client-testimonials .next')
				}
			},
			sliderCustomWork: {
				elem: $('.custom-work-slider .slider'),
				options: {
					autoplay: true,
					autoplaySpeed: 5000,
					mobileFirst: true,
					slidesToShow: 1,
					speed: 800,
					prevArrow: $('.custom-work-slider .prev'),
					nextArrow: $('.custom-work-slider .next'),
					responsive: [
						{
							breakpoint: 640,
							settings: { slidesToShow: 3 }
						}
					]
				}
			},
		},
		init: function() {
			if(globalHelper.elementExists(this.settings.required_element)) {
				this.bindUIActions();
				this.sliderInit();
			}
		},
		bindUIActions: function() {
			this.settings.sliderTestimonial.options.prevArrow.on('click', function() {
				this.sliderStopAutoPlay(this.settings.sliderTestimonial.elem);
			}.bind(this));
			this.settings.sliderTestimonial.options.nextArrow.on('click', function() {
				this.sliderStopAutoPlay(this.settings.sliderTestimonial.elem);
			}.bind(this));
			this.settings.sliderCustomWork.options.prevArrow.on('click', function() {
				this.sliderStopAutoPlay(this.settings.sliderCustomWork.elem);
			}.bind(this));
			this.settings.sliderCustomWork.options.nextArrow.on('click', function() {
				this.sliderStopAutoPlay(this.settings.sliderCustomWork.elem);
			}.bind(this));
		},

		// Slider - Initialize
		sliderInit: function() {
			this.settings.sliderTestimonial.elem.slick(this.settings.sliderTestimonial.options);
			this.settings.sliderClientTestimonials.elem.slick(this.settings.sliderClientTestimonials.options);
			this.settings.sliderCustomWork.elem.slick(this.settings.sliderCustomWork.options);
		},

		// Slider - Stop AutoPlay
		sliderStopAutoPlay: function(elem) {
			elem.slick('slickPause');
		}
	}
	pgCustomJewelryDesign.init();



	// ===== PAGE - CUSTOM RING DESIGN
	// ================================================================================

	var pgCustomRingDesign = {
		settings: {
			required_element: $('.page-id-1673'),
			slider: {
				elem: $('.custom-work-slider .slider'),
				options: {
					autoplay: true,
					autoplaySpeed: 5000,
					mobileFirst: true,
					slidesToShow: 1,
					speed: 800,
					prevArrow: $('.custom-work-slider .prev'),
					nextArrow: $('.custom-work-slider .next'),
					responsive: [
						{
							breakpoint: 640,
							settings: { slidesToShow: 3 }
						}
					]
				}
			}
		},
		init: function() {
			if(globalHelper.elementExists(this.settings.required_element)) {
				this.bindUIActions();
				this.sliderInit();
			}
		},
		bindUIActions: function() {
			this.settings.slider.options.prevArrow.on('click', function() {
				this.sliderStopAutoPlay();
			}.bind(this));
			this.settings.slider.options.nextArrow.on('click', function() {
				this.sliderStopAutoPlay();
			}.bind(this));
		},

		// Slider - Initialize
		sliderInit: function() {
			this.settings.slider.elem.slick(this.settings.slider.options);
		},

		// Slider - Stop AutoPlay
		sliderStopAutoPlay: function() {
			this.settings.slider.elem.slick('slickPause');
		}
	}
	pgCustomRingDesign.init();



	// ===== PAGE - PRODUCT CATEGORY
	// ================================================================================

	var pgProductCategory = {
		settings: {
			required_element: $('.pg-product-category'),
			layered_nav: $('.layered-nav'),
			layered_nav_trigger: $('.layered-nav-trigger'),
			layered_nav_opts_filter_title: $('.layered-nav-options .filter-title'), //filter-group active',
			floating_promo: $('.floating-promo .icon-close'),
		},
		init: function() {
			if(globalHelper.elementExists(this.settings.required_element)) {
				this.bindUIActions();
			}
		},
		bindUIActions: function() {
			this.settings.layered_nav_trigger.on('touchstart click', function(e) {
				e.preventDefault(); // prevent double-firing on touch
				pgProductCategory.toggleLayeredNav();
			});
			this.settings.layered_nav_opts_filter_title.on('click', function() {
				pgProductCategory.toggleFilterGroup($(this));
			});
			if (this.settings.floating_promo.length) {
				this.settings.floating_promo.on('click', function() {
					$('.floating-promo').remove();
					return false;
				});
			}
		},

		// Toggle the display of the layered navigation menu
		toggleLayeredNav: function() {
			this.settings.layered_nav.toggleClass('active');
		},

		// Toggle the display of the given layered navigation filter option
		toggleFilterGroup: function(elem) {
			elem.parent('.filter-group').toggleClass('active');
		}
	};
	pgProductCategory.init();



	// ===== CHECKOUT
	// ================================================================================

	var pgCheckout = {
		settings: {
			required_element: $('.opc-checkout'),
			active_step: {},
			timer: {},
		},
		init: function() {
			if(globalHelper.elementExists(this.settings.required_element)) {
				this.bindUIActions();
				// Listen for the next step of the checkout process to be triggered.
				// If that next step is our of view, then scroll the viewport to the next step.
				this.nextStepListener();
			}
		},
		bindUIActions: function() {},

		// Some steps of the checkout process are dynamically loaded.  As such, the uniform styling (specifically
		// <select> menus and checkboxes) isn't being applied.  This function looks for the presence of non-uniform
		// elements at certain steps, and attempt to "uniform" them until the styling takes.
		uniformListener: function() {
			clearTimeout(this.settings.timer);
			var elem = null;
			var not_uniform = false;
			switch(this.settings.active_step.attr('id')) {
				// Checkout Step - Login
				case 'opc-login':
					elem = this.settings.active_step.find('input[type="radio"]').eq(0);
					if((elem.length > 0) && (elem.parents('div.radio').length <= 0)) {
						not_uniform = true;
					}
					break;
				// Checkout Step - Shipping Method
				case 'opc-shipping_method':
					elem = this.settings.active_step.find('input[type="radio"]').eq(0);
					if((elem.length > 0) && (elem.parents('div.radio').length <= 0)) {
						not_uniform = true;
					}
					break;
				// Checkout Step - Payment Method
				case 'opc-payment':
					elem = this.settings.active_step.find('select').eq(0);
					if((elem.length > 0) && (elem.parent('.selector').length <= 0)) {
						not_uniform = true;
					}
					break;
				// Checkout Step - Order Review
				case 'opc-review':
					elem = this.settings.active_step.find('input[type="checkbox"]').eq(0);
					if((elem.length > 0) && (elem.parents('div.checker').length <= 0)) {
						not_uniform = true;
					}
					break;
			}
			// If "un-uniformed" elements found, then attempt to correct
			if(not_uniform) {
				contactForm.uniformInit();
				this.settings.timer = setTimeout(function() {
					pgCheckout.uniformListener();
				}, 500);
			}
		},

		// Listens for the next step of the checkout process to be triggered.
		// Checkout steps progress after an AJAX call by the system.  In actuality, there are two AJAX calls:
		//   1) A "post" request to send information to the system (e.g. billing address information)
		//   2) A "get" request that updates the checkout progress area
		// Listening for the completion of that "post" request should suffice for our needs.
		nextStepListener: function() {
			if(Ajax.Responders) {
				Ajax.Responders.register({
					onComplete: function(response) {
						if(response.method == 'post') {
							pgCheckout.getActiveStep();
							pgCheckout.scrollToNextStep();
							// Trigger a page view for checkout goal tracking / funneling
							var opc_path = pgCheckout.settings.active_step.attr('id').replace('opc-', '');
							gtag('config', 'UA-34284772-1', {
							  'page_path': '/store/checkout/onepage/'+opc_path+'/'
							});
						}
						pgCheckout.uniformListener();
					}
				});
			}
		},

		// Records the current active step of the checkout process
		getActiveStep: function() {
			this.settings.active_step = $('#checkoutSteps .section.active');
		},

		// Scrolls to the next step of the checkout process if that step is out of view
		scrollToNextStep: function() {
			if(!globalHelper.isElementInViewport(this.settings.active_step)) {
				globalHelper.scrollTo(this.settings.active_step, 500);
			}
		}
	};
	pgCheckout.init();



	// ===== RESPONSIVE JAVASCRIPT MANAGEMENT
	// ================================================================================

	var jRes = new jRespond([
		{ label: '4col', enter: bp.col4.min, exit: bp.col4.max },
		{ label: '8col', enter: bp.col8.min, exit: bp.col8.max },
		{ label: '12col', enter: bp.col12.min, exit: bp.col12.max },
		{ label: '16col', enter: bp.col16.min, exit: bp.col16.max }
	]);

	jRes.addFunc([
		{
			breakpoint: "*",
			enter: function() { },
			exit: function() { }
		},{
			breakpoint: ['4col','8col'],
			enter: function() {
				header.toggleSuperFish('destroy');
			},
			exit: function() { }
		},{
			breakpoint: ['12col','16col'],
			enter: function() {
				header.toggleSuperFish('setup');
			},
			exit: function() { }
		},{
			breakpoint: '4col',
			enter: function() { },
			exit: function() { }
		},{
			breakpoint: '8col',
			enter: function() { },
			exit: function() { }
		},{
			breakpoint: '12col',
			enter: function() { },
			exit: function() { }
		},{
			breakpoint: '16col',
			enter: function() { },
			exit: function() { }
		}
	]);


}(this, this.document, this.jQuery, this.jRespond));
