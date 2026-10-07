/* REX ENGINEERING - shared site behaviour (no dependencies). */
(function () {
  "use strict";
  var F = window.FIRM || {};
  var P = window.PROJECTS || [];
  var CATS = window.CATEGORIES || [];
  var body = document.body;
  var page = body.getAttribute("data-page") || "";
  var BASE = body.getAttribute("data-base") || "";          // "../" on pages inside /projects/

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function mail(subject, text) {
    return "mailto:" + F.email + "?subject=" + encodeURIComponent(subject) + (text ? "&body=" + encodeURIComponent(text) : "");
  }
  function byId(id) { return P.filter(function (p) { return p.id === id; })[0]; }
  function where(p) { return p.city ? p.city : "Location withheld"; }
  function projectUrl(p) { return BASE + "projects/" + encodeURIComponent(p.id) + ".html"; }
  function stars(r) {
    var full = Math.round(r);
    return '<span class="stars" aria-label="' + r + ' out of 5">' + "★★★★★".slice(0, full) + '<i>' + "★★★★★".slice(full) + "</i></span>";
  }

  var MARK = '<svg viewBox="0 0 40 40" aria-hidden="true"><rect x="1" y="1" width="38" height="38" fill="none" stroke="#4cc3ff" stroke-width="2"/>' +
    '<path d="M9 10h22v4H23v12h8v4H9v-4h8V14H9z" fill="#fff"/><path d="M1 20h6M33 20h6M20 1v6M20 33v6" stroke="#4cc3ff" stroke-width="1.5"/></svg>';

  var NAV = [
    ["projects.html", "Projects", "projects"],
    ["services.html", "Services", "services"],
    ["faq.html", "FAQ", "faq"],
    ["tools.html", "Tools", "tools"],
    ["about.html", "About", "about"],
    ["contact.html", "Contact", "contact"]
  ];

  /* ------------------------------------------------------------ header / footer */
  function renderHeader() {
    var host = $("#site-header");
    if (!host) return;
    var links = NAV.map(function (n) {
      var cur = page === n[2] || (page === "project" && n[2] === "projects");
      return '<a href="' + BASE + n[0] + '"' + (cur ? ' aria-current="page"' : "") + ">" + n[1] + "</a>";
    }).join("");
    host.className = "site-header";
    host.innerHTML = '<div class="wrap"><a class="brand" href="' + BASE + 'index.html" aria-label="' + esc(F.name) + ' home">' + MARK +
      "<span><b>" + esc(F.name) + "</b><small>STRUCTURAL ENGINEERS</small></span></a>" +
      '<button class="nav-toggle" aria-expanded="false" aria-controls="nav">MENU</button>' +
      '<nav class="nav" id="nav" aria-label="Main">' + links + '<a class="btn btn--primary btn--sm" href="' + BASE + 'contact.html">Request a quote</a></nav></div>';
    var btn = $(".nav-toggle", host), nav = $("#nav", host);
    btn.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", open);
      btn.textContent = open ? "CLOSE" : "MENU";
    });
  }

  function renderFooter() {
    var host = $("#site-footer");
    if (!host) return;
    host.className = "site-footer";
    var contact = '<li><a href="mailto:' + esc(F.email) + '">' + esc(F.email) + "</a></li>" +
      (F.phone ? '<li><a href="tel:' + esc(F.phone.replace(/[^+\d]/g, "")) + '">' + esc(F.phone) + "</a></li>" : "") +
      (F.fiverr && F.fiverr.url ? '<li><a href="' + esc(F.fiverr.url) + '" rel="noopener" target="_blank">Hire on Fiverr ↗</a></li>' : "") +
      (F.serviceArea ? "<li>" + esc(F.serviceArea) + "</li>" : "");
    host.innerHTML = '<div class="wrap"><div class="cols">' +
      '<div><a class="brand" href="' + BASE + 'index.html">' + MARK + "<span><b>" + esc(F.name) + "</b><small>STRUCTURAL ENGINEERS</small></span></a>" +
      '<p style="margin-top:16px;max-width:22em">' + esc(F.tagline) + "</p></div>" +
      "<div><h4>Navigate</h4><ul>" + NAV.map(function (n) { return '<li><a href="' + BASE + n[0] + '">' + n[1] + "</a></li>"; }).join("") + "</ul></div>" +
      "<div><h4>Work</h4><ul>" + CATS.map(function (c) { return '<li><a href="' + BASE + 'projects.html?cat=' + encodeURIComponent(c) + '">' + esc(c) + "</a></li>"; }).join("") + "</ul></div>" +
      "<div><h4>Contact</h4><ul>" + contact + "</ul></div></div>" +
      '<div class="fine"><span>&copy; ' + new Date().getFullYear() + " " + esc(F.name) + ". All rights reserved.</span>" +
      "<span>Sheets shown are portfolio samples with client and site details redacted. Not for construction.</span></div></div>";
  }

  /* sticky call-to-action on phones */
  function renderMobileCta() {
    if (page === "contact") return;
    var bar = document.createElement("div");
    bar.className = "mcta";
    bar.innerHTML = (F.phone ? '<a class="btn btn--ghost" href="tel:' + esc(F.phone.replace(/[^+\d]/g, "")) + '">Call</a>' :
      (F.fiverr && F.fiverr.url ? '<a class="btn btn--ghost" href="' + esc(F.fiverr.url) + '" rel="noopener" target="_blank">Fiverr</a>' : "")) +
      '<a class="btn btn--primary" href="' + BASE + 'contact.html">Request a quote</a>';
    body.appendChild(bar);
    body.classList.add("has-mcta");
  }

  /* ------------------------------------------------------------ lightbox */
  var lb, lbItems = [], lbIndex = 0, lbOpener = null;
  function ensureLightbox() {
    if (lb) return lb;
    lb = document.createElement("dialog");
    lb.className = "lightbox";
    lb.setAttribute("aria-label", "Drawing viewer");
    lb.innerHTML = '<div class="lb"><div class="lb__bar"><span id="lbCount"></span><span>' +
      '<button class="lb__btn" id="lbPrev" aria-label="Previous sheet">&larr; Prev</button> ' +
      '<button class="lb__btn" id="lbNext" aria-label="Next sheet">Next &rarr;</button> ' +
      '<button class="lb__btn" id="lbClose" aria-label="Close viewer">Close &times;</button></span></div>' +
      '<div class="lb__stage" id="lbStage"><img id="lbImg" alt=""></div><div class="lb__cap" id="lbCap"></div></div>';
    body.appendChild(lb);
    lb.addEventListener("click", function (e) { if (e.target === lb) lb.close(); });
    $("#lbClose", lb).addEventListener("click", function () { lb.close(); });
    $("#lbPrev", lb).addEventListener("click", function () { step(-1); });
    $("#lbNext", lb).addEventListener("click", function () { step(1); });
    $("#lbStage", lb).addEventListener("click", function (e) { if (e.target.id === "lbImg") this.classList.toggle("zoom"); });
    lb.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { step(1); e.preventDefault(); }
      if (e.key === "ArrowLeft") { step(-1); e.preventDefault(); }
    });
    lb.addEventListener("close", function () { if (lbOpener && lbOpener.focus) lbOpener.focus(); });
    return lb;
  }
  function show() {
    var it = lbItems[lbIndex];
    $("#lbStage", lb).classList.remove("zoom");
    var img = $("#lbImg", lb);
    img.src = it.src; img.alt = it.alt;
    $("#lbCap", lb).textContent = it.caption;
    $("#lbCount", lb).textContent = "Sheet " + (lbIndex + 1) + " / " + lbItems.length + "  -  click image to zoom";
    $("#lbPrev", lb).disabled = $("#lbNext", lb).disabled = lbItems.length < 2;
  }
  function step(d) { lbIndex = (lbIndex + d + lbItems.length) % lbItems.length; show(); }
  function openLightbox(items, i, opener) {
    ensureLightbox();
    lbItems = items; lbIndex = i; lbOpener = opener || null;
    show();
    if (!lb.open) lb.showModal();
  }

  /* ------------------------------------------------------------ shared components */
  function card(p) {
    return '<a class="card" href="' + projectUrl(p) + '">' +
      '<div class="card__media"><img loading="lazy" src="' + BASE + esc(p.cover) + '" alt="' + esc(p.title + " - structural drawing") + '">' +
      '<span class="card__tag">' + esc(p.category) + "</span></div>" +
      '<div class="card__body"><h3>' + esc(p.title) + "</h3>" +
      '<div class="card__meta"><span>' + esc(where(p)) + "</span><span><i>&#9642;</i> " + esc(p.size) + "</span></div></div></a>";
  }

  function renderTestimonials(host, limit) {
    var t = (F.testimonials || []).slice(0, limit || 99);
    if (!host) return;
    if (!t.length) { var sec = host.closest("section"); if (sec) sec.hidden = true; return; }
    host.innerHTML = t.map(function (r) {
      return '<figure class="quote"><div class="quote__stars">' + stars(r.rating) + "</div><blockquote>&ldquo;" + esc(r.quote) + "&rdquo;</blockquote>" +
        "<figcaption><b>" + esc(r.who) + "</b> &middot; " + esc(r.where) + (r.service ? '<span>' + esc(r.service) + "</span>" : "") + "</figcaption></figure>";
    }).join("");
  }

  function renderFiverrBadge(host) {
    if (!host || !F.fiverr || !F.fiverr.url) { if (host) host.hidden = true; return; }
    host.innerHTML = '<a class="badge" href="' + esc(F.fiverr.url) + '" rel="noopener" target="_blank">' +
      '<b>' + esc(F.fiverr.rating) + ' ★</b><span>' + esc(F.fiverr.reviews) + " client reviews on Fiverr &middot; avg. response " + esc(F.fiverr.responseTime) + ' ↗</span></a>';
  }

  /* ------------------------------------------------------------ pages */
  function initHome() {
    var featured = P.filter(function (p) { return p.featured; }).slice(0, 6);
    var g = $("#featured");
    if (g) g.innerHTML = featured.map(card).join("");
    var hero = byId("steel-truss-canopy-texas") || P[0];
    var fig = $("#heroSheet");
    if (fig && hero) {
      fig.innerHTML = '<img src="' + esc(hero.cover) + '" alt="' + esc(hero.title + " - elevations sheet") + '">' +
        "<figcaption><span>" + esc(hero.title) + "</span><span>" + esc(hero.city) + "</span></figcaption>";
    }
    var types = $("#types");
    if (types) {
      types.innerHTML = CATS.map(function (c) {
        var list = P.filter(function (p) { return p.category === c; });
        if (!list.length) return "";
        return '<a class="type" href="projects.html?cat=' + encodeURIComponent(c) + '"><img loading="lazy" src="' + esc(list[0].cover) + '" alt="">' +
          "<span><b>" + esc(c) + "</b><i>" + list.length + " project" + (list.length > 1 ? "s" : "") + " &rarr;</i></span></a>";
      }).join("");
    }
    $$("[data-stat='projects']").forEach(function (e) { e.textContent = P.length; });
    $$("[data-stat='states']").forEach(function (e) { e.textContent = (F.stats && F.stats.states) || ""; });
    $$("[data-stat='countries']").forEach(function (e) { e.textContent = (F.stats && F.stats.countries) || ""; });
    $$("[data-stat='rating']").forEach(function (e) { e.textContent = F.fiverr ? F.fiverr.rating + "★" : ""; });
    $$("[data-stat='reviews']").forEach(function (e) { e.textContent = F.fiverr ? F.fiverr.reviews : ""; });
    var codes = $("#codes");
    if (codes) codes.innerHTML = (F.codes || []).concat(F.software || []).map(function (c) { return '<span class="chip">' + esc(c) + "</span>"; }).join("");
    renderTestimonials($("#testimonials"), 3);
    renderFiverrBadge($("#fiverrBadge"));
    // structured data for search engines
    var ld = { "@context": "https://schema.org", "@type": "ProfessionalService", name: F.name, description: F.tagline,
      url: F.siteUrl || undefined, email: F.email, telephone: F.phone || undefined, areaServed: F.serviceArea,
      knowsAbout: ["Structural engineering", "Steel design", "Cold-formed steel", "Connection design", "Foundation design",
        "Reinforced concrete design", "Wood framing", "Seismic and wind design",
        "Indian Standards (IS 456, IS 800, IS 875, IS 1893)"], sameAs: F.fiverr && F.fiverr.url ? [F.fiverr.url] : undefined };
    var s = document.createElement("script"); s.type = "application/ld+json"; s.textContent = JSON.stringify(ld);
    document.head.appendChild(s);
  }

  function initProjects() {
    var params = new URLSearchParams(location.search);
    var current = params.get("cat") || "All";
    if (current !== "All" && CATS.indexOf(current) < 0) current = "All";
    var bar = $("#filters"), grid = $("#grid");
    function paint() {
      var list = P.filter(function (p) { return current === "All" || p.category === current; });
      grid.innerHTML = list.length ? list.map(card).join("") : '<p class="empty">No projects in this category yet.</p>';
      $(".count", bar).textContent = list.length + " of " + P.length + " projects";
      $$("button.chip", bar).forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-cat") === current); });
    }
    bar.innerHTML = ["All"].concat(CATS).map(function (c) {
      var n = c === "All" ? P.length : P.filter(function (p) { return p.category === c; }).length;
      return '<button class="chip" type="button" data-cat="' + esc(c) + '" aria-pressed="false">' + esc(c) + " &middot; " + n + "</button>";
    }).join("") + '<span class="count" aria-live="polite"></span>';
    bar.addEventListener("click", function (e) {
      var b = e.target.closest("button.chip");
      if (!b) return;
      current = b.getAttribute("data-cat");
      if (history.replaceState) history.replaceState(null, "", current === "All" ? "projects.html" : "projects.html?cat=" + encodeURIComponent(current));
      paint();
    });
    paint();
  }

  /* static project pages (generated by tools/build_pages.py) */
  function initProject() {
    var p = byId(body.getAttribute("data-project"));
    if (!p) return;
    var items = p.sheets.map(function (s) { return { src: BASE + s.src, caption: s.caption, alt: p.title + " - " + s.caption }; });
    var gal = $("#gallery");
    if (gal) gal.addEventListener("click", function (e) {
      var b = e.target.closest(".thumb");
      if (b) openLightbox(items, +b.getAttribute("data-i"), b);
    });
    var cov = $("#openCover");
    if (cov) cov.addEventListener("click", function () { openLightbox(items, p.coverIndex || 0, cov); });
    var req = $("#requestSet");
    if (req) req.setAttribute("href", mail("Drawing set request: " + p.title + (p.city ? " (" + p.city + ")" : ""),
      "Hello,\n\nI'd like to request the full drawing set / calculations for \"" + p.title + "\".\n\nName:\nCompany:\nPurpose:\n\nThank you."));
  }

  /* old URL format project.html?id=... -> static page */
  function initLegacyProject() {
    var id = new URLSearchParams(location.search).get("id");
    var p = id && byId(id);
    location.replace(p ? projectUrl(p) : "projects.html");
  }

  function initContact() {
    var form = $("#contactForm");
    if (!form) return;
    var sel = $("#ptype");
    sel.innerHTML = CATS.concat(["Calculations only", "Plan-check corrections", "Something else"]).map(function (c) { return "<option>" + esc(c) + "</option>"; }).join("");
    var pre = new URLSearchParams(location.search).get("project");
    if (pre) $("#message").value = "Re: " + pre + "\n\n";
    var upload = $("#uploadRow");
    if (upload) upload.hidden = !F.formEndpoint || F.formUploads === false;
    var out = $("#status");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var d = new FormData(form);
      if (!d.get("name") || !d.get("email") || !d.get("message")) {
        out.textContent = "Please add your name, email and a few project details.";
        return;
      }
      if (F.formEndpoint) {
        out.textContent = "Sending...";
        fetch(F.formEndpoint, { method: "POST", body: d, headers: { Accept: "application/json" } })
          .then(function (r) {
            return r.json().catch(function () { return {}; }).then(function (j) {
              if (!r.ok || j.success === false || j.success === "false") throw new Error(j.message || r.status);
            });
          })
          .then(function () {
            form.reset();
            out.textContent = "Thanks - your request has been sent. We'll reply by email.";
          })
          .catch(function () { out.textContent = "Sorry, that didn't go through. Please email " + F.email + " instead."; });
        return;
      }
      var text = "Name: " + d.get("name") + "\nEmail: " + d.get("email") + "\nProject type: " + d.get("ptype") +
        "\nProject location: " + d.get("city") + "\n\n" + d.get("message");
      out.textContent = "Opening your email app... if nothing happens, write to " + F.email + " and attach your plans.";
      window.location.href = mail("Project inquiry - " + d.get("ptype"), text);
    });
  }

  function initFirmText() {
    if (F.name && F.name !== "REX ENGINEERING") {
      document.title = document.title.replace(/REX ENGINEERING/g, F.name);
      var m = $('meta[name="description"]');
      if (m) m.setAttribute("content", m.getAttribute("content").replace(/REX ENGINEERING/g, F.name));
    }
    $$("[data-firm='name']").forEach(function (e) { e.textContent = F.name; });
    $$("[data-firm='principal']").forEach(function (e) {
      if (F.principal) { e.textContent = F.principal; return; }
      var box = e.closest("[data-firm-optional]");
      (box || e).hidden = true;
    });
    $$("[data-firm='email']").forEach(function (e) { e.textContent = F.email; e.setAttribute("href", "mailto:" + F.email); });
    $$("[data-firm='area']").forEach(function (e) { e.textContent = F.serviceArea || ""; });
    $$("[data-firm='phone-row']").forEach(function (e) { if (!F.phone) e.hidden = true; });
    $$("[data-firm='phone']").forEach(function (e) { e.textContent = F.phone || ""; });
    $$("[data-firm='fiverr']").forEach(function (e) {
      if (F.fiverr && F.fiverr.url) e.setAttribute("href", F.fiverr.url); else e.hidden = true;
    });
    $$("[data-firm='fiverr-response']").forEach(function (e) { if (F.fiverr) e.textContent = F.fiverr.responseTime; });
    $$("[data-firm='fiverr-stats']").forEach(function (e) {
      if (F.fiverr) e.textContent = F.fiverr.rating + "★ from " + F.fiverr.reviews + " reviews · avg. response " + F.fiverr.responseTime;
    });
    var cred = $("#credentials");
    if (cred) {
      if (F.credentials && F.credentials.length) cred.innerHTML = F.credentials.map(function (c) { return "<li>" + esc(c) + "</li>"; }).join("");
      else cred.parentElement.hidden = true;
    }
    $$("[data-chips='software']").forEach(function (e) { e.innerHTML = (F.software || []).map(function (c) { return '<span class="chip">' + esc(c) + "</span>"; }).join(""); });
    $$("[data-chips='codes']").forEach(function (e) { e.innerHTML = (F.codes || []).map(function (c) { return '<span class="chip">' + esc(c) + "</span>"; }).join(""); });
    renderTestimonials($("#testimonialsAll"));
    renderFiverrBadge($("#fiverrBadgeAbout"));
  }

  /* Tools hub: point each app button at its published URL, or show it as coming soon */
  function initTools() {
    var apps = F.apps || {};
    $$("[data-app]").forEach(function (a) {
      var url = apps[a.getAttribute("data-app")];
      if (url) { a.setAttribute("href", url); return; }
      a.removeAttribute("href");
      a.removeAttribute("target");
      a.setAttribute("aria-disabled", "true");
      a.textContent = "Link coming soon";
      var note = document.createElement("small");
      note.innerHTML = 'Want early access? <a href="' + BASE + 'contact.html">Ask us</a>.';
      a.parentNode.appendChild(note);
    });
  }

  /* FAQ: open the question named in the URL hash, and publish FAQPage structured data built from the page */
  function initFaq() {
    function openHash() {
      var d = location.hash && document.getElementById(location.hash.slice(1));
      if (d && d.tagName === "DETAILS") { d.open = true; d.scrollIntoView({ block: "start" }); }
    }
    openHash();
    window.addEventListener("hashchange", openHash);
    var qa = $$(".faq details").map(function (d) {
      return { "@type": "Question", name: $("summary", d).textContent.trim(),
        acceptedAnswer: { "@type": "Answer", text: $(".a", d).textContent.replace(/\s+/g, " ").trim() } };
    });
    var s = document.createElement("script"); s.type = "application/ld+json";
    s.textContent = JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: qa });
    document.head.appendChild(s);
  }

  renderHeader();
  renderFooter();
  renderMobileCta();
  initFirmText();
  if (page === "home") initHome();
  if (page === "projects") initProjects();
  if (page === "project") initProject();
  if (page === "project-legacy") initLegacyProject();
  if (page === "contact") initContact();
  if (page === "faq") initFaq();
  if (page === "tools") initTools();
})();
