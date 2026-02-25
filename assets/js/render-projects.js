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


  // Safety
  if (!Array.isArray(project.desp)) {
    return project.desp || "";
  }


  /* ================= WORKS ================= */

  if (path.startsWith("/works")) {
    return project.desp[1] || project.desp[0];
  }


  /* ================= EXPERTISE ================= */

  if (path.startsWith("/expertise")) {

    // Extract slug
    let slug = path.split("/expertise/")[1] || "";
    slug = slug.replace(/^\/|\/$/g, "");


    /* ---------- ROLE MAP ---------- */

    const roleMap = {
      "director": "Director",
      "cinematographer": "Cinematographer",
      "editor": "Editor",
      "colorist": "Colorist",
      "vfx-artist": "VFX Artist"
    };


    let role =
      roleMap[slug] ||
      slug
        .split("-")
        .map(w => w[0].toUpperCase() + w.slice(1))
        .join(" ");


    /* ---------- SPECIAL OVERRIDES ---------- */

    const overrides = {
      "VFX Artist": {
        "login-led": "VFX/3D Artist"
      }

      // Add more later:
      // "Director": {
      //   "some-id": "Creative Director"
      // }
    };


    // Apply override if exists
    if (overrides[role] && overrides[role][project.id]) {
      return overrides[role][project.id];
    }


    /* ---------- DEFAULT ---------- */

    return role;
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
    "cu-fmn-2024",
    "nac-long",
    "sanshiba",
    "cucm25-teaser",
    "the-most-bittersweet-feelings",
    
  ]);

  renderProjects(".projects-grid.home", featured);
}

  /* ========================= UNIVERSAL PROJECT RENDER ========================= */

function parseViews(views) {
  if (!views) return -1; // null / undefined go last

  const str = views.toString().toUpperCase().trim();

  if (str.endsWith("M")) {
    return parseFloat(str) * 1_000_000;
  }

  if (str.endsWith("K")) {
    return parseFloat(str) * 1_000;
  }

  return parseFloat(str) || 0;
}

function renderFilteredProjects(selector, options = {}) {

  const { category, role } = options;

  const path = window.location.pathname;


  let list = projects.filter(p => {

    let matchCategory = true;
    let matchRole = true;

    // If category is provided → must match
    if (category) {
      matchCategory = p.category?.includes(category);
    }

    // If role is provided → must match
    if (role) {
      matchRole = p.role?.includes(role);
    }

    return matchCategory && matchRole;

  });


  /* ================= SORT FOR EXPERTISE ================= */

  if (path.startsWith("/expertise")) {

    list.sort((a, b) => {

      const viewsA = parseViews(a.views);
      const viewsB = parseViews(b.views);

      // Highest → Lowest
      return viewsB - viewsA;

    });

  }


  /* ================= RENDER ================= */

  renderProjects(selector, list);
}


/* ========================= AUTO PAGE DETECTION ========================= */

document.addEventListener("DOMContentLoaded", () => {

  document.querySelectorAll(".projects-grid").forEach(grid => {

    const classes = grid.classList;

    // Ignore home
    if (classes.contains("home")) {
      renderHomeProjects();
      return;
    }

    let category = null;
    let role = null;


    /* CATEGORY MAP */
    const categories = [
      "award",
      "teaser",
      "shortfilm",
      "musicvideo",
      "documentary",
      "commercial",
      "performance",
      "led",
      "photography"
    ];

    /* ROLE MAP */
    const roles = [
      "director",
      "cinematographer",
      "editor",
      "colorist",
      "vfx"
    ];


    // Detect category from class
    categories.forEach(c => {
      if (classes.contains(c)) {
        category = c;
      }
    });


    // Detect role from class
    roles.forEach(r => {
      if (classes.contains(r)) {
        role = r;
      }
    });


    // Render
    renderFilteredProjects(
      `.${[...classes].join(".")}`,
      { category, role }
    );

  });

});