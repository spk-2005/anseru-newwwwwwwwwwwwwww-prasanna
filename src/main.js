import "./index.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ── Asset imports ────────────────────────────────────────────────────────────
import noiseSrc from "./assets/noise.png";

function applyAssets() {
  document.querySelectorAll(".noise-overlay").forEach((el) => {
    el.style.backgroundImage = `url(${noiseSrc})`;
    el.style.backgroundSize = "200px 200px";
  });
}


// ── Carousel ──────────────────────────────────────────────────────────────────
const SLIDE_COUNT = 4;

function updateCarouselIndicators(activeSlide) {
  ["carousel-indicators-mobile", "carousel-indicators-desktop"].forEach(
    (id) => {
      const container = document.getElementById(id);
      if (!container) return;
      container.querySelectorAll(".carousel-ind-btn").forEach((btn) => {
        const isActive = Number(btn.dataset.idx) === activeSlide;
        btn.className = `carousel-ind-btn text-[13px] sm:text-[15px] font-medium transition-colors cursor-pointer px-3 sm:px-4 py-2 rounded-full ${isActive ? "text-black bg-gray-100" : "text-gray-400 hover:text-gray-600"}`;
      });
    },
  );
}

function initCarouselIndicators(containerId, goTo) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.querySelectorAll(".carousel-ind-btn").forEach((btn) => {
    btn.addEventListener("click", () => goTo(Number(btn.dataset.idx)));
  });
}

window.scrollToMobileSlide = function (index) {
  const container = document.getElementById("carousel-mobile-gsap");
  if (!container) return;
  // Use absolute document math to prevent nested offset bugs
  const absoluteTop = container.getBoundingClientRect().top + window.scrollY;
  const scrollTarget = absoluteTop + (index * window.innerHeight);
  
  window.scrollTo({
    top: scrollTarget,
    behavior: "smooth"
  });
};



function initDesktopCarousel() {
  const container = document.getElementById("carousel-desktop");
  const strip = document.getElementById("carousel-strip");
  if (!container || !strip) return;

  const slides = 4;

  let mm = gsap.matchMedia();
  mm.add("(min-width: 1024px)", () => {
    ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "bottom bottom",
      scrub: 1, // Smooth scrolling
      snap: {
        snapTo: 1 / 3, // Snap to index (4 slides = 3 durations)
        duration: { min: 0.2, max: 0.5 },
        delay: 0.1,
        ease: "power1.inOut"
      },
      onUpdate: (self) => {
        // 1. Move the strip horizontally
        const xMove = -self.progress * 75; // moves from 0 to -75% of the 400vw width
        gsap.to(strip, { xPercent: xMove, duration: 0.1, overwrite: "auto" });

        // 2. Update Progress Bars continuously
        for (let i = 0; i < slides; i++) {
          const fillBar = document.getElementById(`prog-${i}`);
          if (fillBar) {
            // Calculate the exact fractional completion of this segment
            const segmentProgress = Math.max(0, Math.min(1, (self.progress * slides) - i));
            fillBar.style.width = `${segmentProgress * 100}%`;
          }
        }

        // 3. Fade the "Scroll Down" indicator out on the last slide
        const scrollDown = document.querySelector(".scroll-down-container");
        if (scrollDown) {
          scrollDown.style.opacity = self.progress > 0.9 ? 0 : 1;
        }
      },
    });
  });
}

window.scrollToDesktopSlide = function (index) {
  const container = document.getElementById("carousel-desktop");
  if (!container) return;
  // Use absolute document math to prevent nested offset bugs
  const absoluteTop = container.getBoundingClientRect().top + window.scrollY;
  const scrollTarget = absoluteTop + (index * window.innerHeight);
  
  window.scrollTo({
    top: scrollTarget,
    behavior: "smooth"
  });
};
function offsetHero() {
  const navbar = document.getElementById('navbar');
  const heroContent = document.getElementById('hero-content');
  if (navbar && heroContent) {
    const navH = navbar.offsetHeight;
    heroContent.style.top = navH + 'px';
    heroContent.style.bottom = '0';
  }
}
document.addEventListener('DOMContentLoaded', offsetHero);
window.addEventListener('resize', offsetHero);
// ── Two Agents ────────────────────────────────────────────────────────────────
window.switchAgent = function (name) {
  document
    .getElementById("mobile-agent-archer")
    .classList.toggle("hidden", name !== "archer");
  document
    .getElementById("mobile-agent-knox")
    .classList.toggle("hidden", name !== "knox");
  ["archer", "knox"].forEach((a) => {
    const tab = document.getElementById(`tab-${a}`);
    const icon = tab.querySelector("img");
    if (a === name) {
      tab.className = tab.className.replace(
        "bg-transparent text-black hover:bg-gray-200",
        "bg-black text-white",
      );
      icon.classList.add("brightness-0", "invert");
    } else {
      tab.className = tab.className.replace(
        "bg-black text-white",
        "bg-transparent text-black hover:bg-gray-200",
      );
      icon.classList.remove("brightness-0", "invert");
    }
  });
};

