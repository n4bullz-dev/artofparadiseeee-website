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

  /* ================= GET YOUTUBE EMBED URL ================= */
  function getYouTubeEmbedUrl(url) {

    if (!url) return "";

    let videoId = "";

    // Normal: https://www.youtube.com/watch?v=XXXX
    if (url.includes("watch?v=")) {
        videoId = url.split("watch?v=")[1].split("&")[0];
    }

    // Short: https://youtu.be/XXXX
    else if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1].split("?")[0];
    }

    if (!videoId) return "";

    return `https://www.youtube.com/embed/${videoId}`;
    }


  /* ================= LOAD YT WRAPPER ================= */

    fetch("/assets/components/yt-wrapper.html")
    .then(res => res.text())
    .then(html => {
        document.getElementById("video-container").innerHTML = html;

        // After loading component → set embed
        setupEmbed();
    });

    function setupEmbed() {

        const iframe = document.querySelector(".yt-wrapper iframe");

        if (!iframe) return;

        if (project.youtube) {

            const embedUrl = getYouTubeEmbedUrl(project.youtube);

            if (embedUrl) {
                iframe.src = embedUrl;
            }

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

  /* ================= PROJECT VIEWS ================= */

  function renderProjectViews() {

    const container = document.getElementById("project-views-container");

    if (!container) return;

    // If no views → don't show
    if (!project.views) return;

    const wrapper = document.createElement("div");
    wrapper.className = "project-views-page";

    const icon = document.createElement("span");
    icon.className = "play-icon";
    icon.textContent = "▶";

    const count = document.createElement("span");
    count.textContent = project.views;

    wrapper.appendChild(icon);
    wrapper.appendChild(count);

    container.appendChild(wrapper);
  }

  // Run
  renderProjectViews();

  /* ================= VIEW ON PLATFORM ================= */

  function detectPlatform(url) {

    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      return "youtube";
    }

    if (url.includes("instagram.com")) {
      return "instagram";
    }

    if (url.includes("tiktok.com")) {
      return "tiktok";
    }

    if (url.includes("facebook.com")) {
      return "facebook";
    }

    return null;
  }

  function renderPublishPlatforms() {

    const container = document.getElementById("publish-platform");

    if (!container) return;

    // If no publish data → do nothing
    if (!project.publish || project.publish.length === 0) {
      return;
    }

    const iconMap = {
      youtube: "/assets/images/view_youtube.png",
      instagram: "/assets/images/view_instagram.png",
      tiktok: "/assets/images/view_tiktok.png",
      facebook: "/assets/images/view_facebook.png"
    };

    const wrapper = document.createElement("div");
    wrapper.className = "publish-wrapper";

    // Title
    const title = document.createElement("p");
    title.textContent = "View on Platform";

    // Icons container
    const iconsDiv = document.createElement("div");
    iconsDiv.className = "publish-icons";

    project.publish.forEach(link => {

      const platform = detectPlatform(link);

      if (!platform || !iconMap[platform]) return;

      const a = document.createElement("a");
      a.href = link;
      a.target = "_blank";
      a.rel = "noopener noreferrer";

      const img = document.createElement("img");
      img.src = iconMap[platform];
      img.alt = platform;

      a.appendChild(img);
      iconsDiv.appendChild(a);

    });

    // If no valid platform detected → don't render
    if (iconsDiv.children.length === 0) return;

    wrapper.appendChild(title);
    wrapper.appendChild(iconsDiv);

    container.appendChild(wrapper);
  }

  // Run after project is loaded
  renderPublishPlatforms();

  /* ================= WORKS GALLERY ================= */

  function getSlug() {
    return window.location.pathname
      .split("/")
      .filter(Boolean)[0];
  }

  async function loadGalleryManifest(slug) {

    try {

      const res = await fetch(`/${slug}/gallery/gallery.js`);

      if (!res.ok) return null;

      const text = await res.text();

      // Execute file safely
      const script = document.createElement("script");
      script.textContent = text;

      document.body.appendChild(script);

      return window.galleryImages || null;

    } catch {

      return null;
    }
  }

  async function renderWorksGallery() {

    const container =
      document.getElementById("works-gallery-container");

    if (!container) return;

    const slug = getSlug();

    if (!slug) return;

    const images = await loadGalleryManifest(slug);

    if (!images || images.length === 0) return;

    /* Build UI */

    const wrapper = document.createElement("div");
    wrapper.className = "works-gallery-wrapper";

    const header = document.createElement("div");
    header.className = "works-gallery-header";

    header.innerHTML = `
      <span>▶</span>
      <div>Work Gallery</div>
    `;

    const content = document.createElement("div");
    content.className = "works-gallery-content";

    const grid = document.createElement("div");
    grid.className = "works-gallery-grid";

    images.forEach(file => {

      const img = document.createElement("img");

      img.src = `/${slug}/gallery/${file}`;
      img.alt = "Gallery Image";
      img.loading = "lazy";

      grid.appendChild(img);

    });

    content.appendChild(grid);

    wrapper.appendChild(header);
    wrapper.appendChild(content);

    container.appendChild(wrapper);

    /* Toggle */

    initAllDropdowns(); 
  }

  /* Run */
  renderWorksGallery();

  /* ================= GALLERY LIGHTBOX ================= */

  function initGalleryLightbox() {

    const lightbox = document.createElement("div");
    lightbox.id = "gallery-lightbox";
    lightbox.className = "gallery-lightbox";

    lightbox.innerHTML = `
      <span class="lightbox-close">&times;</span>
      <img class="lightbox-image" src="" alt="">
    `;

    document.body.appendChild(lightbox);

    const lightboxImg =
      lightbox.querySelector(".lightbox-image");

    const closeBtn =
      lightbox.querySelector(".lightbox-close");


    /* Open */
    document.addEventListener("click", e => {

      const img = e.target.closest(
        ".works-gallery-grid img"
      );

      if (!img) return;

      lightboxImg.src = img.src;

      lightbox.classList.add("active");

    });


    /* Close button */
    closeBtn.addEventListener("click", close);


    /* Click background */
    lightbox.addEventListener("click", e => {

      if (e.target === lightbox) {
        close();
      }

    });


    /* ESC key */
    document.addEventListener("keydown", e => {

      if (e.key === "Escape") {
        close();
      }

    });


    function close() {

      lightbox.classList.remove("active");

      lightboxImg.src = "";

    }
  }


  /* Init after gallery loads */
  setTimeout(initGalleryLightbox, 300);

  /* ===== Random 8 Featured Works ===== */

    const grid =
    document.querySelector(".projects-grid.featured-random");

    if (!grid) return;

    // Remove page class (optional, keep if you want)
    grid.classList.remove("page");

    // Get all projects except current
    let list = projects.filter(p => p.id !== project.id);

    // Shuffle (Fisher–Yates)
    for (let i = list.length - 1; i > 0; i--) {

      const j = Math.floor(Math.random() * (i + 1));

      [list[i], list[j]] = [list[j], list[i]];
    }

    // Take only 8
    list = list.slice(0, 8);

    // Render (your template)
    grid.innerHTML = list.map(project => `

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

    `).join("");

  /* ================= VFX DROPDOWN ================= */

  function initVFXDropdown() {

    const wrappers = document.querySelectorAll(
      ".works-gallery-wrapper"
    );

    wrappers.forEach(wrapper => {

      const header = wrapper.querySelector(
        ".works-gallery-header"
      );

      if (!header) return;

    });
  }

  // Run after page loads
  setTimeout(initVFXDropdown, 200);

  /* ================= DROPDOWN SYSTEM ================= */

  function initAllDropdowns() {

    const wrappers = document.querySelectorAll(
      ".works-gallery-wrapper"
    );

    wrappers.forEach(wrapper => {

      if (wrapper.dataset.ready) return; // prevent duplicate
      wrapper.dataset.ready = "true";

      const header = wrapper.querySelector(
        ".works-gallery-header"
      );

      if (!header) return;

      header.onclick = () => {
        wrapper.classList.toggle("open");
      };

    });

  }
}