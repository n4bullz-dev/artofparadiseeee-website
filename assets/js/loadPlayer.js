fetch("/components/media-player.html")
  .then(res => res.text())
  .then(html => {

    // Inject player HTML
    document.getElementById("player-root").innerHTML = html;

    // Start player AFTER HTML exists
    if (typeof initPlayer === "function") {
      initPlayer();
    }

  })
  .catch(err => console.error("Player load failed:", err));