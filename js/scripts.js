//=require libs/jquery.fancybox.v2.js // Fancybox - Lightbox Solution
//=require libs/jquery-parallax.1.3.1.js // Parallax for Single Grip Page
//=require libs/jquery.uniform.js // Uniform JS - Uniforming Form Elements to look pretty
//=require libs/jquery.hoverIntent.1.8.1.js // HoverIntent
//=require libs/jquery.bxslider.4.2.5.js // BxSlider - Carousel Solution
//=require libs/lazysizes.1.0.0.js // Lazy Load Content, http://afarkas.github.io/lazysizes/
//=require libs/ls.unveilhooks.2.0.0.js // Extension of LazySizes https://github.com/aFarkas/lazysizes/tree/gh-pages/plugins/unveilhooks
//=require libs/jRespond.0.1.js // Responsive JS solution
//=require libs/pc.previous.site.1.js // Old-Scripts File from v1 site


// Prevent conflicts between jQuery and other javascript libraries
jQuery.noConflict();

(function(window, document, $, jRespond) {

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
		isElementInViewport:  function(e) {
			var vals = {
				eTop: e.offset().top,
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
			empty_p: $('p:empty')
		},
		init: function() {
			this.removeEmptyPTags();
			this.setupLazyLoadOptions();
		},

		// Removes empty <p> tags from the page
		removeEmptyPTags: function() {
			this.settings.empty_p.remove();
		},
		setupLazyLoadOptions: function(){
			// Setup Lazy Load Options to force download of elements after initial window.load
			window.lazySizesConfig.preloadAfterLoad = true;
		}
	};
	globalFeatures.init();


	// ===== HEADER - NAVIGATION
	// ================================================================================

	var header = {

		settings: {
			header: $('.header'),
			overlay: $('.header-overlay'),
			hamburger: $('.header .hamburger'),
			menu: $('.header .nav'),
			parent_menus: $('#menu-primary-navigation .menu-item-has-children'),
			parent_menu_links: $('#menu-primary-navigation .menu-item-has-children > a'),
		},

		init: function() {
			this.bindUIActions();
			this.addSubMenuArrows();
		},

		bindUIActions: function() {
			// On clicking the hamburger
			this.settings.hamburger.on('click', header.toggleMobileMenu);
			// On clicking the overlay
			this.settings.overlay.on('click', header.closeAllMenus);
		},

		// Add submenu arrows to first level parents
		addSubMenuArrows: function() {
			var arrow = '<div class="arrow"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10.44 16.59"><path d="M0,14.44l2.15,2.15,8.29-8.3L2.15,0,0,2.15,6.15,8.29Z"/></svg></div>';

			header.settings.parent_menu_links.each(function() {
				$(this).after(arrow);
			});

			$('#menu-primary-navigation .arrow').on('click', header.toggleMobileSubMenus);
		},

		// Use arrows to toggle submenus open/close
		toggleMobileSubMenus: function() {
			if ($(window).width() >= 960) {
				if ($(this).closest('.menu-item-has-children').hasClass('sub-menu-open')) {
					$(this).closest('.menu-item-has-children').removeClass('sub-menu-open');
					header.settings.overlay.removeClass('active');
				} else {
					header.settings.parent_menus.removeClass('sub-menu-open');
					$(this).closest('.menu-item-has-children').addClass('sub-menu-open');
					header.settings.overlay.addClass('active');
				}
			} else {
				$(this).closest('.menu-item-has-children').toggleClass('sub-menu-open');
			}
		},

		// Toggle mobile menu open/close
		toggleMobileMenu: function() {
			if(!header.settings.menu.hasClass('open')) {
				header.settings.menu.addClass('open');
				header.settings.overlay.addClass('active');
			} else {
				header.settings.menu.removeClass('open');
				header.settings.overlay.removeClass('active');

				// Then close all sub-menus
				setTimeout(function() {
					$('#menu-primary-navigation .sub-menu-open').removeClass('sub-menu-open');
				}, 500);
			}
		},

		closeAllMenus: function() {
			header.settings.menu.removeClass('open');
			header.settings.parent_menus.removeClass('sub-menu-open');
			header.settings.overlay.removeClass('active');
		}
	}
	header.init();


	// ===== ACCORDIONS - GENERIC
	// ================================================================================
	var accordionContent = {
		settings: {
			accordion_trigger: $('.accordion-trigger'),
			accordion_container: $('.accordion-container')
		},
		init: function(){
			if(globalHelper.elementExists(this.settings.accordion_trigger)){
				this.bindUIActions();
			}
		},
		bindUIActions: function(){
			this.settings.accordion_trigger.on('click', function(){
				accordionContent.toggleAccordion($(this));
				return false;
			});
		},
		toggleAccordion: function($elem){
			if(!$elem.hasClass('active')){
				$elem.addClass('active');
				this.settings.accordion_container.addClass('active');
			} else {
				$elem.removeClass('active');
				this.settings.accordion_container.removeClass('active');
			}
		},
		closeAccordion: function(){
			this.settings.accordion_trigger.removeClass('active');
			this.settings.accordion_container.removeClass('active');
		}
	};
	accordionContent.init();

	// ===== SINGLE PRODUCT PAGE
	// ================================================================================
	var pageSingleProduct = {
		settings: {
			req_elem: $('.individual-product'),
			// Product Image Gallery
			main_product_image: $('.main-product-image'),
			product_gallery: $('.gallery-pager-list'),
			gallery_pager_item: $('.gallery-pager-item'),
			// Product tabbed content
			tabbed_trigger: $('.individual-product [class*="tabbed-trigger"]'),
			tabbed_container: $('.individual-product [class*="tabbed-content"]')
		},
		init: function(){
			if(globalHelper.elementExists(this.settings.req_elem)){
				this.bindUIActions();
				this.bxSliderInit();
				this.openFirstContainer();
			}
		},
		bindUIActions: function(){
			// Image Gallery Thumbnail
			this.settings.gallery_pager_item.on('click', function(){
				pageSingleProduct.swapGalleryImage($(this));
			});
			// Tabbed Content
			this.settings.tabbed_trigger.on('click', function(){
				pageSingleProduct.tabControls($(this));
				// pageSingleProduct.closeContent($(this));
				// pageSingleProduct.toggleContent($(this));
				return false;
			});
		},
		// Our Product Gallery Image Set
		bxSliderInit: function(){
			this.settings.product_gallery.bxSlider({
				controls: false,
				maxSlides: 5,
				pager: false,
				slideMargin: 15,
				slideWidth: 60,
				touchEnabled: (navigator.maxTouchPoints > 0),
			});
		},
		swapGalleryImage: function($elem){
			// Keep our container Height before we swap images.
			var current_height = this.settings.main_product_image.outerHeight(),
			current_width = this.settings.main_product_image.outerWidth();
			this.settings.main_product_image.css({
				'min-height': current_height,
				'min-width': current_width
			})
			var needed_src = $elem.find('img').data('fullSizeSrc');
			this.settings.main_product_image.find('img').animate({
				opacity: 0
			}, 300, function(){
				$(this).attr('src', needed_src);
				$(this).delay(600).animate({'opacity': 1});
			});

			this.settings.main_product_image.css({
				'min-height': '100%',
				'min-width': '100%'
			})

		},
		// Tabbed Content Lovin'
		/* toggleContent: function($elem){
			this.settings.tabbed_trigger.removeClass('active');
			$elem.addClass('active')
			var container = $elem.data('tabbedTrigger');
			this.settings.tabbed_container.filter('[data-tabbed-content="'+container+'"]').addClass('active');
		}, */
		openFirstContainer: function(){
			$('.desktop-tabbed-trigger:first').trigger('click');
		},
		/* closeContent: function(){
			this.settings.tabbed_trigger.removeClass('active');
			this.settings.tabbed_container.removeClass('active');
		}, */
		tabControls: function($elem){
			if (!($elem.hasClass('active'))) {
				this.settings.tabbed_trigger.removeClass('active');
				this.settings.tabbed_container.removeClass('active');
				$elem.addClass('active');
				var container = $elem.data('tabbedTrigger');
				this.settings.tabbed_container.filter('[data-tabbed-content="'+container+'"]').addClass('active');
			}
			else {
				this.settings.tabbed_trigger.removeClass('active');
				this.settings.tabbed_container.removeClass('active');
			}
		}
	};
	pageSingleProduct.init();


	// ===== PAGE - HOME
	// ================================================================================
  var pageHome = {
    settings: {
      youtube_link: $('.youTube-link'),
      youtube_link_fcy_opts: {
        maxWidth	: 800,
        maxHeight	: 600,
        fitToView	: false,
        width : '70%',
        height : '70%',
        autoSize	: false,
        closeClick : false,
        openEffect : 'none',
        closeEffect : 'none'
      },
			bxSlider: {
				instance: {},
				opts: {
					auto: true,
					pager: true,
					pause: 4500,
					touchEnabled: false
				}
			},
			// Tabbed / Accordion
			accordion_trigger: $('.accordion-trigger'),
    },
    init: function(){
      if(globalHelper.elementExists(this.settings.youtube_link)){
				this.bxSliderInit();
				this.bindUIActions();
      }
    },
		bindUIActions: function() {
			this.settings.accordion_trigger.on('click', function(){
				if(Modernizr.mq('(max-width: '+bp.col4.max+'px)')){
					pageHome.toggleAccordion($(this));
				}
			});
			$('body').on('touchstart click', '.bx-pager-item', function(){
				pageHome.settings.bxSlider.instance.stopAuto();
			});
		},
		bxSliderInit: function(){
			this.settings.bxSlider.instance = $('.featured_well').bxSlider(this.settings.bxSlider.opts);
		},
    fncyInit: function(){
			this.settings.youtube_link.fancybox(this.settings.youtube_link_fcy_opts);
    },
		toggleAccordion: function($elem){

			if($elem.parent().hasClass('open-accordion')){
				$elem.parent().removeClass('open-accordion');
			} else {
				$elem.parent().addClass('open-accordion');
			}
		},
		closeAccordion: function(){
			// something we can call on the 12+ column to close any open accordions
			$('.accordion-list-item').removeClass('open-accordion');
		}
  };
	pageHome.init();

	// ===== FOOTER STUFF
	// ================================================================================
	var footerContainer = {
		settings: {
			// 4/8 column anchors to expand footer columns
			footer_title: $('.footer-title')
		},
		init: function() {
			this.bindUIActions();
			this.openFindUsOnMobile();
			this.removeClickToFax();
		},
		bindUIActions: function() {
			this.settings.footer_title.on('click', function(){
				if(Modernizr.mq('(max-width: '+bp.col8.max+'px)')){
					footerContainer.toggleAccordion($(this));
				}
			});
		},
		toggleAccordion: function($elem){
			if($elem.parent('.footer-column').hasClass('open')){
				$elem.parent('.footer-column').removeClass('open');
			} else {
				$elem.parent('.footer-column').addClass('open');
			}
		},
		closeAccordion: function(){
			// something we can call on the 12+ column to close any open accordions
			$('.footer-column').removeClass('open');
		},
		openFindUsOnMobile: function(){
			this.settings.footer_title.filter(':last').trigger('click');
		},
		// this does not work....
		removeClickToFax: function(){
			$('[itemprop="faxNumber"] > a').off('click');
		}

	};
	footerContainer.init();


	// ===== DEALER SECTIONS
	// ================================================================================
	var dealerPages = {
		settings: {
			reg_elem: $('.dealer-selection-form'),
			dealer_parent_region_select: $('.active-step select')
		},
		init: function() {
			this.bindUIActions();
		},
		bindUIActions: function() {
			if(globalHelper.elementExists(this.settings.reg_elem)){
				this.settings.dealer_parent_region_select.on('change', function(){
					dealerPages.sendUserToContinent($(this));
					return false;
				});
			}
		},
		sendUserToContinent: function($elem){
			if($elem.val() !== ''){
				// sending a user via js is not the sexiest, but the design asked for it!!
				window.location.href = $elem.val();
			}
		}

	};
	dealerPages.init();



	// ===== CONTACT FORMS
	// ================================================================================

	var contactForm = {
		settings: {
			input: $('.form-label-inline .input-txt'),
			select: 'select' // Note: string vs. selector. String required for styling <select> in checkout > payment
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
				$(this.settings.select).uniform({
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


	// ===== PAGE: HOW-TI VIDEOS
	// ================================================================================

	var pageHowTo = {
		settings: {
			body_tag: $('body'),
			toggle_transcript: $('.toggle-transcript')
		},
		init: function() {
			if(globalHelper.elementExists(this.settings.toggle_transcript)){
				this.bindUIActions();
			}
		},
		bindUIActions: function() {
			this.settings.toggle_transcript.on('click', function(){
				pageHowTo.settings.body_tag.toggleClass('show-transcript');
			});
		},
	};
	pageHowTo.init();



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
			breakpoint: '*',
			enter: function() {
			},
			exit: function() {

			}
		},{
			breakpoint: ['4col','8col'],
			enter: function() { },
			exit: function() { }
		},{
			breakpoint: ['12col','16col'],
			enter: function() {
				footerContainer.closeAccordion();
			},
			exit: function() {
				footerContainer.openFindUsOnMobile();
			}
		},{
			breakpoint: '4col',
			enter: function() {
			},
			exit: function() {
				if(globalHelper.elementExists(pageHome.settings.accordion_trigger)){
					pageHome.closeAccordion();
				}
			}
		},{
			breakpoint: '8col',
			enter: function() {

			},
			exit: function() { }
		},{
			breakpoint: '12col',
			enter: function() {

			},
			exit: function() { }
		},{
			breakpoint: '16col',
			enter: function() {
			},
			exit: function() {
			}
		}
	]);

	// Alert Banner Script
	$('.alert-close').click(function() {
		$('.alert-container').slideUp(200);
		document.cookie = "alert=dismissed";
		console.log('click');
	});
	console.log(document.cookie);

}(this, this.document, this.jQuery, this.jRespond));

// ===== FOOTER TESTIMONIAL SLIDER
// ================================================================================
jQuery(window).load(function() {
	jQuery('.footer-slider').bxSlider({
		auto: true,
		pager: true,
		pause: 4500,
		touchEnabled: false
	});
});
