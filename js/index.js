gsap.registerPlugin(ScrollTrigger, SplitText);

let scroll;
let transitionOffset = 825;
var themeSwitchLight = $('main').data('theme-page-light');
var themeSwitchDark = $('main').data('theme-page-dark');
let audioStatus = false;

initPageTransitions();

// Animation - Page Loader
function initLoader() { 

   var tl = gsap.timeline();

   tl.set(".loading-screen", { 
      backgroundColor: "rgb(" + themeSwitchDark + ")"
   });

   tl.to(".loading-screen", { 
      autoAlpha: 0,
      duration: 0.25,
      ease: "Power1.easeOut",
      delay: 0.25,
   });

   tl.call(function() {
      scroll.stop();
   }, null, 0);

   tl.call(function() {
      pageTransitionOut();
   }, null, 0);

}

// Animation - Page Leave
function pageTransitionIn() {
	var tl = gsap.timeline();
   var circleLength = document.querySelector('.floating-elements svg circle').getTotalLength();

   tl.set(".loading-screen", { 
      autoAlpha: 0,
   });

   tl.set(".floating-elements svg circle", { 
      strokeDashoffset: circleLength * 3,
      strokeDasharray: circleLength + 2,
      opacity: 1,
   });

   tl.set(".floating-elements svg", { 
      rotate: 0,
      opacity: 1
   });

   tl.to("main", { 
      opacity: 0,
      filter: "blur(5px)",
      duration: 0.8,
      ease: "Power1.easeIn"
   });

   tl.to(".loading-screen", { 
      autoAlpha: 1,
      duration: 0.8,
      ease: "Power1.easeIn",
      backgroundColor: "rgb(" + themeSwitchDark + ")"
   }, "<");

   tl.to(".floating-elements svg circle", { 
      autoAlpha: 1,
      duration: 0.8,
      ease: "Power1.easeIn",
      stroke: "rgb(" + themeSwitchLight + ")",
   }, "<");

   tl.to(".floating-elements svg", { 
      rotate: 360,
      duration: 3.4,
      ease: "none",
   }, "<");

   tl.to(".floating-elements svg circle", { 
      autoAlpha: 1,
      duration: 1.7,
      ease: "Power1.easeIn",
      strokeDashoffset: circleLength * 2
   }, "<");

   tl.to(".loading-screen", { 
      autoAlpha: 0,
      duration: 0.25,
      ease: "Power1.easeOut",
      delay: 0.025
   }, "< 0.8");

   tl.to(".floating-elements svg circle", { 
      autoAlpha: 1,
      duration: 1.7,
      ease: "Power1.easeOut",
      strokeDashoffset: circleLength * 1
   }, "<");

   tl.to(".floating-elements svg", { 
      duration: 0.01,
      opacity: 0,
      ease: "none"
   }, "< 1.55");

   tl.call(function() {
      scroll.stop();
      audioWhoosh();
   }, null, 0);
   
}

// Animation - Page Enter
function pageTransitionOut() {
	var tl = gsap.timeline();

   tl.set("main", { 
      filter: "blur(5px)",
      opacity: 0
   });

   tl.set(".single-char", { 
      yPercent: 100,
      filter: "blur(5px)",
      opacity: 0
   });

   tl.set(".header-visuals", { 
      filter: "blur(50px)",
      scale: 1.2,
      opacity: 0
   });

   if(document.querySelector('.parallax-layers')) {
      tl.set(".parallax-layers", { 
         opacity: 0
      });
   }

   if(document.querySelector('.after-blur')) {
      tl.set(".after-blur", { 
         opacity: 0,
         filter: "blur(5px)",
      });
   }

   tl.to("main", { 
      opacity: 1,
      filter: "blur(0px)",
      duration: 2,
      ease: "Expo.easeOut",
      delay: 0.5
   });

   tl.to(".header-visuals", { 
      opacity: 1,
      filter: "blur(0px)",
      duration: 3,
      scale: 1,
      ease: "Expo.easeOut",
   },"<");

   tl.to(".single-char", { 
      opacity: 1,
      yPercent: 0,
      duration: 2,
      ease: "Expo.easeOut",
      stagger: 0.04,
   },"< 0.5");

   tl.to(".single-char", { 
      duration: 1.5,
      ease: "Expo.easeOut",
      stagger: 0.04,
      filter: "blur(0px)"
   },"< 0.25");

   if(document.querySelector('.parallax-layers')) {
      tl.to(".parallax-layers", { 
         opacity: 1,
         duration: 0.5,
         ease: "Expo.easeOut",
      },"< 1.5");
   }

   if(document.querySelector('.after-blur')) {
      tl.to(".after-blur", { 
         duration: 1.5,
         ease: "Expo.easeOut",
         stagger: 0.04,
         filter: "blur(0px)",
         opacity: 1
      },"< 1");
   }
  
   tl.call(function() {
      $('body').css({"--color-dark-rgb":  themeSwitchDark, "--color-dark": "rgba(var(--color-dark-rgb), 1)", "--color-light-rgb":  themeSwitchLight, "--color-light": "rgba(var(--color-light-rgb), 1)"});
   }, null, 0);

   tl.call(function() {
      scroll.stop();
   }, null, 0);

   tl.call(function() {
      scroll.start();
   }, null, 2.75);


}

