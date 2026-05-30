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
  const response = await fetch(path);

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
  appendText(copy, "p", "eyebrow", "Systems / AI Operations / Platform Direction");
  appendText(copy, "h1", null, profile.name);
  appendText(copy, "p", "identity-line", profile.identity);
  appendText(copy, "p", "hero-summary", profile.summary);

  const linkRow = createElement("div", "link-row");
  profile.contact.forEach((contact) => {
    linkRow.appendChild(createLink(contact));
  });
  copy.appendChild(linkRow);

  appendText(copy, "p", "muted-note hero-note", profile.resume_note);

  container.appendChild(copy);
};

const renderApproach = (profile) => {
  const container = document.querySelector("#approach-content");
  if (!container) return;

  container.replaceChildren();

  profile.approach.forEach((principle) => {
    const card = createElement("article", "principle-card");
    appendText(card, "span", "card-index", principle.id);
    appendText(card, "h3", null, principle.title);
    appendText(card, "p", null, principle.body);
    container.appendChild(card);
  });
};

const renderProjects = (projects) => {
  const container = document.querySelector("#project-list");
  if (!container) return;

  container.replaceChildren();

  projects.forEach((project) => {
    const card = createElement("article", project.featured ? "project-card featured" : "project-card");
    appendText(card, "p", "status", `${project.status} / ${project.year}`);
    appendText(card, "h3", null, project.title);
    appendText(card, "p", "tagline", project.tagline);
    appendText(card, "p", null, project.summary);

    const tags = createElement("ul", "tag-list");
    project.tags.forEach((tag) => appendText(tags, "li", null, tag));
    card.appendChild(tags);

    const actions = createElement("div", "project-actions");

    if (project.case_study_path) {
      actions.appendChild(
        createLink({
          label: "Case study",
          href: project.case_study_path,
          type: "internal",
        })
      );
    } else {
      appendText(actions, "span", "muted-note", "Case study pending review");
    }

    Object.entries(project.links || {}).forEach(([label, href]) => {
      if (!href) return;
      actions.appendChild(createLink({ label, href, type: "external" }));
    });

    card.appendChild(actions);
    container.appendChild(card);
  });
};

const renderExperience = (roles) => {
  const container = document.querySelector("#experience-list");
  if (!container) return;

  container.replaceChildren();

  roles.forEach((role) => {
    const item = createElement("article", "timeline-item");
    const header = createElement("div", "timeline-heading");
    appendText(header, "h3", null, role.company);
    appendText(header, "p", "role", `${role.title} / ${role.dates}`);

    const bullets = createElement("ul", null);
    role.bullets.forEach((bullet) => appendText(bullets, "li", null, bullet));

    item.append(header, bullets);
    container.appendChild(item);
  });
};

const renderCapabilities = (groups) => {
  const container = document.querySelector("#capability-list");
  if (!container) return;

  container.replaceChildren();

  groups.forEach((group) => {
    const card = createElement("section", "capability-card");
    appendText(card, "h3", null, group.group);

    const list = createElement("ul", null);
    group.items.forEach((item) => appendText(list, "li", null, item));

    card.appendChild(list);
    container.appendChild(card);
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
    renderApproach(profile);
    renderProjects(projects);
    renderExperience(experience);
    renderCapabilities(capabilities);
    renderContact(profile);
  } catch (error) {
    renderFallback(error);
  }
};

renderSite();
