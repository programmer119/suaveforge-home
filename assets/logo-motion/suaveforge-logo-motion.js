document.querySelectorAll(".suaveforge-logo-motion").forEach(initSuaveForgeLogo);

async function initSuaveForgeLogo(root) {
  const shell = root.querySelector(".logo-shell") || root;
  const svgSrc = root.dataset.svgSrc;

  if (svgSrc && !root.querySelector(".motion-logo")) {
    const response = await fetch(svgSrc);
    shell.innerHTML = await response.text();
  }

  if (!window.gsap) return;

  const q = gsap.utils.selector(root);
  const replay = root.querySelector("#replay");
  const finalOnly = root.querySelector("#finalOnly");
  const status = root.querySelector("#status");
  const pathsToDraw = ["#ringPath", "#innerArc", "#sTop", "#sBottom", "#impactRing"];
  let timeline;

  function preparePath(selector) {
    const path = root.querySelector(selector);
    if (!path) return 0;
    const length = path.getTotalLength();
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
    return length;
  }

  function setFinalState() {
    gsap.set(q("#sTop, #sBottom, #sCut, #impactRing, .spark, .f-highlight, #finalF"), { opacity: 0 });
    gsap.set(q("#motionLayers, #ringPath, #innerArc, #arrowHead, #fTool"), { opacity: 1 });
    gsap.set(q("#finalF"), { opacity: 0 });
    gsap.set(q("#ringPath, #innerArc"), { strokeDashoffset: 0 });
    gsap.set(q("#fTool"), { x: 0, y: 0, rotation: 0, scale: 1, transformOrigin: "58% 82%" });
    if (status) status.textContent = "Final SVG lockup";
  }

  function buildTimeline() {
    pathsToDraw.forEach(preparePath);

    gsap.set(q("#motionLayers"), { opacity: 1 });
    gsap.set(q("#ringPath, #innerArc, #arrowHead, #finalF"), { opacity: 0 });
    gsap.set(q(".f-highlight"), { opacity: 0 });
    gsap.set(q("#fTool"), {
      opacity: 0,
      x: 190,
      y: -230,
      rotation: 32,
      scale: 0.9,
      transformOrigin: "58% 82%"
    });
    gsap.set(q("#arrowHead"), { opacity: 0, scale: 0.2, x: -40, y: 34, rotation: -28 });
    gsap.set(q("#sTop"), { opacity: 0, rotation: -7, x: 0, y: 16, transformOrigin: "512px 512px" });
    gsap.set(q("#sBottom"), { opacity: 0, rotation: -7, x: 0, y: 16, transformOrigin: "512px 512px" });
    gsap.set(q("#sCut"), { opacity: 0 });
    gsap.set(q("#impactRing"), { opacity: 0, scale: 0.45, transformOrigin: "512px 512px" });
    gsap.set(q(".spark"), { opacity: 0, x: 0, y: 0, scale: 0.3 });
    root.querySelectorAll(".f-highlight").forEach((path) => {
      const length = path.getTotalLength();
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
    });

    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      onStart: () => { if (status) status.textContent = "Forging Suaveforge mark"; },
      onComplete: () => { if (status) status.textContent = "Final SVG lockup"; }
    });

    tl.to(q("#sTop"), { opacity: 1, strokeDashoffset: 0, duration: 0.34 }, 0)
      .to(q("#sBottom"), { opacity: 1, strokeDashoffset: 0, duration: 0.38 }, 0.08)
      .to(q("#sTop, #sBottom"), { rotation: -9, x: -10, y: 6, duration: 0.06, ease: "none" }, 0.32)
      .to(q("#sTop, #sBottom"), { rotation: 2, x: 12, y: -7, duration: 0.06, ease: "none" }, 0.38)
      .to(q("#sTop, #sBottom"), { rotation: -6, x: -8, y: 5, duration: 0.06, ease: "none" }, 0.44)
      .to(q("#sTop, #sBottom"), { rotation: -3, x: 0, y: 0, duration: 0.1, ease: "power2.out" }, 0.5)
      .to(q("#fTool"), { opacity: 1, x: 70, y: -104, rotation: 18, scale: 0.96, duration: 0.38, ease: "power2.out" }, 0.28)
      .to(q("#fTool"), { x: -18, y: 28, rotation: -22, scale: 1.09, duration: 0.17, ease: "power4.in" }, 0.72)
      .to(q("#fTool"), { x: 18, y: -18, rotation: 8, scale: 0.98, duration: 0.12, ease: "back.out(3)" }, 0.89)
      .to(q("#sCut"), { opacity: 1, duration: 0.04 }, 0.86)
      .to(q("#sCut"), { opacity: 0, duration: 0.18 }, 0.98)
      .to(q("#impactRing"), { opacity: 0.9, strokeDashoffset: 0, scale: 1, duration: 0.13, ease: "power2.out" }, 0.86)
      .to(q("#impactRing"), { opacity: 0, scale: 1.65, duration: 0.32 }, 0.99)
      .to(q(".spark"), {
        opacity: 1,
        x: (i, el) => Number(el.dataset.x),
        y: (i, el) => Number(el.dataset.y),
        scale: 1,
        duration: 0.2,
        stagger: 0.018
      }, 0.88)
      .to(q(".spark"), { opacity: 0, scale: 0.1, duration: 0.34, stagger: 0.01 }, 1.04)
      .to(q("#sTop"), { x: -138, y: -126, rotation: -74, scale: 0.72, opacity: 0.15, duration: 0.42, ease: "power3.inOut" }, 0.96)
      .to(q("#sBottom"), { x: 144, y: 132, rotation: 68, scale: 0.72, opacity: 0.15, duration: 0.42, ease: "power3.inOut" }, 0.96)
      .to(q("#ringPath"), { opacity: 1, strokeDashoffset: 0, duration: 0.72, ease: "expo.out" }, 1.03)
      .to(q("#innerArc"), { opacity: 1, strokeDashoffset: 0, duration: 0.5, ease: "expo.out" }, 1.12)
      .to(q("#arrowHead"), { opacity: 1, x: 0, y: 0, rotation: 0, scale: 1, duration: 0.32, ease: "back.out(2.7)" }, 1.58)
      .to(q("#fTool"), { x: 0, y: 0, rotation: 0, scale: 1, duration: 0.38, ease: "elastic.out(1, 0.55)" }, 1.28)
      .to(q(".f-highlight"), {
        opacity: 0.95,
        strokeDashoffset: 0,
        duration: 0.28,
        stagger: 0.06,
        ease: "power2.out"
      }, 1.55)
      .to(q(".f-highlight"), {
        opacity: 0,
        duration: 0.28,
        stagger: 0.04,
        ease: "power2.in"
      }, 1.86)
      .to(q("#fTool"), { opacity: 1, scale: 1, duration: 0.24, ease: "power2.inOut" }, 1.94)
      .to(q("#sTop, #sBottom"), { opacity: 0, duration: 0.2 }, 1.62)
      .to(q("#finalF"), { opacity: 0, duration: 0.01 }, 2.02)
      .to(q("#ringPath, #innerArc, #arrowHead, #fTool"), { opacity: 1, scale: 1, duration: 0.34, ease: "back.out(2)" }, 2.04);

    return tl;
  }

  function play() {
    if (timeline) timeline.kill();
    pathsToDraw.forEach(preparePath);

    if (root.dataset.staticLogo !== undefined) {
      setFinalState();
      return;
    }

    timeline = buildTimeline();
    timeline.play(0);
  }

  replay?.addEventListener("click", play);
  finalOnly?.addEventListener("click", () => {
    if (timeline) timeline.kill();
    setFinalState();
  });

  play();
}
