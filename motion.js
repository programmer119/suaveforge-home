(() => {
  "use strict";
  const projects = Array.isArray(window.SF_PROJECTS) ? window.SF_PROJECTS : [];
  const byId = new Map(projects.map((project) => [project.id, project]));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const firstTitle = document.querySelector(".case-story-1 h3");
  if (firstTitle) {
    firstTitle.className = "case-semantic-assembly motion-target";
    firstTitle.dataset.motion = "semantic-assembly";
    firstTitle.setAttribute("aria-label", "콘텐츠 작성, 사진 검수와 예약 실행을 하나의 흐름으로 자동화합니다.");
    firstTitle.innerHTML = `
      <span class="semantic-label">WINDOWS WORKFLOW AUTOMATION</span>
      <span class="semantic-terms" aria-hidden="true">
        <span class="semantic-term">콘텐츠 작성</span>
        <span class="semantic-term">사진 검수</span>
        <span class="semantic-term">예약 실행</span>
      </span>
      <span class="semantic-join" aria-hidden="true"></span>
      <span class="semantic-core" aria-hidden="true"><span>세 업무를 하나로</span><em>자동화.</em></span>`;
  }

  const replaceHeadline = (selector, markup, label) => {
    const heading = document.querySelector(selector);
    if (!heading) return null;
    heading.className = "sf-v2-motion";
    heading.dataset.v2Motion = "true";
    heading.setAttribute("aria-label", label);
    heading.innerHTML = markup;
    return heading;
  };

  replaceHeadline(
    ".case-story-2 h3",
    '<span class="sf-cinematic-cut"><span class="sf-cut-a">세 방향으로 보고,</span><span class="sf-cut-b">거리와 HU를 잽니다.</span><i aria-hidden="true"></i></span>',
    "CT 영상을 세 방향으로 확인하며 거리와 HU 값을 측정합니다."
  );
  replaceHeadline(
    ".case-story-3 h3",
    '<span class="sf-focus-scan"><span>필요한 이미지는 모으고,</span><br><strong>출처와 중복은 자동으로 검사합니다.</strong></span>',
    "필요한 이미지를 모으고 출처와 중복은 자동으로 검사합니다."
  );
  replaceHeadline(
    ".case-story-4 h3",
    '<span class="sf-convergence"><span class="sf-conv-left">오래된 ERP는 그대로</span><i aria-hidden="true"></i><span class="sf-conv-right">PDF 업무만 자동화</span><em>기존 화면과 데이터는 유지하고 필요한 기능만 새로 연결했습니다.</em></span>',
    "오래된 ERP는 그대로 사용하면서 PDF 업무만 자동화했습니다."
  );
  replaceHeadline(
    ".case-story-5 h3",
    '<span class="sf-storyboard"><span class="sf-storyboard-flow"><span>응답 접수</span><i>→</i><span>자동 채점</span><i>→</i><span>결과지 PDF</span></span><strong>결과지까지 자동으로.</strong></span>',
    "응답이 들어오면 자동으로 채점하고 결과지 PDF까지 만듭니다."
  );

  const play = (target, className) => {
    target.classList.remove(className);
    void target.offsetWidth;
    target.classList.add(className);
  };
  const standardTargets = [...document.querySelectorAll(".motion-target")];
  const v2Targets = [...document.querySelectorAll(".sf-v2-motion")];
  if (reduce || !("IntersectionObserver" in window)) {
    standardTargets.forEach((target) => target.classList.add("motion-play"));
    v2Targets.forEach((target) => target.classList.add("sf-v2-play"));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const target = entry.target;
        play(target, target.classList.contains("sf-v2-motion") ? "sf-v2-play" : "motion-play");
        observer.unobserve(target);
      });
    }, { threshold: .28, rootMargin: "0px 0px -8%" });
    [...standardTargets, ...v2Targets].forEach((target) => observer.observe(target));
  }

  document.querySelectorAll(".case-story-media[data-open-project]").forEach((media) => {
    const project = byId.get(media.getAttribute("data-open-project"));
    if (!project) return;
    const images = [...new Set([project.cover, ...(project.gallery || [])].filter(Boolean))];
    if (!images.length) return;
    const original = media.querySelector(":scope > img");
    const caption = media.querySelector(".case-story-caption");
    const gallery = document.createElement("span");
    gallery.className = "case-hover-gallery";
    gallery.setAttribute("aria-hidden", "true");
    const layerA = document.createElement("img");
    const layerB = document.createElement("img");
    layerA.src = images[0]; layerA.alt = ""; layerA.className = "is-active";
    layerB.src = images[1] || images[0]; layerB.alt = "";
    gallery.append(layerA, layerB);
    const meter = document.createElement("span");
    meter.className = "case-gallery-meter";
    meter.setAttribute("aria-hidden", "true");
    meter.innerHTML = '<span class="case-gallery-meter-track"><i></i></span><b>01 / ' + String(images.length).padStart(2, "0") + "</b>";
    original?.remove();
    media.insertBefore(gallery, caption || null);
    media.append(meter);
    let index = 0, active = layerA, standby = layerB, timer = 0, warmup = 0;
    const show = (nextIndex) => {
      index = (nextIndex + images.length) % images.length;
      standby.src = images[index];
      standby.classList.add("is-active");
      active.classList.remove("is-active");
      [active, standby] = [standby, active];
      const count = meter.querySelector("b");
      if (count) count.textContent = String(index + 1).padStart(2, "0") + " / " + String(images.length).padStart(2, "0");
    };
    const stop = () => {
      clearTimeout(warmup); clearInterval(timer); warmup = 0; timer = 0;
      media.classList.remove("is-browsing");
    };
    const start = () => {
      if (reduce || images.length < 2 || timer || warmup) return;
      media.classList.add("is-browsing");
      warmup = setTimeout(() => {
        warmup = 0; show(index + 1);
        timer = setInterval(() => show(index + 1), 1800);
      }, 420);
    };
    media.addEventListener("pointerenter", start);
    media.addEventListener("pointerleave", stop);
    media.addEventListener("focusin", start);
    media.addEventListener("focusout", stop);
  });

  const grid = document.querySelector("[data-portfolio-track]");
  if (grid) {
    const cards = [...grid.querySelectorAll(":scope > .portfolio-card")];
    cards.forEach((card) => card.classList.remove("portfolio-card-more", "is-shown"));
    const track = document.createElement("div"); track.className = "sf-all-work-track";
    const groupA = document.createElement("div"); groupA.className = "sf-all-work-group"; groupA.setAttribute("aria-label", "전체 작업");
    cards.forEach((card) => groupA.append(card));
    const groupB = groupA.cloneNode(true); groupB.setAttribute("aria-hidden", "true");
    groupB.querySelectorAll("a,button").forEach((node) => node.setAttribute("tabindex", "-1"));
    track.append(groupA, groupB); grid.replaceChildren(track);
    const setSpeed = () => {
      const distance = groupA.getBoundingClientRect().width;
      const pxPerSecond = innerWidth <= 760 ? 42 : 56;
      track.style.setProperty("--all-work-duration", Math.max(48, distance / pxPerSecond).toFixed(2) + "s");
    };
    requestAnimationFrame(() => requestAnimationFrame(setSpeed));
    window.addEventListener("resize", setSpeed, { passive: true });
  }
})();