function initPageTransitions() {

   barba.hooks.after(() => {
      scroll.init();
   });

   barba.hooks.enter(() => {
      scroll.destroy();
   });

   barba.hooks.afterEnter(() => {
      window.scrollTo(0, 0);
      ScrollTrigger.refresh();
   });
   
   // Functions Before
   function initResetDataBefore() {
      $('[data-navigation-status]').attr('data-navigation-status', 'not-active');
      $('[data-cursor-bubble]').attr('data-cursor-bubble', 'not-active');
   }

   // Functions After
   function initResetDataAfter() {
      $('[data-navigation-status]').attr('data-navigation-status', 'not-active');
      $('[data-scrolling-direction]').attr('data-scrolling-direction', 'down');
      $('[data-scrolling-started]').attr('data-scrolling-started', 'false');
      $('[data-cursor-bubble]').attr('data-cursor-bubble', 'not-active');
      $('[data-cursor-init]').attr('data-cursor-init', 'false');
   }


   barba.init({
      sync: true,
      debug: false,
      timeout:7000,
      transitions: [{
         name: 'self',
         async leave(data) {
            pageTransitionIn(data.current);
            initResetDataBefore();
            await delay(transitionOffset);
            initResetDataAfter();
            data.current.container.remove();
         },
         async enter(data) {
            pageTransitionOut(data.next);
         },
         async beforeEnter(data) {
            ScrollTrigger.getAll().forEach(t => t.kill());
            initSmoothScroll(data.next.container);
            initScript(); 
            themeSwitchLight = $(data.next.container).data('theme-page-light');
            themeSwitchDark = $(data.next.container).data('theme-page-dark');
         },
      },{
         name: 'default',
         once(data) {
            initSmoothScroll(data.next.container);
            initScript();
            initLoader();
         },
         async leave(data) {
            pageTransitionIn(data.current);
            initResetDataBefore();
            await delay(transitionOffset);
            initResetDataAfter();
            data.current.container.remove();
         },
         async enter(data) {
            pageTransitionOut(data.next);
         },
         async beforeEnter(data) {
            ScrollTrigger.getAll().forEach(t => t.kill());
            initSmoothScroll(data.next.container);
            initScript(); 
            themeSwitchLight = $(data.next.container).data('theme-page-light');
            themeSwitchDark = $(data.next.container).data('theme-page-dark');
         },
      }]
   });

   function initSmoothScroll(container) {

      // https://github.com/quentinhocde/loconative-scroll
      scroll = new LoconativeScroll({
         el: container.querySelector('[data-scroll-container]'),
         scrollToEasing: (t) => (t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2),
         smooth: true,
         duration: 1,
         smartphone: {
            smooth: true,
            duration: 0.5,
         },
         tablet: {
            smooth: true
         },
      });
      
      ScrollTrigger.refresh();
   }  
}  

// Don't touch
function delay(n) {
	n = n || 2000;
	return new Promise((done) => {
		setTimeout(() => {
			done();
		}, n);
	});
}

