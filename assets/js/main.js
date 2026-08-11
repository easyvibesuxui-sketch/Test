/* ============================================================
   syniotec — telematics for construction machines
   scroll engine · assembly rig · reveals
   ============================================================ */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  var lerp  = function (a, b, t) { return a + (b - a) * t; };
  var easeOut = function (t) { return 1 - Math.pow(1 - t, 3); };
  var easeInOut = function (t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };

  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------------------------------------------------------
     header · scroll progress · nav state
     --------------------------------------------------------- */
  var head = document.getElementById('siteHead');
  var bar  = document.getElementById('scrollBar');

  function onScrollChrome() {
    var y = window.scrollY || document.documentElement.scrollTop;
    head.classList.toggle('is-stuck', y > 40);
    var max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
  }

  /* ---------------------------------------------------------
     mobile menu
     --------------------------------------------------------- */
  var burger = document.getElementById('burger');
  var menu   = document.getElementById('mobileMenu');

  function setMenu(open) {
    burger.setAttribute('aria-expanded', String(open));
    menu.hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
  }
  burger.addEventListener('click', function () {
    setMenu(burger.getAttribute('aria-expanded') !== 'true');
  });
  menu.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') setMenu(false);
  });
  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setMenu(false);
  });

  /* ---------------------------------------------------------
     reveal on enter
     --------------------------------------------------------- */
  var revealables = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var d = parseInt(en.target.dataset.delay || '0', 10);
        setTimeout(function () { en.target.classList.add('is-in'); }, d);
        io.unobserve(en.target);
      });
    }, { threshold: .16, rootMargin: '0px 0px -8% 0px' });
    revealables.forEach(function (el) { io.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------------------------------------------------------
     hero headline — line by line
     --------------------------------------------------------- */
  (function heroLines() {
    var lines = document.querySelectorAll('.split-lines .line');
    lines.forEach(function (line, i) {
      var inner = document.createElement('span');
      inner.style.display = 'block';
      while (line.firstChild) inner.appendChild(line.firstChild);
      line.appendChild(inner);
      if (reduced) return;
      inner.style.transform = 'translateY(105%)';
      inner.style.opacity = '0';
      inner.style.transition = 'transform 1.05s cubic-bezier(.16,1,.3,1) ' + (i * 110 + 120) +
                               'ms, opacity .8s ease ' + (i * 110 + 120) + 'ms';
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          inner.style.transform = 'translateY(0)';
          inner.style.opacity = '1';
        });
      });
    });
  })();

  /* ---------------------------------------------------------
     number counters
     --------------------------------------------------------- */
  (function counters() {
    var nodes = document.querySelectorAll('[data-count]');
    if (!nodes.length) return;
    if (reduced || !('IntersectionObserver' in window)) {
      nodes.forEach(function (n) { n.textContent = n.dataset.count + (n.dataset.suffix || ''); });
      return;
    }
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target, target = parseFloat(el.dataset.count),
            suffix = el.dataset.suffix || '', t0 = performance.now(), dur = 1500;
        (function tick(now) {
          var p = clamp((now - t0) / dur, 0, 1);
          el.textContent = Math.round(target * easeOut(p)) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        })(t0);
        co.unobserve(el);
      });
    }, { threshold: .5 });
    nodes.forEach(function (n) { co.observe(n); });
  })();

  /* ---------------------------------------------------------
     active nav link
     --------------------------------------------------------- */
  (function navState() {
    var links = Array.prototype.slice.call(document.querySelectorAll('[data-nav]'));
    var targets = links.map(function (a) { return document.querySelector(a.getAttribute('href')); })
                       .filter(Boolean);
    if (!targets.length || !('IntersectionObserver' in window)) return;
    var no = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) {
          a.classList.toggle('is-current', a.getAttribute('href') === '#' + en.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    targets.forEach(function (t) { no.observe(t); });
  })();

  /* ---------------------------------------------------------
     hero canvas — telemetry field
     --------------------------------------------------------- */
  (function heroField() {
    var cv = document.getElementById('heroCanvas');
    if (!cv || reduced) return;
    var ctx = cv.getContext('2d'), w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    var nodes = [], sweep = 0, raf = null, visible = true;

    function build() {
      w = cv.clientWidth; h = cv.clientHeight;
      cv.width = w * dpr; cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var count = Math.round(clamp((w * h) / 26000, 22, 78));
      nodes = [];
      for (var i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * w, y: Math.random() * h,
          vx: (Math.random() - .5) * .16, vy: (Math.random() - .5) * .16,
          r: Math.random() * 1.6 + .7,
          hot: Math.random() < .18
        });
      }
    }

    function frame() {
      ctx.clearRect(0, 0, w, h);
      sweep = (sweep + .0024) % 1;
      var sx = sweep * (w + 400) - 200;

      // link lines
      for (var i = 0; i < nodes.length; i++) {
        var a = nodes[i];
        a.x += a.vx; a.y += a.vy;
        if (a.x < -20) a.x = w + 20; if (a.x > w + 20) a.x = -20;
        if (a.y < -20) a.y = h + 20; if (a.y > h + 20) a.y = -20;
        for (var j = i + 1; j < nodes.length; j++) {
          var b = nodes[j], dx = a.x - b.x, dy = a.y - b.y, d = Math.sqrt(dx * dx + dy * dy);
          if (d < 170) {
            ctx.globalAlpha = (1 - d / 170) * .16;
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      // nodes
      nodes.forEach(function (n) {
        var near = 1 - clamp(Math.abs(n.x - sx) / 190, 0, 1);
        ctx.globalAlpha = .30 + near * .7;
        ctx.fillStyle = n.hot || near > .55 ? '#E10600' : '#ffffff';
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r + near * 1.5, 0, Math.PI * 2); ctx.fill();
        if (near > .72) {
          ctx.globalAlpha = (near - .72) * 1.4;
          ctx.strokeStyle = '#E10600'; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.arc(n.x, n.y, 10 + (1 - near) * 34, 0, Math.PI * 2); ctx.stroke();
        }
      });
      // sweep line
      var g = ctx.createLinearGradient(sx - 120, 0, sx + 30, 0);
      g.addColorStop(0, 'rgba(225,6,0,0)');
      g.addColorStop(1, 'rgba(225,6,0,.42)');
      ctx.globalAlpha = 1; ctx.fillStyle = g;
      ctx.fillRect(sx - 120, 0, 150, h);

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    }

    build();
    frame();
    window.addEventListener('resize', build);
    document.addEventListener('visibilitychange', function () {
      visible = !document.hidden;
      if (visible && !raf) frame(); else if (!visible && raf) { cancelAnimationFrame(raf); raf = null; }
    });
  })();

  /* ---------------------------------------------------------
     ANATOMY — scroll driven exploded assembly
     --------------------------------------------------------- */
  var rigState = (function assembly() {
    var section = document.getElementById('anatomy');
    var stack   = document.getElementById('stack');
    var fill    = document.getElementById('assemblyFill');
    var hint    = document.getElementById('assemblyHint');
    var steps   = Array.prototype.slice.call(document.querySelectorAll('.step'));
    if (!section || !stack) return { update: function () {} };

    var layers = Array.prototype.slice.call(stack.querySelectorAll('.layer'));
    var N = layers.length, mid = (N - 1) / 2;
    var lastStep = -1;

    /* exploded pose per layer: [lateralX, lateralY, spinDeg] */
    var pose = [
      [ -0.10,  0.16,  -9 ],
      [  0.13, -0.06,   7 ],
      [ -0.14, -0.02,  -6 ],
      [  0.09,  0.10,   5 ],
      [ -0.05, -0.16,  -4 ]
    ];

    function update() {
      var rect = section.getBoundingClientRect();
      var span = section.offsetHeight - window.innerHeight;
      var p = clamp(-rect.top / (span || 1), 0, 1);

      var narrow = window.innerWidth < 900;
      var gapOpen  = narrow ? 118 : 168;   // px of z separation when exploded
      var gapShut  = narrow ? 10  : 14;    // px of z separation when assembled
      var spreadPx = narrow ? 120 : 210;   // lateral spread when exploded

      /* whole rig settles from a high oblique view to a calmer one */
      var e = easeInOut(p);
      var rx = lerp(66, 52, e);
      var rz = lerp(-40, -16, e);
      var sc = lerp(.74, .96, e);
      stack.style.transform =
        'rotateX(' + rx.toFixed(2) + 'deg) rotateZ(' + rz.toFixed(2) + 'deg) scale(' + sc.toFixed(3) + ')';

      /* each part lands in turn, bottom shell first */
      for (var i = 0; i < N; i++) {
        var start = i * 0.125;
        var t = easeOut(clamp((p - start) / 0.44, 0, 1));
        var z  = lerp((i - mid) * gapOpen, (i - mid) * gapShut, t);
        var dx = lerp(pose[i][0] * spreadPx, 0, t);
        var dy = lerp(pose[i][1] * spreadPx, 0, t);
        var rr = lerp(pose[i][2], 0, t);
        var op = clamp((p - start * 0.7) / 0.10, 0, 1) * .25 + .75;

        layers[i].style.opacity = op.toFixed(3);
        layers[i].style.transform =
          'translate3d(' + dx.toFixed(1) + 'px,' + dy.toFixed(1) + 'px,' + z.toFixed(1) + 'px)' +
          ' rotate(' + rr.toFixed(2) + 'deg)';
      }

      /* copy + progress */
      if (fill) fill.style.width = (p * 100).toFixed(1) + '%';
      var idx = clamp(Math.floor(p * N), 0, N - 1);
      if (idx !== lastStep) {
        steps.forEach(function (s, k) { s.classList.toggle('is-active', k === idx); });
        lastStep = idx;
      }
      if (hint) {
        hint.textContent = p > .93 ? 'Assembled · IP68 · ready to mount'
                                   : 'Keep scrolling to assemble';
      }
    }

    return { update: update };
  })();

  /* ---------------------------------------------------------
     parallax layers
     --------------------------------------------------------- */
  var parallaxEls = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
  function parallax() {
    if (reduced) return;
    var vh = window.innerHeight;
    parallaxEls.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      var k = parseFloat(el.dataset.parallax) || .1;
      var off = (r.top + r.height / 2 - vh / 2) * -k;
      el.style.transform = 'translate3d(0,' + off.toFixed(1) + 'px,0)';
    });
  }

  /* ---------------------------------------------------------
     rAF scroll loop
     --------------------------------------------------------- */
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      onScrollChrome();
      rigState.update();
      parallax();
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ---------------------------------------------------------
     card tilt (pointer only)
     --------------------------------------------------------- */
  if (!reduced && window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
    document.querySelectorAll('[data-tilt]').forEach(function (card) {
      card.style.transformStyle = 'preserve-3d';
      card.addEventListener('pointermove', function (e) {
        if (card.classList.contains('reveal') && !card.classList.contains('is-in')) return;
        var r = card.getBoundingClientRect();
        var mx = (e.clientX - r.left) / r.width - .5;
        var my = (e.clientY - r.top) / r.height - .5;
        card.style.transform =
          'perspective(900px) rotateX(' + (-my * 3).toFixed(2) + 'deg) rotateY(' +
          (mx * 3).toFixed(2) + 'deg) translateZ(0)';
      });
      card.addEventListener('pointerleave', function () {
        card.style.transition = 'transform .6s cubic-bezier(.16,1,.3,1)';
        card.style.transform = '';
        setTimeout(function () { card.style.transition = ''; }, 600);
      });
    });
  }
})();
