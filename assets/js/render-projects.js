/* ========================= ! CREATE CARD =============================== */

function createProjectCard(project) {
  return `
    <a href="${project.url}" class="project-card">

      <div class="project-image"
        style="background-image:
          linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0)),
          url('${project.image}');
        ">
      </div>

      <div class="project-content">

        <h3 class="project-title">${project.title}</h3>

        <p class="project-desp">${getProjectDesp(project)}</p>

        ${
          project.views
            ? `
          <div class="project-views">
            <span class="play-icon">▶</span>
            <span>${project.views}</span>
          </div>
          `
            : ""
        }

      </div>

    </a>
  `;
}

/* ========================= ! SWITCH DESP =============================== */

function getProjectDesp(project) {
  const path = window.location.pathname;

  // If desp is not array (backup safety)
  if (!Array.isArray(project.desp)) {
    return project.desp || "";
  }

  // Works pages
  if (path.startsWith("/works")) {
    return project.desp[1] || project.desp[0];
  }

  // Expertise pages
  if (path.startsWith("/expertise")) {
    return project.desp[0];
  }

  // Default fallback
  return project.desp[0];
}

/* ========================= ! BY ORDER =============================== */

function getProjectsByOrder(ids) {
  return ids
    .map(id => projects.find(p => p.id === id))
    .filter(Boolean);
}

/* ========================= ! RENDERING =============================== */

function renderProjects(selector, list) {
  const grid = document.querySelector(selector);

  if (!grid) return;

  grid.innerHTML = list
    .map(createProjectCard)
    .join("");
}

/* ========================= ! HOME =============================== */

function renderHomeProjects() {
  const featured = getProjectsByOrder([
    "pompkins-2",
    "nac-long",
    "cu-fmn-2024",
    "sanshiba",
    "silent-sea-empty-nets",
    "the-most-bittersweet-feelings"
  ]);

  renderProjects(".projects-grid.home", featured);
}

/* ========================= ! CATEGORY =============================== */

function renderAwardProjects() {
  const list = projects.filter(
    p => p.category.includes("award")
  );

  renderProjects(".projects-grid.award", list);
}

function renderTeaserProjects() {
  const list = projects.filter(
    p => p.category.includes("teaser")
  );

  renderProjects(".projects-grid.teaser", list);
}

function renderShortFilmProjects() {
  const list = projects.filter(
    p => p.category.includes("shortfilm")
  );

  renderProjects(".projects-grid.shortfilm", list);
}

function renderMusicVideoProjects() {
  const list = projects.filter(
    p => p.category.includes("musicvideo")
  );

  renderProjects(".projects-grid.musicvideo", list);
}

function renderDocumentaryProjects() {
  const list = projects.filter(
    p => p.category.includes("documentary")
  );

  renderProjects(".projects-grid.documentary", list);
}


function renderCommercialProjects() {
  const list = projects.filter(
    p => p.category.includes("commercial")
  );

  renderProjects(".projects-grid.commercial", list);
}

function renderPerformanceProjects() {
  const list = projects.filter(
    p => p.category.includes("performance")
  );

  renderProjects(".projects-grid.performance", list);
}

function renderLEDProjects() {
  const list = projects.filter(
    p => p.category.includes("led")
  );

  renderProjects(".projects-grid.led", list);
}

function renderPhotographyProjects() {
  const list = projects.filter(
    p => p.category.includes("photography")
  );

  renderProjects(".projects-grid.photography", list);
}

/* ========================= ! EXPERTISE =============================== */

function renderDirectorProjects() {
  const list = projects.filter(
    p => p.role.includes("director")
  );

  renderProjects(".projects-grid.director", list);
}

function renderCinematographerProjects() {
  const list = projects.filter(
    p => p.role.includes("cinematographer")
  );

  renderProjects(".projects-grid.cinematographer", list);
}

function renderEditorProjects() {
  const list = projects.filter(
    p => p.role.includes("editor")
  );

  renderProjects(".projects-grid.editor", list);
}

function renderColoristProjects() {
  const list = projects.filter(
    p => p.role.includes("colorist")
  );

  renderProjects(".projects-grid.colorist", list);
}

function renderVFXProjects() {
  const list = projects.filter(
    p => p.role.includes("vfx")
  );

  renderProjects(".projects-grid.vfx", list);
}

/* ========================= RENDER FOR EACH PAGES =============================== */

document.addEventListener("DOMContentLoaded", () => {

  if (document.querySelector(".projects-grid.home")) {
    renderHomeProjects();
  }

/* CATEGORY RENDER */
  if (document.querySelector(".projects-grid.award")) {
    renderAwardProjects();
  }

  if (document.querySelector(".projects-grid.teaser")) {
    renderTeaserProjects();
  }

  if (document.querySelector(".projects-grid.shortfilm")) {
    renderShortFilmProjects();
  }

  if (document.querySelector(".projects-grid.musicvideo")) {
    renderMusicVideoProjects();
  }

  if (document.querySelector(".projects-grid.documentary")) {
    renderDocumentaryProjects();
  }

  if (document.querySelector(".projects-grid.commercial")) {
    renderCommercialProjects();
  }

  if (document.querySelector(".projects-grid.performance")) {
    renderPerformanceProjects();
  }

  if (document.querySelector(".projects-grid.led")) {
    renderLEDProjects();
  }

  if (document.querySelector(".projects-grid.photography")) {
    renderPhotographyProjects();
  }

/* ROLE RENDER */
  if (document.querySelector(".projects-grid.director")) {
    renderDirectorProjects();
  }

  if (document.querySelector(".projects-grid.cinematographer")) {
    renderCinematographerProjects();
  }

  if (document.querySelector(".projects-grid.editor")) {
    renderEditorProjects();
  }

  if (document.querySelector(".projects-grid.colorist")) {
    renderColoristProjects();
  }

  if (document.querySelector(".projects-grid.vfx")) {
    renderVFXProjects();
  }

});