/**
 * Fire all scripts on page load
 */
function initScript() {
   initCheckWindowHeight();
   initBasicFunctions();
   initLazyLoad();
   initScrollTriggerPlayVideoInview();
   // initScrollToAnchorLoco();
   initSplitText();
   initMagneticButtons();
   initCustomCursorV2();
   initInterfaceSounds();
   initMarqueeScroll();
}

/**
 * Window Inner Height Check
 */
function initCheckWindowHeight() {
   // https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
   let vh = window.innerHeight * 0.01;
   document.documentElement.style.setProperty('--vh', `${vh}px`);
}

/**
 * Basic Functions
 */
function initBasicFunctions() {
   
   // Toggle Navigation
   $('[data-navigation-toggle="toggle"]').click(function(){
      if ($('[data-navigation-status]').attr('data-navigation-status') == 'not-active') {
         $('[data-navigation-status]').attr('data-navigation-status', 'active');
         scroll.stop();
      } else {
         $('[data-navigation-status]').attr('data-navigation-status', 'not-active');
         scroll.start();
      }
   });
   
   // Close Navigation
   $('[data-navigation-toggle="close"]').click(function(){
      $('[data-navigation-status]').attr('data-navigation-status', 'not-active');
      scroll.start();
   });

   // Key ESC - Close Navigation
   $(document).keydown(function(e){
      if(e.keyCode == 27) {
         if ($('[data-navigation-status]').attr('data-navigation-status') == 'active') {
            $('[data-navigation-status]').attr('data-navigation-status', 'not-active');
            scroll.start();
         } 
      }
   });

   $('[data-theme-switch-light]').on('click', function() {
      themeSwitchLight = $(this).attr('data-theme-switch-light');
      themeSwitchDark = $(this).attr('data-theme-switch-dark');
   });
}

/**
 * Lazy Load
 */
function initLazyLoad() {
   // https://github.com/verlok/vanilla-lazyload
   var lazyLoadInstance = new LazyLoad({ 
      container: document.querySelector('[data-scroll-container]'),
      elements_selector: ".lazy",
   });
}

/**
 * Play Video Inview
 */
function initScrollTriggerPlayVideoInview() {

   let allVideoDivs = gsap.utils.toArray('.playpauze');

   allVideoDivs.forEach((videoDiv, i) => {

      let videoElem = videoDiv.querySelector('video')

      ScrollTrigger.create({
         scroller: document.querySelector('[data-scroll-container]'),
         trigger: videoElem,
         start: '0% 120%',
         end: '100% -20%',
         onEnter: () => videoElem.play(),
         onEnterBack: () => videoElem.play(),
         onLeave: () => videoElem.pause(),
         onLeaveBack: () => videoElem.pause(),
      });
   });
}

/**
 * Locomotive - ScrollTo Anchor Links
 */
function initScrollToAnchorLoco() {

   $("[data-anchor-target]").click(function() {

      let targetScrollToAnchorLoco = $(this).attr('data-anchor-target');
      scroll.scrollTo(targetScrollToAnchorLoco,{
         duration: 1.5
      });

   });
}

/**
* GSAP Split Text
*/
function initSplitText() {

   var splitTextWords = new SplitText(".split-words", {type: "words, chars", charsClass: "single-char", wordsClass: "single-word"});
 
}