function initDesktopTwoAgents() {
  const strip = document.getElementById("two-agents-strip");
  if (!strip) return;

  let activeAgent = 0;

  function updateDesktopTabs(idx) {
    ["archer", "knox"].forEach((name, i) => {
      const tab = document.getElementById(`desk-tab-${name}`);
      const icon = tab.querySelector("img");
      if (i === idx) {
        tab.className = tab.className.replace(
          "bg-transparent text-black hover:bg-gray-200",
          "bg-black text-white",
        );
        icon.classList.add("brightness-0", "invert");
      } else {
        tab.className = tab.className.replace(
          "bg-black text-white",
          "bg-transparent text-black hover:bg-gray-200",
        );
        icon.classList.remove("brightness-0", "invert");
      }
    });
  }

  window.desktopGoToAgent = function (index) {
    const cont = document.getElementById("two-agents-desktop");
    if (!cont) return;
    window.scrollTo({
      top: cont.offsetTop + index * window.innerHeight,
      behavior: "smooth",
    });
  };

  const cont = document.getElementById("two-agents-desktop");
  let mm = gsap.matchMedia();
  mm.add("(min-width: 1024px)", () => {
    ScrollTrigger.create({
      trigger: cont,
      start: "top top",
      end: "bottom bottom",
      onUpdate(self) {
        gsap.set(strip, { xPercent: -self.progress * 50 });
        const idx = Math.round(self.progress);
        if (idx !== activeAgent) {
          activeAgent = idx;
          updateDesktopTabs(idx);
        }
      },
    });
  });
}

// ── RFP Workflow SVG ─────────────────────────────────────────────────────────
const rfpNodes = [
  {
    title: "Proposal Architecture",
    desc: "Generate a structured proposal outline and response flow.",
    angle: 0,
    tx: -100,
    ty: -85,
    g1: "#6DA8EF",
    g2: "#F3E21F",
  },
  {
    title: "First Winnable Draft",
    desc: "Generate contextual first drafts using enterprise knowledge.",
    angle: 40,
    tx: 35,
    ty: -65,
    g1: "#320a6a",
    g2: "#5713d0",
  },
  {
    title: "SME Collaboration",
    desc: "Route complex responses to subject matter experts for review.",
    angle: 80,
    tx: 43,
    ty: -25,
    g1: "#201CAE",
    g2: "#6AA4EE",
  },
  {
    title: "Final Proposal",
    desc: "Deliver a polished proposal ready for submission.",
    angle: 120,
    tx: 45,
    ty: -10,
    g1: "#fe3f49",
    g2: "#49abf5",
  },
  {
    title: "Win–Loss Capture",
    desc: "Capture deal outcomes and key insights automatically.",
    angle: 160,
    tx: 40,
    ty: 20,
    g1: "#6DA8EF",
    g2: "#F3E21F",
  },
  {
    title: "Smarter Next Deal",
    desc: "Feed insights back to improve future responses iteratively.",
    angle: 200,
    tx: -95,
    ty: 60,
    g1: "#fe3f49",
    g2: "#49abf5",
  },
  {
    title: "RFP Decomposition",
    desc: "Break complex RFPs and extract key requirements into structured sections.",
    angle: 240,
    tx: -270,
    ty: -5,
    g1: "#367AE6",
    g2: "#CE5575",
  },
  {
    title: "Deal Qualification",
    desc: "Evaluate fit, assess win probability, and decide whether to pursue.",
    angle: 280,
    tx: -240,
    ty: -30,
    g1: "#201CAE",
    g2: "#6AA4EE",
  },
  {
    title: "Requirement Intelligence",
    desc: "Categorize questions, tag by topic, and route to the right teams.",
    angle: 320,
    tx: -220,
    ty: -70,
    g1: "#367AE6",
    g2: "#CE5575",
  },
];

