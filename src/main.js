import "./index.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ── Asset imports ────────────────────────────────────────────────────────────
import noiseSrc from "./assets/noise.png";
import vectorSrc from "./assets/Vector copy.png";
const anseruIconSrc = vectorSrc; // same file, used as center watermark

function applyAssets() {
  document.querySelectorAll(".noise-overlay").forEach((el) => {
    el.style.backgroundImage = `url(${noiseSrc})`;
    el.style.backgroundSize = "200px 200px";
  });
}


// ── Carousel ──────────────────────────────────────────────────────────────────
const SLIDE_COUNT = 4;

/**
 * Update both sets of indicator buttons (mobile + desktop) to reflect
 * the currently active slide index.
 */
function updateCarouselIndicators(activeSlide) {
  ["carousel-indicators-mobile", "carousel-indicators-desktop"].forEach((id) => {
    const container = document.getElementById(id);
    if (!container) return;
    container.querySelectorAll(".carousel-ind-btn").forEach((btn) => {
      const isActive = Number(btn.dataset.idx) === activeSlide;
      btn.className = `carousel-ind-btn text-[13px] sm:text-[15px] font-medium transition-colors cursor-pointer px-3 sm:px-4 py-2 rounded-full ${isActive ? "text-black bg-gray-100" : "text-gray-400 hover:text-gray-600"
        }`;
    });
  });
}

/**
 * Update the dot indicators below the mobile scroll carousel.
 */
function updateMobileDots(activeSlide) {
  const container = document.getElementById("carousel-dots-mobile");
  if (!container) return;
  container.querySelectorAll(".carousel-dot").forEach((dot) => {
    const isActive = Number(dot.dataset.dot) === activeSlide;
    dot.className = `carousel-dot rounded-full transition-all duration-300 ${isActive ? "w-5 h-2 bg-gray-700" : "w-2 h-2 bg-gray-300"
      }`;
  });
}

// ── Mobile carousel (scroll-snap track) ──────────────────────────────────────
function initMobileCarousel() {
  const track = document.getElementById("carousel-mobile-track");
  if (!track) return;

  let currentSlide = 0;

  // Scroll to a given slide index by moving the track's scroll position
  function goToSlide(index) {
    index = Math.max(0, Math.min(SLIDE_COUNT - 1, index));
    track.scrollTo({ left: index * track.clientWidth, behavior: "smooth" });
  }

  // Keep indicators in sync as the user scrolls (or snaps)
  track.addEventListener(
    "scroll",
    () => {
      const idx = Math.round(track.scrollLeft / track.clientWidth);
      if (idx !== currentSlide) {
        currentSlide = idx;
        updateCarouselIndicators(idx);
        updateMobileDots(idx);
      }
    },
    { passive: true }
  );

  // Wire up the pill indicator buttons (Connect / Upload / Respond / Approve)
  const mobileIndicators = document.getElementById("carousel-indicators-mobile");
  if (mobileIndicators) {
    mobileIndicators.querySelectorAll(".carousel-ind-btn").forEach((btn) => {
      btn.addEventListener("click", () => goToSlide(Number(btn.dataset.idx)));
    });
  }

  // Wire up the dot buttons below the track
  const dotsContainer = document.getElementById("carousel-dots-mobile");
  if (dotsContainer) {
    dotsContainer.querySelectorAll(".carousel-dot").forEach((dot) => {
      dot.addEventListener("click", () => goToSlide(Number(dot.dataset.dot)));
    });
  }

  // Paint the initial state
  updateCarouselIndicators(0);
  updateMobileDots(0);
}

