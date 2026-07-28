(() => {
  "use strict";

  const qs = (selector, root = document) => root?.querySelector(selector) || null;
  const qsa = (selector, root = document) => root ? [...root.querySelectorAll(selector)] : [];
  const escapeHtml = (value = "") => String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[char]));

  const projects = Array.isArray(window.SF_PROJECTS) ? window.SF_PROJECTS : [];
  const projectById = new Map(projects.map((project) => [project.id, project]));
  const config = window.SF_CONFIG || {};
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const year = qs("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());

  const header = qs("[data-header]");
  const menuButton = qs("[data-menu-button]");
  const mobileMenu = qs("[data-mobile-menu]");
  const setMenu = (open) => {
    document.body.classList.toggle("menu-open", open);
    menuButton?.setAttribute("aria-expanded", String(open));
    menuButton?.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
    mobileMenu?.classList.toggle("is-open", open);
  };
  menuButton?.addEventListener("click", () => setMenu(menuButton.getAttribute("aria-expanded") !== "true"));
  qsa("a", mobileMenu).forEach((link) => link.addEventListener("click", () => setMenu(false)));

  const languageSwitcher = qs("[data-language-switcher]");
  const languageTrigger = qs("[data-language-trigger]", languageSwitcher);
  const languageFlag = qs("[data-language-flag]", languageSwitcher);
  const languageLabel = qs("[data-language-label]", languageSwitcher);
  const languageOptions = qsa("[data-language-option]", languageSwitcher);
  const languageMeta = {
    ko: { label: "KO", flag: "🇰🇷", htmlLang: "ko" },
    en: { label: "EN", flag: "🇺🇸", htmlLang: "en" },
    ja: { label: "JP", flag: "🇯🇵", htmlLang: "ja" },
    es: { label: "ES", flag: "🇪🇸", htmlLang: "es" }
  };
  const setLanguageMenu = (open) => {
    languageSwitcher?.classList.toggle("is-open", open);
    languageTrigger?.setAttribute("aria-expanded", String(open));
  };
  const applyLanguage = (lang) => {
    const selected = languageMeta[lang] || languageMeta.ko;
    document.documentElement.lang = selected.htmlLang;
    if (languageFlag) languageFlag.textContent = selected.flag;
    if (languageLabel) languageLabel.textContent = selected.label;
    languageOptions.forEach((option) => {
      option.setAttribute("aria-selected", String(option.dataset.lang === lang));
    });
    try { localStorage.setItem("suaveforge.language", lang); } catch (_) {}
  };
  let savedLanguage = "ko";
  try { savedLanguage = localStorage.getItem("suaveforge.language") || "ko"; } catch (_) {}
  applyLanguage(savedLanguage);
  languageTrigger?.addEventListener("click", () => {
    setLanguageMenu(languageTrigger.getAttribute("aria-expanded") !== "true");
  });
  languageOptions.forEach((option) => option.addEventListener("click", () => {
    applyLanguage(option.dataset.lang || "ko");
    setLanguageMenu(false);
  }));
  document.addEventListener("click", (event) => {
    if (!languageSwitcher || languageSwitcher.contains(event.target)) return;
    setLanguageMenu(false);
  });

  const updateHeader = () => header?.classList.toggle("is-scrolled", window.scrollY > 16);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  const renderStack = (stack, className = "stack-chips", limit = 5) =>
    `<div class="${className}">${(stack || []).slice(0, limit).map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</div>`;

  const categoryClass = (category = "") => (category.includes("제품") && !category.includes("사전")) ? "project-badge-product" : "project-badge-prototype";

  const featuredRoot = qs("[data-featured-cases]");
  if (featuredRoot) {
    const featured = projects.filter((project) => project.featured).sort((a, b) => a.featured - b.featured);
    featuredRoot.innerHTML = featured.map((project, index) => {
      const extraClass = index >= 3 ? " case-extra" : "";
      return `
      <article class="case-story case-story-${index + 1}${extraClass} reveal">
        <div class="case-story-copy">
          <div class="case-story-meta">
            <span class="project-badge ${categoryClass(project.category)}">${escapeHtml(project.category)}</span>
            <small>${escapeHtml(project.kind)} · ${escapeHtml(project.date)}</small>
          </div>
          <span class="case-story-number" aria-hidden="true">0${index + 1}</span>
          <h3>${escapeHtml(project.headline || project.short)}</h3>
          <p>${escapeHtml(project.result || project.short)}</p>
          <div class="case-proof-list">${(project.proofs || project.features || []).slice(0, 3).map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</div>
          ${renderStack(project.stack, "stack-chips case-stack", 5)}
          <button class="case-detail-button" type="button" data-open-project="${escapeHtml(project.id)}">자세히 보기 <span>↗</span></button>
        </div>
        <button class="case-story-media" type="button" data-open-project="${escapeHtml(project.id)}" aria-label="${escapeHtml(project.title)} 상세 보기">
          <img src="${escapeHtml(project.cover)}" alt="${escapeHtml(project.title)} 프로젝트 화면" loading="${index === 0 ? "eager" : "lazy"}"/>
          <span class="case-story-caption">${escapeHtml(project.title)} <i>DETAIL ↗</i></span>
        </button>
      </article>`;
    }).join("");
  }

  const caseMore = qs("[data-case-more]");
  caseMore?.addEventListener("click", () => {
    const expanded = caseMore.getAttribute("aria-expanded") === "true";
    caseMore.setAttribute("aria-expanded", String(!expanded));
    qsa(".case-extra", featuredRoot).forEach((item) => item.classList.toggle("is-shown", !expanded));
    caseMore.innerHTML = expanded ? "대표 작업 더 보기 <span>＋</span>" : "대표 작업 접기 <span>−</span>";
    if (expanded) qs("#cases")?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  });

  const portfolioTrack = qs("[data-portfolio-track]");
  if (portfolioTrack) {
    portfolioTrack.innerHTML = projects.map((project, index) => `
      <article class="portfolio-card${index >= 6 ? " portfolio-card-more" : ""}" data-project-card>
        <button type="button" class="portfolio-figure" data-open-project="${escapeHtml(project.id)}" aria-label="${escapeHtml(project.title)} 상세 보기">
          <img src="${escapeHtml(project.cover)}" alt="${escapeHtml(project.title)} 화면" loading="lazy"/>
          <span class="project-badge ${categoryClass(project.category)}">${escapeHtml(project.category)}</span>
        </button>
        <div class="portfolio-card-body">
          <div class="portfolio-meta"><span>${escapeHtml(project.kind)}</span><i>${escapeHtml(project.date || "")}</i></div>
          <h3>${escapeHtml(project.title)}</h3>
          <p>${escapeHtml(project.short)}</p>
          ${renderStack(project.stack, "stack-chips", 4)}
          <div class="portfolio-actions">
            <button type="button" data-open-project="${escapeHtml(project.id)}">상세 보기</button>
            ${project.url ? `<a href="${escapeHtml(project.url)}" target="_blank" rel="noopener">데모 보기 ↗</a>` : `<span>프로그램 화면</span>`}
          </div>
        </div>
      </article>`).join("");
  }

  const portfolioMore = qs("[data-portfolio-more]");
  portfolioMore?.addEventListener("click", () => {
    const expanded = portfolioMore.getAttribute("aria-expanded") === "true";
    portfolioMore.setAttribute("aria-expanded", String(!expanded));
    qsa(".portfolio-card-more", portfolioTrack).forEach((card) => card.classList.toggle("is-shown", !expanded));
    portfolioMore.innerHTML = expanded ? "더 많은 작업 보기 <span>＋</span>" : "작업 접기 <span>−</span>";
  });

  const revealItems = qsa(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.06, rootMargin: "0px 0px -35px" });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  const projectDialog = qs("[data-project-dialog]");
  let activeProject = null;
  let activeGalleryIndex = 0;
  const dialogImage = qs("[data-dialog-image]", projectDialog);
  const dialogLive = qs("[data-dialog-live]", projectDialog);
  const updateDialogImage = () => {
    if (!activeProject || !dialogImage) return;
    const gallery = activeProject.gallery?.length ? activeProject.gallery : [activeProject.cover];
    activeGalleryIndex = (activeGalleryIndex + gallery.length) % gallery.length;
    dialogImage.src = gallery[activeGalleryIndex];
    dialogImage.alt = `${activeProject.title} 프로젝트 화면 ${activeGalleryIndex + 1}`;
    const count = qs("[data-gallery-count]", projectDialog);
    if (count) count.textContent = `${activeGalleryIndex + 1} / ${gallery.length}`;
    qsa("[data-gallery-prev],[data-gallery-next]", projectDialog).forEach((button) => button.hidden = gallery.length < 2);
  };
  const openProject = (project) => {
    if (!projectDialog || !project) return;
    activeProject = project;
    activeGalleryIndex = 0;
    qs("[data-dialog-kind]", projectDialog).innerHTML = `<span class="project-badge ${categoryClass(project.category)}">${escapeHtml(project.category)}</span><small>${escapeHtml(project.kind)}</small>`;
    qs("[data-dialog-title]", projectDialog).textContent = project.title;
    qs("[data-dialog-short]", projectDialog).textContent = project.headline || project.short;
    qs("[data-dialog-stack]", projectDialog).innerHTML = (project.stack || []).map((item) => `<span>${escapeHtml(item)}</span>`).join("");
    qs("[data-dialog-features]", projectDialog).innerHTML = (project.features || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("");
    qs("[data-dialog-scope]", projectDialog).textContent = project.scope || "";
    qs("[data-dialog-result]", projectDialog).textContent = project.result || "";
    if (dialogLive) {
      dialogLive.hidden = !project.url;
      dialogLive.href = project.url || "#";
    }
    updateDialogImage();
    projectDialog.showModal();
    document.body.classList.add("dialog-open");
  };
  document.addEventListener("click", (event) => {
    const opener = event.target.closest("[data-open-project]");
    if (!opener) return;
    const project = projectById.get(opener.getAttribute("data-open-project"));
    if (project) openProject(project);
  });
  qs("[data-project-close]", projectDialog)?.addEventListener("click", () => projectDialog.close());
  qs("[data-gallery-prev]", projectDialog)?.addEventListener("click", () => { activeGalleryIndex -= 1; updateDialogImage(); });
  qs("[data-gallery-next]", projectDialog)?.addEventListener("click", () => { activeGalleryIndex += 1; updateDialogImage(); });
  projectDialog?.addEventListener("click", (event) => { if (event.target === projectDialog) projectDialog.close(); });
  projectDialog?.addEventListener("close", () => { document.body.classList.remove("dialog-open"); activeProject = null; });

  const projectForm = qs("[data-project-form]");
  const formStatus = qs("[data-form-status]");
  const submitButton = qs("[data-submit-button]", projectForm);
  const formLoadedAt = Date.now();

  const normalizeReferenceUrl = (value) => {
    const raw = String(value || "").trim();
    if (!raw) return "";
    if (/^[a-z][a-z0-9+.-]*:\/\//i.test(raw)) return raw;
    if (/^(localhost|\d{1,3}(?:\.\d{1,3}){3})(?::\d+)?(?:\/|$)/i.test(raw)) return `http://${raw}`;
    return `https://${raw}`;
  };

  const referenceInput = projectForm?.querySelector('[name="reference"]');
  referenceInput?.addEventListener("blur", () => {
    if (referenceInput.value.trim()) referenceInput.value = normalizeReferenceUrl(referenceInput.value);
  });

  const buildBrief = () => {
    if (!projectForm) return "";
    const data = new FormData(projectForm);
    return [
      "안녕하세요. SuaveForge 프로젝트 상담을 요청합니다.", "",
      `[이름 / 회사] ${data.get("name") || ""}`,
      `[회신 이메일] ${data.get("email") || ""}`,
      `[연락처] ${data.get("phone") || "미기재"}`,
      `[필요한 프로그램] ${data.get("type") || "미정"}`,
      `[희망 일정] ${data.get("timeline") || "미정"}`,
      `[예산 범위] ${data.get("budget") || "미정"}`,
      `[참고 링크] ${normalizeReferenceUrl(data.get("reference")) || "없음"}`, "",
      `[현재 해결하려는 일]\n${data.get("problem") || ""}`
    ].join("\n");
  };

  const setFormStatus = (message, state = "") => {
    if (!formStatus) return;
    formStatus.textContent = message;
    formStatus.dataset.state = state;
  };

  projectForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!projectForm.reportValidity()) return;
    const formData = new FormData(projectForm);
    if (formData.get("_honey")) return;
    if (Date.now() - formLoadedAt < 2500) {
      setFormStatus("잠시 후 다시 제출해 주세요.", "error");
      return;
    }
    const endpoint = config.contactEndpoint;
    if (!endpoint) {
      setFormStatus("지금은 온라인 접수가 어렵습니다. 이메일이나 전화로 연락해 주세요. 내용을 복사해 이메일로 보내주세요.", "error");
      return;
    }
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone") || "미기재",
      project_type: formData.get("type"),
      timeline: formData.get("timeline") || "미정",
      budget: formData.get("budget") || "미정",
      reference: normalizeReferenceUrl(formData.get("reference")) || "없음",
      message: formData.get("problem"),
      _replyto: formData.get("email"),
      _subject: `[SuaveForge 프로젝트 상담] ${formData.get("name")} · ${formData.get("type")}`,
      _template: "table",
      _captcha: "false",
      _url: location.href
    };
    submitButton?.setAttribute("disabled", "");
    if (submitButton) submitButton.firstChild.textContent = "접수 중... ";
    setFormStatus("상담 내용을 전송하고 있습니다.", "loading");
    try {
      // FormSubmit 공식 AJAX 예시와 같은 일반 폼 인코딩을 사용합니다.
      // application/json은 CORS 사전 요청을 발생시켜, 메일은 전달됐지만
      // 브라우저가 응답을 읽지 못해 실패로 표시되는 경우가 있습니다.
      const encoded = new URLSearchParams();
      Object.entries(payload).forEach(([key, value]) => encoded.append(key, String(value ?? "")));
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: encoded
      });
      const responseText = await response.text();
      let result = {};
      try { result = responseText ? JSON.parse(responseText) : {}; } catch { result = {}; }
      const explicitFailure = result.success === false || result.success === "false";
      if (!response.ok || explicitFailure) throw new Error(result.message || `submit failed (${response.status})`);
      projectForm.reset();
      setFormStatus(`상담 내용이 접수되었습니다. ${config.responsePromise || "확인 후 연락드리겠습니다."}`, "success");
    } catch (error) {
      console.error(error);
      if (error instanceof TypeError) {
        setFormStatus(`전송 결과를 바로 확인하지 못했습니다. 잠시 후 메일을 확인하거나 전화로 문의해 주세요.`, "warning");
      } else {
        setFormStatus(`전송하지 못했습니다. 내용을 복사해 ${config.contactEmail || "이메일"}로 보내거나 전화로 문의해 주세요.`, "error");
      }
    } finally {
      submitButton?.removeAttribute("disabled");
      if (submitButton) submitButton.firstChild.textContent = "상담 내용 보내기 ";
    }
  });

  qs("[data-copy-brief]")?.addEventListener("click", async () => {
    if (!projectForm?.reportValidity()) return;
    const text = buildBrief();
    try {
      await navigator.clipboard.writeText(text);
      setFormStatus("상담 내용을 복사했습니다. 이메일에 붙여 넣어 보내주세요.", "success");
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.append(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
      setFormStatus("상담 내용을 복사했습니다.", "success");
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    setMenu(false);
    setLanguageMenu(false);
    if (projectDialog?.open) projectDialog.close();
  });
})();