const CX = 550,
  CY = 530,
  R = 280,
  NR = 22,
  NUM_TICKS = 400;

function polar(cx, cy, r, deg) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function buildRFPWorkflow() {
  const container = document.getElementById("rfp-workflow-svg-container");
  if (!container) return;

  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("viewBox", "0 150 1100 800");
  svg.style.cssText =
    "display:block;width:100%;max-width:1100px;margin:0 auto;padding-top:80px;background:transparent";

  // defs
  const defs = document.createElementNS(ns, "defs");
  rfpNodes.forEach((n, i) => {
    const lg = document.createElementNS(ns, "linearGradient");
    lg.setAttribute("id", `rfpg${i}`);
    lg.setAttribute("x1", "0%");
    lg.setAttribute("y1", "0%");
    lg.setAttribute("x2", "0%");
    lg.setAttribute("y2", "100%");
    ["stop", "stop"].forEach((_, si) => {
      const s = document.createElementNS(ns, "stop");
      s.setAttribute("offset", si === 0 ? "0%" : "100%");
      s.setAttribute("stop-color", si === 0 ? n.g1 : n.g2);
      lg.appendChild(s);
    });
    defs.appendChild(lg);
  });
  const filt = document.createElementNS(ns, "filter");
  filt.setAttribute("id", "rfpglow");
  filt.setAttribute("x", "-50%");
  filt.setAttribute("y", "-50%");
  filt.setAttribute("width", "200%");
  filt.setAttribute("height", "200%");
  const blur = document.createElementNS(ns, "feGaussianBlur");
  blur.setAttribute("stdDeviation", "5");
  blur.setAttribute("result", "coloredBlur");
  const merge = document.createElementNS(ns, "feMerge");
  ["coloredBlur", "SourceGraphic"].forEach((v) => {
    const n = document.createElementNS(ns, "feMergeNode");
    if (v === "coloredBlur") n.setAttribute("in", v);
    merge.appendChild(n);
  });
  filt.appendChild(blur);
  filt.appendChild(merge);
  defs.appendChild(filt);
  ["arrow-outer", "arrow-inner"].forEach((id, i) => {
    const m = document.createElementNS(ns, "marker");
    m.setAttribute("id", id);
    m.setAttribute("viewBox", "0 0 10 10");
    m.setAttribute("refX", "8");
    m.setAttribute("refY", "5");
    m.setAttribute("markerWidth", "6");
    m.setAttribute("markerHeight", "6");
    m.setAttribute("orient", "auto-start-reverse");
    const p = document.createElementNS(ns, "path");
    p.setAttribute("d", "M 0 1 L 10 5 L 0 9 z");
    p.setAttribute("fill", i === 0 ? "#4f46e5" : "#8b5cf6");
    m.appendChild(p);
    defs.appendChild(m);
  });
  svg.appendChild(defs);

  const t1 = document.createElementNS(ns, "text");
  t1.setAttribute("x", CX);
  t1.setAttribute("y", CY - 12);
  t1.setAttribute("font-family", "DM Sans");
  t1.setAttribute("text-anchor", "middle");
  t1.setAttribute("font-size", "38");
  t1.setAttribute("fill", "#111827");
  t1.setAttribute("font-weight", "400");
  t1.textContent = "End-to-End";
  const t2 = document.createElementNS(ns, "text");
  t2.setAttribute("x", CX);
  t2.setAttribute("y", CY + 38);
  t2.setAttribute("font-family", "DM Sans");
  t2.setAttribute("text-anchor", "middle");
  t2.setAttribute("font-size", "48");
  t2.setAttribute("fill", "#1C32E6");
  t2.setAttribute("font-weight", "400");
  t2.setAttribute("letter-spacing", "-0.5");
  t2.textContent = "Deal Intelligence";
  svg.appendChild(t1);
  svg.appendChild(t2);

  const tickG = document.createElementNS(ns, "g");
  tickG.setAttribute("opacity", "0.8");
  for (let i = 0; i < NUM_TICKS; i++) {
    const a = (i * 360) / NUM_TICKS;
    const s = polar(CX, CY, R - 2, a),
      e = polar(CX, CY, R + 2, a);
    const line = document.createElementNS(ns, "line");
    line.setAttribute("x1", s.x);
    line.setAttribute("y1", s.y);
    line.setAttribute("x2", e.x);
    line.setAttribute("y2", e.y);
    line.setAttribute("stroke", "#6b7280");
    line.setAttribute("stroke-width", "1");
    line.setAttribute("stroke-linecap", "round");
    tickG.appendChild(line);
  }
  svg.appendChild(tickG);

  const outerS = polar(CX, CY, 310, 206),
    outerE = polar(CX, CY, 310, 234);
  const innerS = polar(CX, CY, 250, 234),
    innerE = polar(CX, CY, 250, 206);
  const pa1 = document.createElementNS(ns, "path");
  pa1.setAttribute(
    "d",
    `M ${outerS.x} ${outerS.y} A 310 310 0 0 1 ${outerE.x} ${outerE.y}`,
  );
  pa1.setAttribute("fill", "none");
  pa1.setAttribute("stroke", "#4f46e5");
  pa1.setAttribute("stroke-width", "1");
  pa1.setAttribute("stroke-dasharray", "4 4");
  pa1.setAttribute("marker-end", "url(#arrow-outer)");
  const pa2 = document.createElementNS(ns, "path");
  pa2.setAttribute(
    "d",
    `M ${innerS.x} ${innerS.y} A 250 250 0 0 0 ${innerE.x} ${innerE.y}`,
  );
  pa2.setAttribute("fill", "none");
  pa2.setAttribute("stroke", "#8b5cf6");
  pa2.setAttribute("stroke-width", "1");
  pa2.setAttribute("stroke-dasharray", "4 4");
  pa2.setAttribute("marker-end", "url(#arrow-inner)");
  svg.appendChild(pa1);
  svg.appendChild(pa2);

  const nodeGroups = rfpNodes.map((node, i) => {
    const p = polar(CX, CY, R, node.angle);
    const g = document.createElementNS(ns, "g");

    const glow = document.createElementNS(ns, "circle");
    glow.setAttribute("cx", p.x);
    glow.setAttribute("cy", p.y);
    glow.setAttribute("r", NR + 10);
    glow.setAttribute("fill", "none");
    glow.setAttribute("stroke", node.g1);
    glow.setAttribute("stroke-width", "3");
    glow.setAttribute("opacity", "0");
    glow.style.transition = "all 0.6s ease-in-out";

    const mask = document.createElementNS(ns, "circle");
    mask.setAttribute("cx", p.x);
    mask.setAttribute("cy", p.y);
    mask.setAttribute("r", NR);
    mask.setAttribute("fill", "#F7F7F7");
    mask.style.transition = "all 0.6s ease-in-out";

    const ball = document.createElementNS(ns, "circle");
    ball.setAttribute("cx", p.x);
    ball.setAttribute("cy", p.y);
    ball.setAttribute("r", NR);
    ball.setAttribute("fill", `url(#rfpg${i})`);
    ball.setAttribute("opacity", "0.4");
    ball.style.transition = "all 0.6s ease-in-out";

    const words = node.desc.split(" ");
    const mid = Math.ceil(words.length / 2);
    const tg = document.createElementNS(ns, "g");
    tg.setAttribute(
      "transform",
      `translate(${p.x + node.tx},${p.y + node.ty})`,
    );
    tg.style.transition = "opacity 0.6s ease-in-out";
    tg.style.opacity = "0.6";

    const titleT = document.createElementNS(ns, "text");
    titleT.setAttribute("x", "0");
    titleT.setAttribute("y", "0");
    titleT.setAttribute("font-size", "14");
    titleT.setAttribute("fill", "#111827");
    titleT.setAttribute("font-weight", "400");
    titleT.textContent = node.title;

    const d1 = document.createElementNS(ns, "text");
    d1.setAttribute("x", "0");
    d1.setAttribute("y", "22");
    d1.setAttribute("font-size", "13");
    d1.setAttribute("fill", "#6b7280");
    d1.setAttribute("dominant-baseline", "middle");
    d1.textContent = words.slice(0, mid).join(" ");

    const d2 = document.createElementNS(ns, "text");
    d2.setAttribute("x", "0");
    d2.setAttribute("y", "40");
    d2.setAttribute("font-size", "13");
    d2.setAttribute("fill", "#6b7280");
    d2.setAttribute("dominant-baseline", "middle");
    d2.textContent = words.slice(mid).join(" ");

    tg.appendChild(titleT);
    tg.appendChild(d1);
    tg.appendChild(d2);
    g.appendChild(glow);
    g.appendChild(mask);
    g.appendChild(ball);
    g.appendChild(tg);
    svg.appendChild(g);
    return { glow, mask, ball, tg };
  });

  container.appendChild(svg);

  let activeNode = 0;
  function updateNodes(idx) {
    nodeGroups.forEach((ng, i) => {
      const isActive = i === idx;
      ng.glow.setAttribute("r", isActive ? NR + 10 + 4 : NR + 10);
      ng.glow.setAttribute("opacity", isActive ? "0.6" : "0");
      ng.mask.setAttribute("r", isActive ? NR + 4 : NR);
      ng.ball.setAttribute("r", isActive ? NR + 4 : NR);
      
      // Node is gray when inactive, full gradient color only when active
      ng.ball.setAttribute("fill", isActive ? `url(#rfpg${i})` : "#E5E7EB");
      ng.ball.setAttribute("opacity", "1");
      
      if (isActive) ng.ball.setAttribute("filter", "url(#rfpglow)");
      else ng.ball.removeAttribute("filter");
      ng.tg.style.opacity = isActive ? "1" : "0.5";
    });
  }
  updateNodes(0);
  setInterval(() => {
    activeNode = (activeNode + 1) % rfpNodes.length;
    updateNodes(activeNode);
  }, 2000);
}

