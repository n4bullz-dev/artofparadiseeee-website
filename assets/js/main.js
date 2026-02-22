/* ================= VARIABLES ================= */

const menuBtn = document.getElementById('menuBtn');
const closeBtn = document.getElementById('closeBtn');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('sidebarOverlay');

let savedSidebarWidth = null;


/* ================= OPEN / CLOSE ================= */

menuBtn.addEventListener('click', () => {
  sidebar.classList.add('open');

  if (window.innerWidth <= 1024 && window.innerWidth > 600) {
    overlay.classList.add('active');
  }
});

closeBtn.addEventListener('click', closeSidebar);
overlay.addEventListener('click', closeSidebar);

function closeSidebar() {
  sidebar.classList.remove('open');
  overlay.classList.remove('active');
}



/* ================= DROPDOWNS ================= */

document.querySelectorAll('[data-toggle]').forEach(toggle => {

  toggle.addEventListener('click', e => {

    if (window.innerWidth <= 1024) {

      e.preventDefault();

      const current = toggle.closest('.dropdown');

      // document.querySelectorAll('.dropdown').forEach(item => {
      //   if (item !== current) {
      //     item.classList.remove('open');
      //   }
      // });

      current.classList.toggle('open');

    }

  });

});


/* ================= WIDTH LOCK SYSTEM ================= */

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

    /* Keep last width instead of shrinking */
    if (savedSidebarWidth) {
      sidebar.style.width = savedSidebarWidth;
    }

    sidebar.classList.remove('open');

    document.querySelectorAll('.dropdown').forEach(item => {
      item.classList.remove('open');
    });

  }
}

/* Run on load */
handleSidebarWidth();

/* Run on resize */
window.addEventListener('resize', handleSidebarWidth);