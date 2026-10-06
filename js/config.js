/* ------------------------------------------------------------------
   REX ENGINEERING - site configuration.
   This is the ONE place to change the firm name, contact details,
   credentials and testimonials.  Empty values are simply hidden.
   ------------------------------------------------------------------ */
window.FIRM = {
  name: "REX ENGINEERING",
  tagline: "Structural engineering for steel, concrete, masonry and wood structures.",
  principal: "Suresh A.",                // as shown on the public Fiverr profile; set "" to hide

  /* Contact details shown across the site (header, footer, contact form). */
  email: "sureshankiya9982@gmail.com",
  phone: "",                       // e.g. "(555) 123-4567"  (hidden while empty)
  siteUrl: "https://sureshankiya.github.io/rex",   // used for sitemap.xml / canonical links (tools/build_pages.py)
  serviceArea: "Remote structural engineering for projects across the United States, India and internationally",

  /* Optional: a form-handling endpoint (e.g. Formspree / Web3Forms URL).  When set, the
     contact form posts to it (with plan uploads); while empty it opens the visitor's email app. */
  formEndpoint: "",

  /* Shown on the About page only when filled in, e.g.
     ["Professional Engineer, State of California - License No. ____"] */
  credentials: [],

  /* Public (published) URLs of the calculators built in Lovable - shown on the Tools page.
     An empty value shows the button as "Link coming soon". */
  apps: {
    trusscalc: "https://rextruss.lovable.app",            // Roof Truss Planner  (TrussCalc)
    studcalc: "https://stud-buddy-calculatr.lovable.app", // Stud Wall Calculator (StudCalc)
    joistcalc: "https://rexreport.lovable.app",           // Structure Genius    (JoistCalc)
    strutura: "https://steel-truss-builder.lovable.app"   // Truss Report Master (STRUTURA steel truss)
  },

  fiverr: {
    url: "https://www.fiverr.com/sureshankiya",
    rating: 4.8,
    reviews: 20,
    responseTime: "4 hours",
    since: 2020
  },

  /* Verbatim client reviews from the public Fiverr profile (buyer names omitted, country only). */
  testimonials: [
    { quote: "Suresh delivered an EXCEPTIONAL job in Building Engineering, exceeding expectations with his attention to detail and polished professionalism. His polite demeanor and quick responsiveness made the process seamless, delivering everything on time. VERY IMPRESSED with both the work and the collaboration—great communication throughout!",
      who: "Fiverr client", where: "United Kingdom", rating: 5, service: "ETABS / STAAD.Pro analysis & design" },
    { quote: "Suresh is a polite, professional and prompt [freelancer]. Highly recommended",
      who: "Fiverr client", where: "India", rating: 5, service: "STAAD.Pro analysis & design" },
    { quote: "Good work. Done on time. Thanks",
      who: "Fiverr client", where: "India", rating: 5, service: "ETABS / STAAD.Pro analysis & design" },
    { quote: "good guy, easy to work with",
      who: "Repeat Fiverr client", where: "Australia", rating: 4, service: "Architectural & structural drawings" }
  ],

  codes: [
    "IBC / IRC (2015–2024)", "CBC / CRC (2022 & 2025)", "Florida Building Code", "ASCE 7-10 / 16 / 22",
    "AISC 360", "AISI S100 / S240", "ACI 318", "TMS 402 / MSJC", "NDS / SDPWS",
    "EN 1992-4 (anchorage)", "AS/NZS 1170",
    "IS 456 (RCC)", "IS 800 (steel)", "IS 875 (loads)", "IS 1893 (seismic)"
  ],
  software: ["STAAD.Pro", "ETABS", "Tekla Structural Designer", "Tekla Tedds", "IDEA StatiCa",
             "fischer C-FIX", "Enercalc", "AutoCAD"],

  stats: {
    states: 9,        // CA, TX, MO, LA, MI, OR, FL, GA, KY - update as the portfolio grows
    countries: 4      // USA, India, UAE, Australia
  }
};