/**
* Magnetic Buttons
*/
function initMagneticButtons() {
    
   // Magnetic Buttons
   // Found via: https://codepen.io/tdesero/pen/RmoxQg
   var magnets = document.querySelectorAll('[data-magnetic-target]');
   
   if(window.innerWidth > 1024){

      // Mouse Reset
      magnets.forEach((magnet) => {
         magnet.addEventListener('mousemove', moveMagnet );
         $(this.parentNode).removeClass('not-active');
         magnet.addEventListener('mouseleave', function(event) {
            gsap.to( event.currentTarget, 2, {
               x: 0, 
               y: 0, 
               ease: Elastic.easeOut
            });
            gsap.to($(this).find('[data-magnetic-target-inner]'), 2, {
               x: 0, 
               y: 0, 
               ease: Elastic.easeOut
            });
         });
      });

      // Mouse Move
      function moveMagnet(event) {
         var magnetButton = event.currentTarget;
         var bounding = magnetButton.getBoundingClientRect();
         var magnetsStrength = magnetButton.getAttribute("data-magnetic-strength");
         var magnetsStrengthInner = magnetButton.getAttribute("data-magnetic-strength-inner");
         
         gsap.to(magnetButton, 2, {
            x: ((( event.clientX - bounding.left)/magnetButton.offsetWidth) - 0.5) * magnetsStrength,
            y: ((( event.clientY - bounding.top)/magnetButton.offsetHeight) - 0.5) * magnetsStrength,
            rotate: "0.001deg",
            ease: Power4.easeOut
         });
         gsap.to($(this).find('[data-magnetic-target-inner]'), 2, {
            x: ((( event.clientX - bounding.left)/magnetButton.offsetWidth) - 0.5) * magnetsStrengthInner,
            y: ((( event.clientY - bounding.top)/magnetButton.offsetHeight) - 0.5) * magnetsStrengthInner,
            rotate: "0.001deg",
            ease: Power4.easeOut
         });
      }
   }
}

/**
* Custom Cursor
*/
function initCustomCursorV2() {

   const cursorObject = document.querySelector(".custom-cursor");
   const cursorPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
   const mousePos = { x: cursorPos.x, y: cursorPos.y};

   var cursorMoveSpeed = 0.15;
   var cursorSpeed = cursorMoveSpeed;
   var cursorActive = false;

   const xCursorSet = gsap.quickSetter(cursorObject, "x", "px");
   const yCursorSet = gsap.quickSetter(cursorObject, "y", "px");

   window.addEventListener("mousemove", e => {    
      mousePos.x = e.x;
      mousePos.y = e.y;  
   });
   
   gsap.ticker.add(customCursor);
   
   function customCursor(){
      if(!cursorActive){
         const dt = 1.0 - Math.pow(1.0 - cursorSpeed, gsap.ticker.deltaRatio()); 
         cursorPos.x += (mousePos.x - cursorPos.x) * dt;
         cursorPos.y += (mousePos.y - cursorPos.y) * dt;
         xCursorSet(cursorPos.x);
         yCursorSet(cursorPos.y);
      }
   }
   
   // Mouse Init
   $(document).on('mousemove', function() {
      if ($('[data-cursor-init]').attr('data-cursor-init') == 'false') {
         $('[data-cursor-init]').attr('data-cursor-init', 'true');
      }
   });
   
   // Normal Hover
   $('[data-cursor-bubble-text]').on('mouseenter', function() {
      let dataCursorText = $(this).data('cursor-bubble-text');
      $('[data-cursor-bubble]').attr('data-cursor-bubble', 'active');
      $('.custom-cursor').find('.cursor-bubble .cursor-text').text(dataCursorText);
   });
   $('[data-cursor-bubble-text]').on('mouseleave', function() {
      $('[data-cursor-bubble]').attr('data-cursor-bubble', 'not-active');
   });   
}


/**
* Interface Sounds
*/
function initInterfaceSounds() {

   // Toggle Navigation
   $('[data-sound-toggle]').click(function(){
      if ($('[data-audio-ambient-status]').attr('data-audio-ambient-status') == 'not-active') {
         $('[data-audio-ambient-status]').attr('data-audio-ambient-status', 'active');
         $('audio').attr('data-audio-ambient-status', 'active');
         $('#audio-ambient')[0].currentTime = 0;
         $('#audio-ambient')[0].volume = 0.5;
         $('#audio-ambient')[0].play();
      } else {
         $('[data-audio-ambient-status]').attr('data-audio-ambient-status', 'not-active');
         $('#audio-ambient')[0].currentTime = 0;
         $('#audio-ambient')[0].volume = 0;
      }
   });

   $('a, [data-sound-toggle]').on('mouseenter', function() {
      var interfaceSoundID = "audio-flick";
      if ($('[data-audio-ambient-status]').attr('data-audio-ambient-status') == 'active') {
         $('#' + interfaceSoundID)[0].currentTime = 0;
         $('#' + interfaceSoundID)[0].volume = 0.2;
         $('#' + interfaceSoundID)[0].play();
      }
   });


   $('a').on('click', function() {
      var interfaceSoundID = "audio-flick";
      if ($('[data-audio-ambient-status]').attr('data-audio-ambient-status') == 'active') {
         $('#' + interfaceSoundID)[0].currentTime = 0;
         $('#' + interfaceSoundID)[0].volume = 0.2;
         $('#' + interfaceSoundID)[0].play();
      }
   });


   $('a').on('click', function() {
      if ($('[data-audio-ambient-status]').attr('data-audio-ambient-status') == 'not-started') {
         $('#audio-ambient')[0].currentTime = 0;
         $('#audio-ambient')[0].volume = 0.5;
         $('#audio-ambient')[0].play();
         $('[data-audio-ambient-status]').attr('data-audio-ambient-status', 'active');
      } 
   });
   
}