// ── Desktop carousel (sticky horizontal scroll strip) ────────────────────────
function initDesktopCarousel() {
  const container = document.getElementById("carousel-desktop");
  const strip = document.getElementById("carousel-strip");
  if (!container || !strip) return;

  // Scroll the strip programmatically when a pill button is clicked
  function goToSlide(index) {
    index = Math.max(0, Math.min(SLIDE_COUNT - 1, index));
    strip.scrollTo({ left: index * window.innerWidth, behavior: "smooth" });
  }

  // Update indicators as the strip scrolls
  strip.addEventListener(
    "scroll",
    () => {
      const scrollLeft = strip.scrollLeft;
      const activeSlide = Math.round(scrollLeft / window.innerWidth);
      updateCarouselIndicators(activeSlide);

      // Progress bars (if present)
      for (let i = 0; i < SLIDE_COUNT; i++) {
        const fillBar = document.getElementById(`prog-${i}`);
        if (fillBar) {
          const fill = Math.max(0, Math.min(1, scrollLeft / window.innerWidth - i));
          fillBar.style.width = `${fill * 100}%`;
        }
      }
    },
    { passive: true }
  );

  // Wire up the desktop pill indicator buttons
  const desktopIndicators = document.getElementById("carousel-indicators-desktop");
  if (desktopIndicators) {
    desktopIndicators.querySelectorAll(".carousel-ind-btn").forEach((btn) => {
      btn.addEventListener("click", () => goToSlide(Number(btn.dataset.idx)));
    });
  }

  // Expose for any inline onclick usage
  window.scrollToDesktopSlide = goToSlide;

  // Paint initial state
  strip.dispatchEvent(new Event("scroll"));
}

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

