async function loadComponent(id, file) {
  const res = await fetch(file);
  const html = await res.text();
  document.getElementById(id).innerHTML = html;
}

function initActiveNav() {
  const links = document.querySelectorAll(".nav-links a");
  const currentPath = window.location.pathname.replace(/\/$/, "");

  links.forEach(link => {
    const linkPath = new URL(link.href).pathname.replace(/\/$/, "");

    // Clear first (safety)
    link.classList.remove("active");

    /* 1. Exact match */
    if (currentPath === linkPath) {
      link.classList.add("active");
      return; // stop here for this link
    }

    /* 2. Parent highlight ONLY when on main page */
    if (
      currentPath === "/works" &&
      linkPath === "/works"
    ) {
      link.classList.add("active");
      return;
    }

    if (
      currentPath === "/expertise" &&
      linkPath === "/expertise"
    ) {
      link.classList.add("active");
      return;
    }
  });
}

/* Load all components */
async function loadAll() {
  await loadComponent("header", "/assets/components/header.html");
  await loadComponent("sidebar-container", "/assets/components/sidebar.html");
  await loadComponent("footer", "/assets/components/footer.html");

  initSidebar(); // ✅ Run AFTER load
  initActiveNav();
}

loadAll();

/* ================= INIT SIDEBAR ================= */

function initSidebar() {

  const menuBtn = document.getElementById('menuBtn');
  const closeBtn = document.getElementById('closeBtn');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');

  let savedSidebarWidth = null;


  /* Safety check */
  if (!menuBtn || !sidebar) {
    console.warn("Sidebar elements not loaded");
    return;
  }


  /* ================= OPEN / CLOSE ================= */

  menuBtn.addEventListener('click', () => {
    sidebar.classList.add('open');

    if (window.innerWidth <= 1024 && window.innerWidth > 600) {
      overlay?.classList.add('active');
    }
  });

  closeBtn?.addEventListener('click', closeSidebar);
  overlay?.addEventListener('click', closeSidebar);


  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay?.classList.remove('active');
  }


  /* ================= DROPDOWNS ================= */

  document.querySelectorAll('[data-toggle]').forEach(toggle => {

    toggle.addEventListener('click', e => {

      if (window.innerWidth <= 1024) {

        e.preventDefault();

        const current = toggle.closest('.dropdown');
        current.classList.toggle('open');

      }

    });

  });


  /* ================= WIDTH SYSTEM ================= */

  function handleSidebarWidth() {

    const width = window.innerWidth;

    /* Tablet */
    if (width <= 1024 && width > 600) {

      sidebar.style.width = '400px';
      savedSidebarWidth = '400px';

    }

    /* Phone */
    else if (width <= 600) {

      sidebar.style.width = '100%';
      savedSidebarWidth = '100%';

    }

    /* Desktop */
    else {

      if (savedSidebarWidth) {
        sidebar.style.width = savedSidebarWidth;
      }

      sidebar.classList.remove('open');

      document.querySelectorAll('.dropdown').forEach(item => {
        item.classList.remove('open');
      });

    }
  }


  handleSidebarWidth();
  window.addEventListener('resize', handleSidebarWidth);
}