// ── FAQ ───────────────────────────────────────────────────────────────────────
function initFAQ() {
  let openIndex = null;
  const items = document.querySelectorAll(".faq-item");
  
  items.forEach((item, idx) => {
    item._idx = idx; 
    item.querySelector(".faq-trigger").addEventListener("click", () => {
      const isOpen = openIndex === idx;
      
      if (openIndex !== null && openIndex !== idx) {
        // Closing previous item
        const prev = items[openIndex];
        const prevAns = prev.querySelector(".faq-answer");
        const prevInner = prevAns.firstElementChild;
        
        const curW = prev.getBoundingClientRect().width;
        prev.style.transition = "none";
        prev.style.width = "fit-content";
        const targetW = prev.getBoundingClientRect().width;
        prev.style.width = curW + "px";
        
        prevAns.style.transition = "none";
        prevAns.style.maxHeight = prevAns.scrollHeight + "px";
        
        // Prevent text squishing
        if (prevInner) prevInner.style.width = curW + "px";
        
        prev.offsetHeight; // flush
        
        prev.style.transition = "width 0.4s cubic-bezier(0.04,0.62,0.23,0.98)";
        prevAns.style.transition = "max-height 0.4s cubic-bezier(0.04,0.62,0.23,0.98), opacity 0.3s ease";
        prev.style.width = targetW + "px";
        prevAns.style.maxHeight = "0px";
        prevAns.style.opacity = "0";
        prev.querySelector(".faq-icon").textContent = "+";
        
        setTimeout(() => {
          if (openIndex !== prev._idx) {
             prev.style.width = "";
             if (prevInner) prevInner.style.width = "";
          }
        }, 400);
      }
      
      openIndex = isOpen ? null : idx;
      const ans = item.querySelector(".faq-answer");
      const inner = ans.firstElementChild;
      
      if (!isOpen) {
        // Opening current item
        const curW = item.getBoundingClientRect().width;
        
        item.style.transition = "none";
        ans.style.transition = "none";
        item.style.width = "100%";
        ans.style.maxHeight = "none";
        if (inner) inner.style.width = ""; // ensure it takes 100%
        
        const targetW = item.getBoundingClientRect().width;
        const targetH = ans.scrollHeight;
        
        item.style.width = curW + "px";
        ans.style.maxHeight = "0px";
        
        if (inner) inner.style.width = targetW + "px";
        item.offsetHeight; // flush
        
        item.style.transition = "width 0.4s cubic-bezier(0.04,0.62,0.23,0.98)";
        ans.style.transition = "max-height 0.4s cubic-bezier(0.04,0.62,0.23,0.98), opacity 0.4s ease";
        item.style.width = targetW + "px";
        ans.style.maxHeight = targetH + "px";
        ans.style.opacity = "1";
        item.querySelector(".faq-icon").textContent = "−";
        
        setTimeout(() => {
          if (openIndex === idx) {
            item.style.width = "100%";
            ans.style.maxHeight = "1500px";
            if (inner) inner.style.width = "";
          }
        }, 400);
        
      } else {
        // Closing current item
        const curW = item.getBoundingClientRect().width;
        
        item.style.transition = "none";
        item.style.width = "fit-content";
        const targetW = item.getBoundingClientRect().width;
        item.style.width = curW + "px";
        
        ans.style.transition = "none";
        ans.style.maxHeight = ans.scrollHeight + "px";
        if (inner) inner.style.width = curW + "px";
        
        item.offsetHeight; // flush
        
        item.style.transition = "width 0.4s cubic-bezier(0.04,0.62,0.23,0.98)";
        ans.style.transition = "max-height 0.4s cubic-bezier(0.04,0.62,0.23,0.98), opacity 0.3s ease";
        
        item.style.width = targetW + "px";
        ans.style.maxHeight = "0px";
        ans.style.opacity = "0";
        item.querySelector(".faq-icon").textContent = "+";
        
        setTimeout(() => {
          if (openIndex !== idx) {
            item.style.width = "";
            if (inner) inner.style.width = "";
          }
        }, 400);
      }
    });
  });
}

