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

        <p class="project-desp">${project.desp}</p>

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

function renderProjects(selector, list) {
  const grid = document.querySelector(selector);

  if (!grid) return;

  grid.innerHTML = list
    .map(createProjectCard)
    .join("");
}

function renderHomeProjects() {
  const featured = projects.filter(p =>
    ["pompkins-2", "sanshiba"].includes(p.id)
  );

  renderProjects(".projects-grid.home", featured.slice(0, 6));
}

function renderCommercialProjects() {
  const list = projects.filter(
    p => p.category.includes("commercial")
  );

  renderProjects(".projects-grid.commercial", list);
}

document.addEventListener("DOMContentLoaded", () => {

  if (document.querySelector(".projects-grid.home")) {
    renderHomeProjects();
  }

  if (document.querySelector(".projects-grid.commercial")) {
    renderCommercialProjects();
  }

});