document.querySelectorAll(".suaveforge-logo-motion").forEach(initSuaveForgeLogo);

async function initSuaveForgeLogo(root) {
    const shell = root.querySelector(".logo-shell") || root;
    const svgSrc = root.dataset.svgSrc;
    if (svgSrc && !root.querySelector(".motion-logo")) {
      const response = await fetch(svgSrc);
      shell.innerHTML = await response.text();
    }

    const status = root.querySelector("#status");
    const replay = root.querySelector("#replay");
    const finalOnly = root.querySelector("#finalOnly");
    const suaveText = root.querySelector(".wordmark-suave");
    const forgeText = root.querySelector(".wordmark-forge");
    const pathsToDraw = ["#ringPath", "#innerArc", "#sTop", "#sBottom", "#impactRing"];

    function preparePath(selector) {
      const path = root.querySelector(selector);
      const length = path.getTotalLength();
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      return length;
    }

    function setFinalState() {
      gsap.set(["#sTop", "#sBottom", "#sCut", "#impactRing", ".spark", ".f-highlight", "#finalF"], { opacity: 0 });
      gsap.set("#motionLayers", { opacity: 1 });
      gsap.set(["#ringPath", "#innerArc", "#arrowHead", "#finalF"], { opacity: 0 });
      gsap.set(["#ringPath", "#innerArc"], { strokeDashoffset: 0 });
      gsap.set("#fTool", { opacity: 0 });
      gsap.set("#originalLogo", { opacity: 0, scale: 1, transformOrigin: "512px 512px" });
      gsap.set("#exactFinalLogo", { opacity: 1, scale: 1, transformOrigin: "512px 512px" });
      gsap.set(suaveText, { opacity: 1, x: -17, y: 0 });
      gsap.set(forgeText, { opacity: 1, x: 17, y: 0 });
      status.textContent = "Final SVG lockup";
    }

    function animateWordmark() {
      if (!suaveText || !forgeText) return null;

      gsap.set(suaveText, { opacity: 0, x: 0, y: 8 });
      gsap.set(forgeText, { opacity: 0, x: 0, y: 8 });

      return gsap.timeline({ defaults: { ease: "power3.out" } })
        .to(suaveText, { opacity: 1, y: 0, duration: 0.48 }, 0.78)
        .to(suaveText, { x: -17, duration: 0.42, ease: "power2.inOut" }, 1.78)
        .to(forgeText, { opacity: 1, y: 0, duration: 0.34 }, 2.12)
        .fromTo(forgeText, { x: -4 }, { x: 17, duration: 0.48, ease: "power2.out" }, 2.12);
    }

    function buildTimeline() {
      pathsToDraw.forEach(preparePath);

      gsap.set("#motionLayers", { opacity: 1 });
      gsap.set("#originalLogo", { opacity: 0, scale: 0.98, transformOrigin: "512px 512px" });
      gsap.set("#exactFinalLogo", { opacity: 0, scale: 0.985, transformOrigin: "512px 512px" });
      gsap.set(["#ringPath", "#innerArc", "#arrowHead", "#finalF"], { opacity: 0 });
      gsap.set(".f-highlight", { opacity: 0 });
      gsap.set("#fTool", {
        opacity: 0,
        x: 190,
        y: -230,
        rotation: 32,
        scale: 0.9,
        transformOrigin: "58% 82%"
      });
      gsap.set("#arrowHead", { opacity: 0, scale: 0.2, x: -40, y: 34, rotation: -28 });
      gsap.set("#sTop", { opacity: 0, rotation: -7, x: 0, y: 16, transformOrigin: "512px 512px" });
      gsap.set("#sBottom", { opacity: 0, rotation: -7, x: 0, y: 16, transformOrigin: "512px 512px" });
      gsap.set("#sCut", { opacity: 0 });
      gsap.set("#impactRing", { opacity: 0, scale: 0.45, transformOrigin: "512px 512px" });
      gsap.set(".spark", { opacity: 0, x: 0, y: 0, scale: 0.3 });
      root.querySelectorAll(".f-highlight").forEach((path) => {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      });

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onStart: () => { status.textContent = "Forging Suaveforge mark"; },
        onComplete: () => { status.textContent = "Final SVG lockup"; }
      });

      tl.to("#sTop", { opacity: 1, strokeDashoffset: 0, duration: 0.34 }, 0)
        .to("#sBottom", { opacity: 1, strokeDashoffset: 0, duration: 0.38 }, 0.08)
        .to(["#sTop", "#sBottom"], { rotation: -9, x: -10, y: 6, duration: 0.06, ease: "none" }, 0.32)
        .to(["#sTop", "#sBottom"], { rotation: 2, x: 12, y: -7, duration: 0.06, ease: "none" }, 0.38)
        .to(["#sTop", "#sBottom"], { rotation: -6, x: -8, y: 5, duration: 0.06, ease: "none" }, 0.44)
        .to(["#sTop", "#sBottom"], { rotation: -3, x: 0, y: 0, duration: 0.1, ease: "power2.out" }, 0.5)
        .to("#fTool", { opacity: 1, x: 70, y: -104, rotation: 18, scale: 0.96, duration: 0.38, ease: "power2.out" }, 0.28)
        .to("#fTool", { x: -18, y: 28, rotation: -22, scale: 1.09, duration: 0.17, ease: "power4.in" }, 0.72)
        .to("#fTool", { x: 18, y: -18, rotation: 8, scale: 0.98, duration: 0.12, ease: "back.out(3)" }, 0.89)
        .to("#sCut", { opacity: 1, duration: 0.04 }, 0.86)
        .to("#sCut", { opacity: 0, duration: 0.18 }, 0.98)
        .to("#impactRing", { opacity: 0.9, strokeDashoffset: 0, scale: 1, duration: 0.13, ease: "power2.out" }, 0.86)
        .to("#impactRing", { opacity: 0, scale: 1.65, duration: 0.32 }, 0.99)
        .to(".spark", {
          opacity: 1,
          x: (i, el) => Number(el.dataset.x),
          y: (i, el) => Number(el.dataset.y),
          scale: 1,
          duration: 0.2,
          stagger: 0.018
        }, 0.88)
        .to(".spark", { opacity: 0, scale: 0.1, duration: 0.34, stagger: 0.01 }, 1.04)
        .to("#sTop", { x: -138, y: -126, rotation: -74, scale: 0.72, opacity: 0.15, duration: 0.42, ease: "power3.inOut" }, 0.96)
        .to("#sBottom", { x: 144, y: 132, rotation: 68, scale: 0.72, opacity: 0.15, duration: 0.42, ease: "power3.inOut" }, 0.96)
        .to("#ringPath", { opacity: 1, strokeDashoffset: 0, duration: 0.72, ease: "expo.out" }, 1.03)
        .to("#innerArc", { opacity: 1, strokeDashoffset: 0, duration: 0.5, ease: "expo.out" }, 1.12)
        .to("#arrowHead", { opacity: 1, x: 0, y: 0, rotation: 0, scale: 1, duration: 0.32, ease: "back.out(2.7)" }, 1.58)
        .to("#fTool", { x: 0, y: 0, rotation: 0, scale: 1, duration: 0.38, ease: "elastic.out(1, 0.55)" }, 1.28)
        .to(".f-highlight", {
          opacity: 0.95,
          strokeDashoffset: 0,
          duration: 0.28,
          stagger: 0.06,
          ease: "power2.out"
        }, 1.55)
        .to(".f-highlight", {
          opacity: 0,
          duration: 0.28,
          stagger: 0.04,
          ease: "power2.in"
        }, 1.86)
        .to("#fTool", { opacity: 0, scale: 0.985, duration: 0.24, ease: "power2.inOut" }, 1.94)
        .to(["#sTop", "#sBottom"], { opacity: 0, duration: 0.2 }, 1.62)
        .to(["#ringPath", "#innerArc", "#arrowHead"], { opacity: 0, duration: 0.2, ease: "power1.inOut" }, 2.02)
        .to("#originalLogo", { opacity: 0, duration: 0.01 }, 2.02)
        .to("#exactFinalLogo", { opacity: 1, scale: 1, duration: 0.34, ease: "back.out(2)" }, 2.04);

      return tl;
    }

    let timeline;
    let wordTimeline;

    function play() {
      if (!window.gsap) {
        status.textContent = "GSAP CDN을 불러오지 못했습니다. 네트워크 연결을 확인해 주세요.";
        return;
      }

      if (timeline) timeline.kill();
      if (wordTimeline) wordTimeline.kill();
      timeline = buildTimeline();
      wordTimeline = animateWordmark();
      timeline.play(0);
    }

    replay.addEventListener("click", play);
    finalOnly.addEventListener("click", () => {
      if (timeline) timeline.kill();
      if (wordTimeline) wordTimeline.kill();
      setFinalState();
    });

    play();
}
