  // player.js
document.addEventListener("DOMContentLoaded", initPlayer);

function initPlayer() {
  const thumbnail = document.getElementById("thumbnail");
  const loader = document.getElementById("loader");
  const video = document.getElementById("video");
  const playBtn = document.getElementById("playBtn");
  const centerPlay = document.getElementById("centerPlay");
  const timeline = document.getElementById("timeline");
  const fullscreenBtn = document.getElementById("fullscreenBtn");
  const time = document.getElementById("time");
  const muteBtn = document.getElementById("muteBtn");
  const volume = document.getElementById("volume");
  const title = document.getElementById("title");
  const category = document.getElementById("category");
  const role = document.getElementById("role");

  const wrapper = document.querySelector(".video-wrapper");
  const volumeIcon = document.getElementById("volumeIcon");

  // Volume SVG Icons
  const icons = {
    high: `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
        <path d="M15 9a5 5 0 0 1 0 6"/>
        <path d="M19 5a9 9 0 0 1 0 14"/>
      </svg>
    `,

    low: `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
        <path d="M15 12a2 2 0 0 1 0 0"/>
      </svg>
    `,

    mute: `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
        <line x1="23" y1="9" x2="17" y2="15"/>
        <line x1="17" y1="9" x2="23" y2="15"/>
      </svg>
    `
  };

  

  // ================= GET SLUG =================

  const path = window.location.pathname;
  const slug = path.split("/").filter(Boolean)[0];


  // ================= FIND PROJECT =================

  const project = projects.find(p => p.id === slug);

  if (!project) {

    console.error("Project not found:", slug);

  } else if (!project.videoURL) {

    console.error("No videoURL for:", project.id);

  } else {

    video.src = project.videoURL;
    thumbnail.style.backgroundImage = `url(${project.image})`;
    
    if (title) title.textContent = project.title;
    if (category) category.textContent = project.desp[0];
    if (role) role.textContent = project.desp[1];
  }

  /* ================= LOADING STATE ================= */

  let started = false;

  function markStarted() {
    started = true;
  }

  centerPlay.addEventListener("click", markStarted);
  playBtn.addEventListener("click", markStarted);
  video.addEventListener("click", markStarted);

    // When video starts loading
    video.addEventListener("loadstart", () => {
      if (loader) loader.classList.add("active");
    });

    // When buffering
    video.addEventListener("waiting", () => {
      if (started) loader.classList.add("active");
    });

    // When video can play
    video.addEventListener("canplay", () => {
      if (loader) loader.classList.remove("active");
    });

    // When playing normally
    video.addEventListener("playing", () => {
      if (loader) loader.classList.remove("active");
    });

    video.addEventListener("error", () => {
      if (loader) loader.classList.remove("active");
      console.error("Video failed to load");
    });

  // ================= PLAY / PAUSE =================

  playBtn.addEventListener("click", () => {

    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }

  });

  // ================= TIMELINE =================

  video.addEventListener("timeupdate", () => {

    if (!video.duration) return;

    const percent =
      (video.currentTime / video.duration) * 100;

    timeline.value = percent;

    // Progress color
    timeline.style.background =
      `linear-gradient(
        to right,
        #fff ${percent}%,
        rgba(255,255,255,0.3) ${percent}%
      )`;

    updateTime();
  });

  function updateTimelineUI(percent) {
    timeline.style.background =
      `linear-gradient(
        to right,
        #fff ${percent}%,
        rgba(255,255,255,0.3) ${percent}%
      )`;
  }


  timeline.addEventListener("input", () => {

    const seek =
      (timeline.value / 100) * video.duration;

    video.currentTime = seek;
  });


  // ================= TIME =================

  function formatTime(sec) {

    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);

    return `${m}:${s < 10 ? "0" : ""}${s}`;
  }


  function updateTime() {

    if (!video.duration) return;

    time.textContent =
      `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;

  }

  // ================= VOLUME =================

  let lastVolume = volume.value;

  // Update UI
  function updateVolumeUI() {

    const percent = volume.value * 100;

    volume.style.background =
      `linear-gradient(
        to right,
        #fff ${percent}%,
        rgba(255,255,255,0.3) ${percent}%
      )`;

    // Update icon
    if (video.muted || volume.value == 0) {
      volumeIcon.innerHTML = icons.mute;

    } else if (volume.value < 0.5) {
      volumeIcon.innerHTML = icons.low;

    } else {
      volumeIcon.innerHTML = icons.high;
    }
  }


  // Init
  video.volume = volume.value;
  updateVolumeUI();


  // Slider change
  volume.addEventListener("input", () => {

    video.volume = volume.value;

    // If volume > 0 → unmute and save
    if (volume.value > 0) {

      video.muted = false;
      lastVolume = volume.value;

    } else {

      // If dragged to 0 → mute
      video.muted = true;
    }

    updateVolumeUI();

  });


  // Mute button
  muteBtn.addEventListener("click", () => {

    if (!video.muted && volume.value > 0) {

      // Save volume
      lastVolume = volume.value;

      // Mute
      video.muted = true;
      volume.value = 0;

    } else {

      // Restore
      video.muted = false;

      volume.value = lastVolume > 0 ? lastVolume : 0.5;
      video.volume = volume.value;

    }

    updateVolumeUI();

  });

  // ================= FULLSCREEN =================

  fullscreenBtn.addEventListener("click", () => {

    if (!document.fullscreenElement) {
      wrapper.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen();
    }

  });

  // ================= UI CONTROLS =================

  let hideTimeout;


  // Show controls
  function showUI() {
    document.querySelector(".controls").classList.remove("hide");

    // Only show center play when paused
    if (video.paused) {
      centerPlay.classList.remove("hidden");
    } else {
      centerPlay.classList.add("hidden");
    }

    clearTimeout(hideTimeout);

    if (!video.paused) {
      hideTimeout = setTimeout(hideUI, 2500);
    }
  }


  // Hide controls
  function hideUI() {
    document.querySelector(".controls").classList.add("hide");
    centerPlay.classList.add("hidden");
  }


  // ================= CENTER PLAY =================

  centerPlay.addEventListener("click", () => {

    if (loader) loader.classList.add("active");

    video.play().catch(() => {});
  });

  // ================= CLICK VIDEO =================

  video.addEventListener("click", () => {

    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }

  });


  // ================= AUTO HIDE =================

  // Mouse move → show UI
  wrapper.addEventListener("mousemove", showUI);


  // When play → hide later
  video.addEventListener("play", () => {

    playBtn.textContent = "⏸";

    centerPlay.classList.add("hidden");

    // Hide thumbnail
    thumbnail.classList.add("hidden");

    hideTimeout = setTimeout(hideUI, 2500);

  });

  video.addEventListener("ended", () => {

    thumbnail.classList.remove("hidden");
    centerPlay.classList.remove("hidden");

    showUI();

  });

  // When pause → always show
  video.addEventListener("pause", () => {

    playBtn.textContent = "▶";

    showUI();

  });

  showUI();
}