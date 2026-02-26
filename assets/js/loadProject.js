// loadProject.js
document.addEventListener("DOMContentLoaded", loadProject);

function loadProject() {

  const titleEl = document.getElementById("title");
  const categoryEl = document.getElementById("category");
  const roleEl = document.getElementById("role");


  /* ================= META DESCRIPTION ================= */

  function setMetaDescription(text) {

    let meta = document.querySelector('meta[name="description"]');

    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }

    meta.content = text;
  }

  /* ================= GET SLUG ================= */

  // Example: /day-one/  → day-one
  const path = window.location.pathname;

  const slug = path
    .split("/")
    .filter(Boolean)[0];

  /* ================= FIND PROJECT ================= */

  const project = projects.find(p => p.id === slug);

  if (!project) {
    console.error("Project not found:", slug);
    return;
  }


  /* ================= LOAD YT WRAPPER ================= */

    fetch("/components/yt-wrapper.html")
    .then(res => res.text())
    .then(html => {
        document.getElementById("video-container").innerHTML = html;

        // After loading component → set embed
        setupEmbed();
    });

    function setupEmbed() {

        const iframe = document.querySelector(".yt-wrapper iframe");

        if (iframe && project.embed) {
            iframe.src = project.embed;
        }

    }

  /* ================= SET TITLE ================= */

  if (titleEl) {

    titleEl.textContent = project.title;

    // Browser tab title
    document.title = `${project.title} - artofparadiseeee`;

    // Meta description
    setMetaDescription(
      `${project.title} — ${project.desp?.join(" / ") || ""} by artofparadiseeee`
    );
  }


  /* ================= SET CATEGORY / ROLE ================= */

  if (categoryEl) {
    categoryEl.textContent = project.desp?.[0] || "";
  }

  if (roleEl) {
    roleEl.textContent = project.desp?.[1] || "";
  }

}