function audioWhoosh() {
   var interfaceSoundID = "audio-whoosh";
   if ($('[data-audio-ambient-status]').attr('data-audio-ambient-status') != 'not-active') {
      $('#' + interfaceSoundID)[0].currentTime = 0;
      $('#' + interfaceSoundID)[0].volume = 1;
      $('#' + interfaceSoundID)[0].play();
   }
}

/**
* Marquee on Scroll Direction
*/
function initMarqueeScroll() {

   // Scrolling Letters Both Direction
   // https://codepen.io/GreenSock/pen/rNjvgjo
   // Fixed example with resizing
   // https://codepen.io/GreenSock/pen/QWqoKBv?editors=0010

   $('.marquee-group').each(function(index){

		  var marqueeGroup =  $(this);

      var marqueeItemsCount = marqueeGroup.find(".marquee-content").length;
      var marqueeItemsWidth = marqueeGroup.find(".marquee-content").width();
      var marqueeSpeed = marqueeGroup.find("[data-marquee-speed]").attr('data-marquee-speed') * (marqueeItemsWidth / $(window).width());

			if($(window).width() <= 600){
         marqueeSpeed = marqueeSpeed * 0.5;
      }

      let direction = 1; // 1 = forward, -1 = backward scroll

      const marqueeLeft = roll(marqueeGroup.find("[data-marquee-direction='left'] .marquee-content"), {duration: marqueeSpeed}),
      marqueeRight = roll(marqueeGroup.find("[data-marquee-direction='right'] .marquee-content"), {duration: marqueeSpeed}, true),
      scroll = ScrollTrigger.create({
         trigger: document.querySelector('[data-scroll-container]'),
         onUpdate(self) {
            if (self.direction !== direction) {
               direction *= -1;
               gsap.to([marqueeLeft, marqueeRight], {timeScale: direction, overwrite: true});
            }
            self.direction === -1 ? marqueeGroup.find("[data-marquee-status]").attr('data-marquee-status', 'normal') : marqueeGroup.find("[data-marquee-status]").attr('data-marquee-status', 'inverted');
         }
      });
   
      // helper function that clones the targets
      function roll(targets, vars, reverse) {
         vars = vars || {};
         vars.ease || (vars.ease = "none");
         const tl = gsap.timeline({
            repeat: -1,
            onReverseComplete() { 
               this.totalTime(this.rawTime() + this.duration() * 10);
            }
         }), 
         elements = gsap.utils.toArray(targets),
         clones = elements.map(el => {
            let clone = el.cloneNode(true);
            el.parentNode.appendChild(clone);
            return clone;
         }),
         positionClones = () => elements.forEach((el, i) => gsap.set(clones[i], {position: "absolute", overwrite: false, top: el.offsetTop, left: el.offsetLeft + (reverse ? -el.offsetWidth : el.offsetWidth)}));
         positionClones();
         elements.forEach((el, i) => tl.to([el, clones[i]], {xPercent: reverse ? 100 : -100, ...vars}, 0));
         window.addEventListener("resize", () => {
            let time = tl.totalTime();
            tl.totalTime(0);
            positionClones();
            tl.totalTime(time);
         });
         return tl;
      }

   });
}