// ── Features hover expand ─────────────────────────────────────────────────────
function initFeatures() {
  const cards = document.querySelectorAll(".feature-card");
  const isPointer = () => window.matchMedia("(hover: hover)").matches;
  cards.forEach((card, idx) => {
    function activate() {
      if (!isPointer()) return;
      cards.forEach((c, i) => {
        const isThis = i === idx;
        c.style.flex = isThis ? "2" : "1";
        const s = c.querySelector(".feature-short");
        const l = c.querySelector(".feature-long");
        const b = c.querySelector(".feature-bullets");
        const t = c.querySelector(".feature-text");
        if (s) s.classList.toggle("hidden", isThis);
        if (l) l.classList.toggle("hidden", !isThis);
        if (b) {
          b.style.gridTemplateRows = isThis ? "1fr" : "0fr";
          b.style.opacity = isThis ? "1" : "0";
          b.style.marginTop = isThis ? "1.5rem" : "0";
        }
        if (t) {
          if (isThis) t.classList.add("pl-12", "md:pl-16");
          else t.classList.remove("pl-12", "md:pl-16");
        }
      });
    }
    function deactivate() {
      if (!isPointer()) return;
      cards.forEach((c) => {
        c.style.flex = "1";
        const s = c.querySelector(".feature-short");
        const l = c.querySelector(".feature-long");
        const b = c.querySelector(".feature-bullets");
        const t = c.querySelector(".feature-text");
        if (s) s.classList.remove("hidden");
        if (l) l.classList.add("hidden");
        if (b) {
          b.style.gridTemplateRows = "0fr";
          b.style.opacity = "0";
          b.style.marginTop = "0";
        }
        if (t) t.classList.remove("pl-12", "md:pl-16");
      });
    }
    card.addEventListener("mouseenter", activate);
    card.addEventListener("mouseleave", deactivate);
  });
}