// ── FAQ ───────────────────────────────────────────────────────────────────────
function initFAQ() {
  let openIndex = null;
  const items = document.querySelectorAll(".faq-item");

  items.forEach((item, idx) => {
    item._idx = idx;
    item.querySelector(".faq-trigger").addEventListener("click", () => {
      const isOpen = openIndex === idx;

      if (openIndex !== null && openIndex !== idx) {
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

        if (prevInner) prevInner.style.width = curW + "px";

        prev.offsetHeight;

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
        const curW = item.getBoundingClientRect().width;

        item.style.transition = "none";
        ans.style.transition = "none";
        item.style.width = "100%";
        ans.style.maxHeight = "none";
        if (inner) inner.style.width = "";

        const targetW = item.getBoundingClientRect().width;
        const targetH = ans.scrollHeight;

        item.style.width = curW + "px";
        ans.style.maxHeight = "0px";

        if (inner) inner.style.width = targetW + "px";
        item.offsetHeight;

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
        const curW = item.getBoundingClientRect().width;

        item.style.transition = "none";
        item.style.width = "fit-content";
        const targetW = item.getBoundingClientRect().width;
        item.style.width = curW + "px";

        ans.style.transition = "none";
        ans.style.maxHeight = ans.scrollHeight + "px";
        if (inner) inner.style.width = curW + "px";

        item.offsetHeight;

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

// ── Problem section gap elimination ──────────────────────────────────────────
function eliminateGap() {
  const pSection = document.getElementById("problem");
  const pMobileGsap = document.getElementById("problem-mobile-gsap");
  const hSection = document.getElementById("how-it-works");

  if (!pMobileGsap || !hSection) return;

  const stickyContent = pMobileGsap.querySelector(".sticky");
  if (!stickyContent) return;

  // Reset to calculate cleanly
  hSection.style.marginTop = "0px";
  hSection.style.paddingTop = "0px";

  // Only apply if we are on mobile where the 150vh layout is active
  if (window.innerWidth >= 768) return;

  const problemHeight = pMobileGsap.offsetHeight;
  const stickyHeight = stickyContent.offsetHeight;
  const gap = problemHeight - stickyHeight;

  if (gap > 0) {
    // We add margin-top to pull How It Works up so there is no gap.
    // We add padding-top so its background covers the gap, but its content starts right below the sticky element.
    hSection.style.marginTop = `-${gap}px`;
    hSection.style.paddingTop = `${gap}px`;

    // Ensure layering is correct (Problem on top during scroll)
    if (pSection) pSection.style.position = "relative";
    if (pSection) pSection.style.zIndex = "10";
    hSection.style.position = "relative";
    hSection.style.zIndex = "5";
  }
}

// ── Problem section scroll animation ───────────────────────────────────────
function initProblemCarousel() {
  ScrollTrigger.matchMedia({
    "(max-width: 767px)": function () {
      const parentWrap = document.getElementById("problem-how-wrapper");
      const pinTarget = document.getElementById("problem-pin-target");
      const track = document.getElementById("problem-carousel-track");
      if (!parentWrap || !pinTarget || !track) return;

      setTimeout(() => {
        const maxScrollDist = track.scrollWidth - window.innerWidth + 32;

        gsap.to(track, {
          x: () => -maxScrollDist,
          ease: "none",
          scrollTrigger: {
            trigger: parentWrap,
            start: "top top",
            end: () => `+=${maxScrollDist * 2}`,
            pin: true,
            scrub: 1,
            snap: {
              snapTo: 1 / 2,
              duration: 0.3,
              delay: 0.1,
              ease: "power1.inOut"
            }
          }
        });
      }, 50);
    }
  });
}
function getSlideWidth() {
  const wrapper = document.getElementById('prob-track-wrapper');
  return wrapper ? wrapper.offsetWidth : window.innerWidth;
}

function goToSlide(idx) {
  idx = Math.max(0, Math.min(SLIDES - 1, idx));
  currentIdx = idx;
  const slideWidth = getSlideWidth();
  pTrack.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  pTrack.style.transform = `translateX(-${idx * slideWidth}px)`;
  updateDots(idx);
}

window.addEventListener('resize', () => goToSlide(currentIdx));

// ── 3D flip cards ────────────────────────────────────────────────────────────
function initFlipCards() {
  document.querySelectorAll(".team-card").forEach((card) => {
    card.addEventListener("click", () => {
      card.classList.toggle("flipped");
    });
  });
}

// ── Workflow Section Animations ────────────────────────────────────────────────

// ── Assets for Workflow ──────────────────────────────────────────────────
import riAiIcon from "./assets/ri_ai.png";
import circleLogoBg from "./assets/image-circle-logo.png";
import wfIcon1 from "./assets/workflow-icon-1.png";
import wfIcon2 from "./assets/workflow-icon-2.png";
import wfIcon3 from "./assets/workflow-icon-3.png";
import wfIcon4 from "./assets/workflow-icon-4.png";
import wfIcon5 from "./assets/workflow-icon-5.png";
import wfIcon6 from "./assets/workflow-icon-6.png";
import wfIcon7 from "./assets/workflow-icon-7.png";
import wfIcon8 from "./assets/workflow-icon-8.png";
import wfIcon9 from "./assets/workflow-icon-9.png";

(function () {
  const STEPS = [
    {
      title: "RFP Decomposition",
      desc: "Break complex RFPs into structured sections and extract key requirements.",
      icon: wfIcon1,
    },
    {
      title: "Deal Qualification",
      desc: "Evaluate fit, assess win probability, and decide whether to pursue.",
      icon: wfIcon2,
    },
    {
      title: "Requirement Intelligence",
      desc: "Categorize questions, tag by topic, and route to the right teams.",
      icon: wfIcon3,
    },
    {
      title: "Proposal Architecture",
      desc: "Generate a structured proposal outline and response flow.",
      icon: wfIcon4,
    },
    {
      title: "First Winnable Draft",
      desc: "Generate contextual first drafts using enterprise knowledge.",
      icon: wfIcon5,
    },
    {
      title: "SME Collaboration",
      desc: "Route complex responses to subject matter experts for review.",
      icon: wfIcon6,
    },
    {
      title: "Final Proposal",
      desc: "Deliver a polished proposal ready for submission.",
      icon: wfIcon7,
    },
    {
      title: "Win–Loss Capture",
      desc: "Capture deal outcomes and key insights.",
      icon: wfIcon8,
    },
    {
      title: "Smarter Next Deal",
      desc: "Feed insights back to improve future responses.",
      icon: wfIcon9,
    },
  ];

  function initWorkflow() {
    const section = document.getElementById("workflow-section");
    const stepsList = document.getElementById("steps-list");
    if (!section || !stepsList) return;

    stepsList.innerHTML = ''; // no backbone — we'll draw segments between circles
    STEPS.forEach((step, i) => {
      const row = document.createElement("div");
      row.className = "step-row";
      row.innerHTML = `
        <div class="step-node-col">
          <div class="node-wrapper">
            <div class="half-ring"></div>
            <div class="node-circle">
              <img src="${step.icon}" alt="${step.title}" />
            </div>
          </div>
          ${i < STEPS.length - 1 ? `
          <div class="connector-symbols">
            
            <div class="connector-symbol symbol-left">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="7 11 12 6 17 11"></polyline>
                <polyline points="7 18 12 13 17 18"></polyline>
              </svg>
            </div>
            <div class="connector-symbol symbol-right">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="7 13 12 18 17 13"></polyline>
                <polyline points="7 6 12 11 17 6"></polyline>
              </svg>
            </div>
          </div>
          ` : ''}
        </div>
        <div class="step-body">
          <p class="step-title">${step.title}</p>
          <p class="step-desc">${step.desc}</p>
        </div>
      `;
      stepsList.appendChild(row);
    });

    // Shared helper: center of an element relative to stepsList
    const getRelativeCenter = (el) => {
      let top = 0;
      let curr = el;
      while (curr && curr !== stepsList) {
        top += curr.offsetTop;
        curr = curr.offsetParent;
      }
      return top + el.offsetHeight / 2;
    };

    // Draw inter-circle segments (line never passes through a circle)
    function positionSegments() {
      // Remove previous segments
      stepsList.querySelectorAll('.workflow-segment').forEach(s => s.remove());

      const allWrappers = stepsList.querySelectorAll('.node-wrapper');
      if (allWrappers.length < 2) return;

      const RADIUS = allWrappers[0].offsetHeight / 2; // 20px for a 40px wrapper
      const BORDER_OVERLAP = 2; // extend 2px into the half-ring border on each end

      allWrappers.forEach((wrapper, i) => {
        if (i === allWrappers.length - 1) return; // no segment after last circle
        const topCenter = getRelativeCenter(wrapper);
        const bottomCenter = getRelativeCenter(allWrappers[i + 1]);
        const segTop = topCenter + RADIUS - BORDER_OVERLAP;
        const segHeight = (bottomCenter - RADIUS + BORDER_OVERLAP) - segTop;
        if (segHeight <= 0) return;

        const seg = document.createElement('div');
        seg.className = 'workflow-segment';
        seg.dataset.segIndex = i;          // link segment to its row
        seg.style.top = `${segTop}px`;
        seg.style.height = `${segHeight}px`;
        seg.style.left = `${allWrappers[0].offsetLeft + RADIUS}px`; // center logic
        seg.style.opacity = '0.2';         // match inactive row opacity
        stepsList.appendChild(seg);
      });

      // Position connector-symbols midpoint between each pair
      const symbols = stepsList.querySelectorAll('.connector-symbols');
      symbols.forEach((sym, idx) => {
        const center1 = getRelativeCenter(allWrappers[idx]);
        const center2 = getRelativeCenter(allWrappers[idx + 1]);
        const midPoint = (center1 + center2) / 2;
        const rowTop = allWrappers[idx].closest('.step-row').offsetTop;
        sym.style.top = `${midPoint - rowTop}px`;
      });
    }

    positionSegments();


    const rows = gsap.utils.toArray(".step-row");

    // Create GSAP Timeline for pinning and sequential animation (on mobile only)
    let mm = gsap.matchMedia();
    mm.add("(max-width: 1023px)", () => {
      const GREY_GRADIENT = "radial-gradient(circle at 40% 35%, #ffffff 0%, #e8e8e8 55%, #d4d4d4 100%)";

      // Set initial states via GSAP so it fully owns these properties (avoids CSS !important conflicts)
      rows.forEach((row) => {
        const circle = row.querySelector(".node-circle");
        const icon = circle ? circle.querySelector("img") : null;
        gsap.set(row, { opacity: 0.25 });
        gsap.set(circle, { 
          backgroundImage: `url(${circleLogoBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: "transparent",
          borderColor: "#eeeeee",
          filter: "grayscale(1) opacity(0.2)",
          scale: 1 
        });
        gsap.set(icon, { opacity: 0 });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top", // Stick at the top of the screen
          end: "+=2500", // Slightly longer for 9 steps
          pin: true,
          scrub: 1, // Smoother scrub
          anticipatePin: 1,
        },
      });

      // Animate each row's opacity and the active state
      rows.forEach((row, i) => {
        const circle = row.querySelector(".node-circle");
        const ring = row.querySelector(".half-ring");
        const icon = circle.querySelector("img");
        const connector = row.querySelector(".connector-symbols");

        const startTime = i * 4;

        // Opacity of the whole row - animation should start from 0.4 to 1
        tl.to(row, {
          opacity: 1,
          duration: 2,
        }, startTime);

        // Circle image background and scale
        tl.to(circle, {
          borderColor: "transparent",
          scale: 1.1,
          filter: "grayscale(0) opacity(1)",
          duration: 2,
        }, startTime);

        // Ring keeps CSS color #D9D9D9 — no GSAP override, always matches segment

        // Animate this row's connecting segment (below it) in sync with the row
        const seg = stepsList.querySelector(`.workflow-segment[data-seg-index="${i}"]`);
        if (seg) {
          tl.to(seg, { opacity: 1, duration: 2 }, startTime);
        }

        // Icon inversion
        tl.to(icon, {
          filter: "brightness(0) invert(1)",
          opacity: 1,
          duration: 2,
        }, startTime);

        // Connector symbols opacity (if they exist)
        if (connector) {
          tl.to(connector, {
            opacity: 1,
            duration: 2,
          }, startTime);
        }
      });

      // Add a small buffer at the end
      tl.to({}, { duration: 4 });
    });
  }

  // Use a single DOMContentLoaded listener for the whole file if possible, or just this IIFE
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initWorkflow);
  } else {
    initWorkflow();
  }

  window.addEventListener("resize", () => {
    // Re-draw segments on resize
    const stepsList = document.getElementById("steps-list");
    if (!stepsList) return;

    const getRelativeCenter = (el) => {
      let top = 0;
      let curr = el;
      while (curr && curr !== stepsList) {
        top += curr.offsetTop;
        curr = curr.offsetParent;
      }
      return top + el.offsetHeight / 2;
    };

    stepsList.querySelectorAll('.workflow-segment').forEach(s => s.remove());
    const allWrappers = stepsList.querySelectorAll('.node-wrapper');
    if (allWrappers.length < 2) return;
    const RADIUS = allWrappers[0].offsetHeight / 2;
    const BORDER_OVERLAP = 2;

    allWrappers.forEach((wrapper, i) => {
      if (i === allWrappers.length - 1) return;
      const topCenter = getRelativeCenter(wrapper);
      const bottomCenter = getRelativeCenter(allWrappers[i + 1]);
      const segTop = topCenter + RADIUS - BORDER_OVERLAP;
      const segHeight = (bottomCenter - RADIUS + BORDER_OVERLAP) - segTop;
      if (segHeight <= 0) return;
      const seg = document.createElement('div');
      seg.className = 'workflow-segment';
      seg.dataset.segIndex = i;
      seg.style.top = `${segTop}px`;
      seg.style.height = `${segHeight}px`;
      seg.style.left = `${allWrappers[0].offsetLeft + RADIUS}px`; // force centering
      seg.style.opacity = '0.2';
      stepsList.appendChild(seg);
    });

    const symbols = stepsList.querySelectorAll('.connector-symbols');
    symbols.forEach((sym, idx) => {
      const center1 = getRelativeCenter(allWrappers[idx]);
      const center2 = getRelativeCenter(allWrappers[idx + 1]);
      const midPoint = (center1 + center2) / 2;
      const rowTop = allWrappers[idx].closest('.step-row').offsetTop;
      sym.style.top = `${midPoint - rowTop}px`;
    });
  });

})();


// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  applyAssets();
  initNavbar();
  initFlipCards();
  initProblemCarousel();

  // Call gap eliminator on load and resize
  eliminateGap();
  window.addEventListener("resize", eliminateGap);

  initMobileCarousel();
  initDesktopCarousel();
  initDesktopTwoAgents();
  initFAQ();
  initFeatures();
});
