/* Truss geometry & count estimator.
   Ported from the original truss-calculator app (truss count rounding and the Howe web layout corrected).
   Geometry and material count only - NOT a structural design of the truss members. */
(function () {
  "use strict";
  var typeSelect = document.getElementById("truss-type");
  if (!typeSelect) return;
  var spanInput = document.getElementById("building-span");
  var pitchInput = document.getElementById("roof-pitch");
  var overhangInput = document.getElementById("overhang");
  var lengthInput = document.getElementById("building-length");
  var spacingInput = document.getElementById("truss-spacing");
  var resultsBody = document.getElementById("results-body");
  var outBl = document.getElementById("out-bl");
  var outSp = document.getElementById("out-sp");
  var outQty = document.getElementById("out-qty");
  var svg = document.getElementById("truss-diagram");
  var NS = "http://www.w3.org/2000/svg";

  function update() {
    var type = typeSelect.value;
    function num(el) { return Math.max(0, parseFloat(el.value) || 0); }   // negative entries treated as 0
    var L = num(spanInput);
    var P = num(pitchInput);
    var Oh = num(overhangInput);
    var BL = num(lengthInput);
    var Sc = num(spacingInput); // inches

    var Run = L / 2;
    var Rise = Run * (P / 12);
    var Rafter = Math.sqrt(Run * Run + Rise * Rise);
    var OverhangDrop = Oh * (P / 12);
    var RafterWithOverhang = Math.sqrt(Math.pow(Run + Oh, 2) + Math.pow(Rise + OverhangDrop, 2));
    var TotalWidth = L + 2 * Oh;

    // trusses = spaces + 1; work in inches and allow for floating-point error (e.g. 480 / 19.2)
    var qty = BL > 0 && Sc > 0 ? Math.ceil(BL * 12 / Sc - 1e-9) + 1 : 0;

    function ft(v) { return v.toFixed(2) + " ft"; }
    resultsBody.innerHTML =
      "<tr><td>Building Span</td><td>L</td><td>Input</td><td>" + ft(L) + "</td></tr>" +
      "<tr><td>Roof Pitch</td><td>P</td><td>Input</td><td>" + P + " / 12</td></tr>" +
      "<tr><td>Run</td><td>R</td><td>L / 2</td><td>" + ft(Run) + "</td></tr>" +
      "<tr><td>Rise (Height)</td><td>H</td><td>R &times; (P / 12)</td><td>" + ft(Rise) + "</td></tr>" +
      "<tr><td>Top Chord (Clear)</td><td>C</td><td>&radic;(R&sup2; + H&sup2;)</td><td>" + ft(Rafter) + "</td></tr>" +
      "<tr><td>Top Chord (Total)</td><td>C<sub>t</sub></td><td>incl. overhang</td><td>" + ft(RafterWithOverhang) + "</td></tr>" +
      "<tr><td>Total Truss Width</td><td>W<sub>t</sub></td><td>L + 2(Oh)</td><td>" + ft(TotalWidth) + "</td></tr>";

    outBl.textContent = BL.toFixed(2);
    outSp.textContent = Sc.toFixed(1);
    outQty.textContent = qty;

    draw(type, L, Rise, Oh, OverhangDrop);
  }

  function draw(type, L, Rise, Oh, OverhangDrop) {
    svg.innerHTML = "";
    if (L <= 0) return;
    var scale = 100 / L;
    var sRise = Rise * scale, sOh = Oh * scale, sOhDrop = OverhangDrop * scale;
    svg.setAttribute("viewBox", [-sOh - 5, -sRise - 5, 100 + 2 * sOh + 10, sRise + sOhDrop + 10].join(" "));

    function line(x1, y1, x2, y2, outline) {
      var l = document.createElementNS(NS, "line");
      l.setAttribute("x1", x1); l.setAttribute("y1", y1); l.setAttribute("x2", x2); l.setAttribute("y2", y2);
      l.setAttribute("class", outline ? "truss-member truss-outline" : "truss-member");
      svg.appendChild(l);
    }

    var leftSup = { x: 0, y: 0 }, rightSup = { x: 100, y: 0 }, apex = { x: 50, y: -sRise };
    var leftEave = { x: -sOh, y: sOhDrop }, rightEave = { x: 100 + sOh, y: sOhDrop };

    if (type === "scissor") {
      var botApex = { x: 50, y: -sRise / 2 };
      line(leftSup.x, leftSup.y, botApex.x, botApex.y, true);
      line(rightSup.x, rightSup.y, botApex.x, botApex.y, true);
    } else {
      line(leftSup.x, leftSup.y, rightSup.x, rightSup.y, true);
    }
    line(leftEave.x, leftEave.y, apex.x, apex.y, true);
    line(rightEave.x, rightEave.y, apex.x, apex.y, true);

    if (Oh > 0) {
      line(leftEave.x, leftEave.y, leftEave.x, 0, false);
      line(leftEave.x, 0, leftSup.x, leftSup.y, false);
      line(rightEave.x, rightEave.y, rightEave.x, 0, false);
      line(rightEave.x, 0, rightSup.x, rightSup.y, false);
    }

    var b1, b2, b3, t1, t2, t3;
    if (type === "fink") {
      b1 = 33.3; b2 = 66.6; t1 = { x: 25, y: -sRise / 2 }; t2 = { x: 75, y: -sRise / 2 };
      line(leftSup.x, leftSup.y, b1, 0);
      line(t1.x, t1.y, b1, 0);
      line(b1, 0, apex.x, apex.y);
      line(apex.x, apex.y, b2, 0);
      line(b2, 0, t2.x, t2.y);
    } else if (type === "howe") {
      b1 = 25; b2 = 50; b3 = 75; t1 = { x: 25, y: -sRise / 2 }; t3 = { x: 75, y: -sRise / 2 };
      // verticals at the quarter points; diagonals slope down from the top-chord panel points to mid-span (Howe)
      line(b2, 0, apex.x, apex.y);
      line(b1, 0, t1.x, t1.y);
      line(b3, 0, t3.x, t3.y);
      line(t1.x, t1.y, b2, 0);
      line(t3.x, t3.y, b2, 0);
    } else if (type === "king") {
      line(50, 0, apex.x, apex.y);
    } else if (type === "queen") {
      b1 = 33.3; b2 = 66.6; t1 = { x: 33.3, y: -sRise * (2 / 3) }; t2 = { x: 66.6, y: -sRise * (2 / 3) };
      line(b1, 0, t1.x, t1.y);
      line(b2, 0, t2.x, t2.y);
      line(t1.x, t1.y, t2.x, t2.y);
    } else if (type === "scissor") {
      var ba = { x: 50, y: -sRise / 2 };
      line(ba.x, ba.y, apex.x, apex.y);
      line(25, -sRise / 4, 25, -sRise / 2);
      line(75, -sRise / 4, 75, -sRise / 2);
    } else if (type === "attic") {
      var w1 = 30, w2 = 70, h = -sRise * 0.6, ty = -sRise * 0.7;
      line(w1, 0, w1, h);
      line(w2, 0, w2, h);
      line(35, ty, 65, ty);
      line(w1, h, 35, ty);
      line(w2, h, 65, ty);
      line(0, 0, w1, 0);
      line(w1, 0, w1, h);
    }

    function support(x, y) {
      var poly = document.createElementNS(NS, "polygon");
      poly.setAttribute("points", x + "," + y + " " + (x - 3) + "," + (y + 4) + " " + (x + 3) + "," + (y + 4));
      poly.setAttribute("fill", "none");
      poly.setAttribute("stroke-width", "0.5");
      svg.appendChild(poly);
      line(x - 4, y + 4, x + 4, y + 4);
    }
    support(leftSup.x, leftSup.y);
    support(rightSup.x, rightSup.y);
  }

  [typeSelect, spanInput, pitchInput, overhangInput, lengthInput, spacingInput].forEach(function (el) {
    el.addEventListener("input", update);
    el.addEventListener("change", update);
  });
  update();
})();