// ── Navbar mobile menu ────────────────────────────────────────────────────────
function initNavbar() {
  const btn = document.getElementById("mobile-menu-btn");
  const menu = document.getElementById("mobile-menu");
  const iconOpen = document.getElementById("menu-icon-open");
  const iconClose = document.getElementById("menu-icon-close");
  if (!btn || !menu || !iconOpen || !iconClose) return;
  btn.addEventListener("click", () => {
    const isOpen = !menu.classList.contains("hidden");
    menu.classList.toggle("hidden", isOpen);
    iconOpen.classList.toggle("hidden", !isOpen);
    iconClose.classList.toggle("hidden", isOpen);
  });
}

window.closeMobileMenu = function () {
  const menu = document.getElementById("mobile-menu");
  const iconOpen = document.getElementById("menu-icon-open");
  const iconClose = document.getElementById("menu-icon-close");
  if (menu) menu.classList.add("hidden");
  if (iconOpen) iconOpen.classList.remove("hidden");
  if (iconClose) iconClose.classList.add("hidden");
};

// ── Section scroll helper ─────────────────────────────────────────────────────
window.scrollToSection = function (id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

// ── 3D flip cards ────────────────────────────────────────────────────────────
function initFlipCards() {
  document.querySelectorAll(".team-card").forEach((card) => {
    card.addEventListener("click", () => {
      if (window.matchMedia("(hover: hover)").matches) return;
      card.classList.toggle("flipped");
    });
  });
}

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  applyAssets();
  initNavbar();
  initFlipCards();

  initDesktopCarousel();
  initDesktopTwoAgents();
  buildRFPWorkflow();
  initFAQ();
  initFeatures();
});
