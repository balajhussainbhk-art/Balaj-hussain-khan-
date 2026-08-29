(function(){
  "use strict";

  // Mobile menu
  var burger = document.getElementById('agBurger');
  var mobile = document.getElementById('agMobile');
  if (burger && mobile){
    burger.addEventListener('click', function(){
      var open = mobile.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    mobile.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){ mobile.classList.remove('is-open'); burger.setAttribute('aria-expanded','false'); });
    });
  }

  // Fade-in on scroll
  var fadeEls = document.querySelectorAll('[data-fade]');
  if ('IntersectionObserver' in window && fadeEls.length){
    var fadeObserver = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting){
          entry.target.classList.add('is-visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    fadeEls.forEach(function(el){ fadeObserver.observe(el); });
  } else {
    fadeEls.forEach(function(el){ el.classList.add('is-visible'); });
  }

  // Animated counters
  var counters = document.querySelectorAll('[data-count]');
  function animateCount(el){
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var duration = 1400;
    var start = null;
    function step(ts){
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window && counters.length){
    var countObserver = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting){
          animateCount(entry.target);
          countObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(function(el){ countObserver.observe(el); });
  } else {
    counters.forEach(function(el){ el.textContent = el.getAttribute('data-count'); });
  }

  // Timeline rail fill on scroll
  var timeline = document.getElementById('agTimeline');
  var railFill = document.getElementById('agRailFill');
  if (timeline && railFill){
    function updateRail(){
      var rect = timeline.getBoundingClientRect();
      var vh = window.innerHeight || document.documentElement.clientHeight;
      var total = rect.height;
      var visible = vh * 0.75 - rect.top;
      var pct = Math.max(0, Math.min(1, visible / total));
      railFill.style.height = (pct * 100) + '%';
    }
    window.addEventListener('scroll', updateRail, { passive: true });
    window.addEventListener('resize', updateRail);
    updateRail();
  }

  // Work carousel arrows
  var workTrack = document.getElementById('agWorkTrack');
  var workPrev = document.getElementById('agWorkPrev');
  var workNext = document.getElementById('agWorkNext');
  if (workTrack && workPrev && workNext){
    function cardStep(){
      var card = workTrack.querySelector('.ag-work-card');
      var gap = 18;
      return card ? card.getBoundingClientRect().width + gap : 300;
    }
    function updateArrows(){
      var max = workTrack.scrollWidth - workTrack.clientWidth - 4;
      workPrev.disabled = workTrack.scrollLeft <= 4;
      workNext.disabled = workTrack.scrollLeft >= max;
    }
    workPrev.addEventListener('click', function(){
      workTrack.scrollBy({ left: -cardStep(), behavior: 'smooth' });
    });
    workNext.addEventListener('click', function(){
      workTrack.scrollBy({ left: cardStep(), behavior: 'smooth' });
    });
    workTrack.addEventListener('scroll', updateArrows, { passive: true });
    window.addEventListener('resize', updateArrows);
    updateArrows();
  }

  // Sticky nav shadow on scroll
  var nav = document.getElementById('agNav');
  if (nav){
    window.addEventListener('scroll', function(){
      if (window.scrollY > 12) nav.style.boxShadow = '0 8px 24px -18px rgba(11,12,18,.35)';
      else nav.style.boxShadow = 'none';
    }, { passive:true });
  }
})();
