// player.js

const video = document.getElementById("video");
const playBtn = document.getElementById("playBtn");
const timeline = document.getElementById("timeline");
const fullscreenBtn = document.getElementById("fullscreenBtn");
const time = document.getElementById("time");
const volume = document.getElementById("volume");
const title = document.getElementById("title");

const wrapper = document.querySelector(".video-wrapper");


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
  title.textContent = project.title;

}


// ================= PLAY / PAUSE =================

playBtn.addEventListener("click", () => {

  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }

});

video.addEventListener("play", () => {
  playBtn.textContent = "⏸";
});

video.addEventListener("pause", () => {
  playBtn.textContent = "▶";
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

// Set default volume
video.volume = volume.value;


// Update volume UI
function updateVolumeUI() {

  const percent = volume.value * 100;

  volume.style.background =
    `linear-gradient(
      to right,
      #fff ${percent}%,
      rgba(255,255,255,0.3) ${percent}%
    )`;
}


// Init on load
updateVolumeUI();


// Change volume
volume.addEventListener("input", () => {

  video.volume = volume.value;

  updateVolumeUI();

});

// ================= FULLSCREEN =================

fullscreenBtn.addEventListener("click", () => {

  if (!document.fullscreenElement) {
    wrapper.requestFullscreen();
  } else {
    document.exitFullscreen();
  }

});