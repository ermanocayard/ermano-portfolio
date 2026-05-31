const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const year = document.querySelector("#year");

if (year) {
  year.textContent = new Date().getFullYear();
}

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      navLinks.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

const dataSources = {
  profile: "data/profile.json",
  projects: "data/projects.json",
  experience: "data/experience.json",
  capabilities: "data/capabilities.json",
};

const createElement = (tag, className, text) => {
  const element = document.createElement(tag);

  if (className) {
    element.className = className;
  }

  if (text) {
    element.textContent = text;
  }

  return element;
};

const appendText = (parent, tag, className, text) => {
  const element = createElement(tag, className, text);
  parent.appendChild(element);
  return element;
};

const createLink = ({ label, href, type, user, domain }) => {
  const link = createElement("a", "text-link", label);

  if (type === "email" && user && domain) {
    link.href = `mailto:${user}@${domain}`;
  } else {
    link.href = href || "#";
  }

  if (type === "external") {
    link.target = "_blank";
    link.rel = "noreferrer";
  }

  return link;
};

const fetchJson = async (path) => {
  const response = await fetch(path, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Unable to load ${path}`);
  }

  return response.json();
};

const renderHero = (profile) => {
  const container = document.querySelector("#hero-content");
  if (!container) return;

  container.replaceChildren();

  const copy = createElement("div", "hero-copy");
  appendText(copy, "p", "eyebrow", profile.eyebrow);
  appendText(copy, "h1", null, profile.name);
  appendText(copy, "p", "identity-line", profile.identity);
  appendText(copy, "p", "hero-summary", profile.summary);

  if (profile.skill_strip?.length) {
    const skillStrip = createElement("ul", "hero-skill-strip");
    profile.skill_strip.forEach((skill) => appendText(skillStrip, "li", null, skill));
    copy.appendChild(skillStrip);
  }

  const linkRow = createElement("div", "link-row");
  profile.contact.forEach((contact) => {
    linkRow.appendChild(createLink(contact));
  });
  copy.appendChild(linkRow);

  appendText(copy, "p", "muted-note hero-note", profile.resume_note);

  const photo = createElement("figure", "hero-photo");

  if (profile.photo?.src) {
    const image = createElement("img");
    image.src = profile.photo.src;
    image.alt = profile.photo.alt || "";
    photo.appendChild(image);
  } else {
    const fallback = createElement("div", "hero-photo-fallback");
    appendText(fallback, "span", null, "EDC");
    photo.appendChild(fallback);
  }

  container.append(copy, photo);
};

const setProjectCardExpanded = (card, expanded) => {
  const toggle = card.querySelector(".project-toggle");
  const detail = card.querySelector(".project-detail");
  const cue = card.querySelector(".expand-cue");

  card.classList.toggle("is-expanded", expanded);
  toggle?.setAttribute("aria-expanded", String(expanded));
  detail?.setAttribute("aria-hidden", String(!expanded));

  if (cue) {
    cue.textContent = expanded ? "Collapse" : "Expand";
  }
};

const getProjectCardTop = (card) => card.getBoundingClientRect().top + window.scrollY;

const getCollapsedHeightAbove = (card, container) => {
  return Array.from(container.querySelectorAll(".project-card.is-expanded")).reduce((height, openCard) => {
    const isAboveCard = openCard.compareDocumentPosition(card) & Node.DOCUMENT_POSITION_FOLLOWING;

    if (!isAboveCard || openCard === card) {
      return height;
    }

    return height + (openCard.querySelector(".project-detail")?.getBoundingClientRect().height || 0);
  }, 0);
};

const scrollProjectCardIntoView = (card, top = getProjectCardTop(card)) => {
  const headerHeight = document.querySelector(".site-header")?.getBoundingClientRect().height || 0;
  const offset = headerHeight + 24;

  window.scrollTo({
    top: Math.max(0, top - offset),
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
  });
};

const setTimelineItemExpanded = (item, expanded) => {
  const toggle = item.querySelector(".timeline-toggle");
  const detail = item.querySelector(".timeline-detail");

  item.classList.toggle("is-expanded", expanded);
  toggle?.setAttribute("aria-expanded", String(expanded));
  detail?.setAttribute("aria-hidden", String(!expanded));
};

const setupPointerField = () => {
  const canUsePointerEffects = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!canUsePointerEffects || prefersReducedMotion) return;

  const root = document.documentElement;
  const glow = createElement("div", "pointer-glow");
  glow.setAttribute("aria-hidden", "true");
  document.body.appendChild(glow);
  document.body.classList.add("pointer-field-enabled");

  const reactiveElements = Array.from(
    document.querySelectorAll(
      ".hero-photo, .project-card, .tool-item, .timeline-item, .link-row .text-link, .contact-links .text-link"
    )
  );

  reactiveElements.forEach((element) => element.classList.add("motion-reactive"));

  let pointerX = window.innerWidth / 2;
  let pointerY = window.innerHeight / 2;
  let pendingFrame = false;

  const resetElement = (element) => {
    element.style.setProperty("--float-x", "0px");
    element.style.setProperty("--float-y", "0px");
    element.style.setProperty("--field-glow-alpha", "0");
  };

  const updatePointerField = () => {
    root.style.setProperty("--cursor-x", `${pointerX}px`);
    root.style.setProperty("--cursor-y", `${pointerY}px`);
    root.style.setProperty("--field-drift-x", `${((pointerX / window.innerWidth) - 0.5) * -9}px`);
    root.style.setProperty("--field-drift-y", `${((pointerY / window.innerHeight) - 0.5) * -7}px`);

    reactiveElements.forEach((element) => {
      if (!element.isConnected || element.classList.contains("is-expanded")) {
        resetElement(element);
        return;
      }

      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = centerX - pointerX;
      const dy = centerY - pointerY;
      const distance = Math.hypot(dx, dy);
      const radius = 260;

      if (distance >= radius) {
        resetElement(element);
        return;
      }

      const falloff = 1 - distance / radius;
      const strength = 7 * falloff * falloff;
      const safeDistance = distance || 1;

      element.style.setProperty("--float-x", `${(dx / safeDistance) * strength}px`);
      element.style.setProperty("--float-y", `${(dy / safeDistance) * strength}px`);
      element.style.setProperty("--field-glow-alpha", `${0.14 * falloff}`);
    });

    pendingFrame = false;
  };

  const queuePointerFieldUpdate = () => {
    if (pendingFrame) return;
    pendingFrame = true;
    window.requestAnimationFrame(updatePointerField);
  };

  window.addEventListener(
    "pointermove",
    (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      document.body.classList.add("pointer-active");
      queuePointerFieldUpdate();
    },
    { passive: true }
  );

  window.addEventListener("pointerleave", () => {
    document.body.classList.remove("pointer-active");
    reactiveElements.forEach(resetElement);
  });
};

const renderProjects = (projects) => {
  const container = document.querySelector("#project-list");
  if (!container) return;

  container.replaceChildren();

  const orderedProjects = [...projects].sort((a, b) => Number(b.featured) - Number(a.featured));

  orderedProjects.forEach((project) => {
    const detailId = `project-detail-${project.id}`;
    const card = createElement("article", project.featured ? "project-card featured" : "project-card");

    const toggle = createElement("button", "project-toggle");
    toggle.type = "button";
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-controls", detailId);

    const meta = createElement("div", "project-meta");
    appendText(meta, "span", "project-context", project.context_label);
    appendText(meta, "span", "project-year", project.year);

    appendText(toggle, "span", "project-title", project.title);
    appendText(toggle, "span", "tagline", project.tagline);

    const tags = createElement("span", "tag-list");
    tags.setAttribute("role", "list");
    project.tags.forEach((tag) => {
      const tagElement = appendText(tags, "span", null, tag);
      tagElement.setAttribute("role", "listitem");
    });
    tags.setAttribute("aria-label", "Project tags");

    const cue = createElement("span", "expand-cue", "Expand");

    toggle.prepend(meta);
    toggle.append(tags, cue);

    const detail = createElement("div", "project-detail");
    detail.id = detailId;
    detail.setAttribute("aria-hidden", "true");

    const detailInner = createElement("div", "project-detail-inner");

    if (project.detail?.summary) {
      appendText(detailInner, "p", "project-summary", project.detail.summary);
    }

    project.detail?.sections?.forEach((section) => {
      const block = createElement("section", "detail-section");
      appendText(block, "h4", null, section.heading);
      appendText(block, "p", null, section.body);
      detailInner.appendChild(block);
    });

    if (project.detail?.links?.length) {
      const links = createElement("div", "detail-links");
      project.detail.links.forEach((link) => {
        if (!link.url) return;
        links.appendChild(
          createLink({
            label: link.label,
            href: link.url,
            type: link.url.startsWith("http") ? "external" : "internal",
          })
        );
      });
      detailInner.appendChild(links);
    }

    detail.appendChild(detailInner);

    toggle.addEventListener("click", () => {
      const shouldExpand = toggle.getAttribute("aria-expanded") !== "true";

      if (shouldExpand) {
        const projectedTop = getProjectCardTop(card) - getCollapsedHeightAbove(card, container);
        scrollProjectCardIntoView(card, projectedTop);

        container.querySelectorAll(".project-card.is-expanded").forEach((openCard) => {
          if (openCard !== card) {
            setProjectCardExpanded(openCard, false);
          }
        });
      }

      setProjectCardExpanded(card, shouldExpand);
    });

    card.append(toggle, detail);
    container.appendChild(card);
  });
};

const renderExperience = (roles) => {
  const container = document.querySelector("#experience-list");
  if (!container) return;

  container.replaceChildren();

  roles.forEach((role, index) => {
    const detailId = `experience-detail-${index}`;
    const item = createElement("article", "timeline-item");

    const marker = createElement("span", "timeline-marker");
    marker.setAttribute("aria-hidden", "true");

    const toggle = createElement("button", "timeline-toggle");
    toggle.type = "button";
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-controls", detailId);
    appendText(toggle, "span", "timeline-company", role.company);
    appendText(toggle, "span", "timeline-role", role.title);
    appendText(toggle, "span", "timeline-date", role.dates);

    const detail = createElement("div", "timeline-detail");
    detail.id = detailId;
    detail.setAttribute("aria-hidden", "true");

    const lines = createElement("div", "timeline-lines");
    role.lines.forEach((line) => appendText(lines, "p", null, line));
    detail.appendChild(lines);

    toggle.addEventListener("click", () => {
      const shouldExpand = toggle.getAttribute("aria-expanded") !== "true";

      if (shouldExpand) {
        container.querySelectorAll(".timeline-item.is-expanded").forEach((openItem) => {
          if (openItem !== item) {
            setTimelineItemExpanded(openItem, false);
          }
        });
      }

      setTimelineItemExpanded(item, shouldExpand);
    });

    item.append(marker, toggle, detail);
    container.appendChild(item);
  });
};

const renderCapabilities = (groups) => {
  const container = document.querySelector("#capability-list");
  if (!container) return;

  container.replaceChildren();

  groups.forEach((group) => {
    const section = createElement("section", "capability-domain");
    appendText(section, "h3", null, group.domain);

    const list = createElement("div", "tool-sea");
    list.setAttribute("role", "list");

    group.items.forEach((item) => {
      const tool = createElement("div", "tool-item");
      tool.setAttribute("role", "listitem");

      appendText(tool, "span", "tool-name", item.name);
      const detail = createElement("p", "tool-detail", item.detail);

      tool.appendChild(detail);
      list.appendChild(tool);
    });

    section.appendChild(list);
    container.appendChild(section);
  });
};

const renderContact = (profile) => {
  const container = document.querySelector("#contact-content");
  if (!container) return;

  container.replaceChildren();

  const copy = createElement("div", null);
  appendText(copy, "p", "eyebrow", "Contact");
  appendText(copy, "h2", null, "Professional links");
  appendText(copy, "p", null, "For role conversations, project review, or professional follow-up.");

  const links = createElement("address", "contact-links");
  profile.contact.forEach((contact) => {
    links.appendChild(createLink(contact));
  });

  container.append(copy, links);
};

const renderFallback = (error) => {
  document.querySelectorAll("[data-render]").forEach((container) => {
    container.replaceChildren();
    appendText(container, "p", "load-error", "Portfolio content could not load. Please refresh or view through GitHub Pages.");
  });

  console.error(error);
};

const renderSite = async () => {
  try {
    const [profile, projects, experience, capabilities] = await Promise.all([
      fetchJson(dataSources.profile),
      fetchJson(dataSources.projects),
      fetchJson(dataSources.experience),
      fetchJson(dataSources.capabilities),
    ]);

    renderHero(profile);
    renderProjects(projects);
    renderExperience(experience);
    renderCapabilities(capabilities);
    renderContact(profile);
    setupPointerField();
  } catch (error) {
    renderFallback(error);
  }
};

renderSite();
