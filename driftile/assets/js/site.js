(function () {
  const root = document.documentElement;
  const version = root.dataset.version || "";
  const download = root.dataset.download || "";

  document.querySelectorAll("[data-fill-version]").forEach((node) => {
    node.textContent = version;
  });

  document.querySelectorAll('a[href*="/downloads/"]').forEach((link) => {
    if (download) {
      link.setAttribute("href", download);
    }
  });

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) {
    document.body.classList.add("reduce-motion");
    return;
  }

  const fadeSeconds = 1.8;

  const isActiveHost = (host) =>
    host.classList.contains("is-live") || host.classList.contains("is-playing");

  const fadeWindow = (video) => {
    const duration = video.duration;
    if (!duration || !Number.isFinite(duration)) {
      return fadeSeconds;
    }
    return Math.min(fadeSeconds + 0.25, Math.max(0.8, duration * 0.35));
  };

  const bindLoopFade = (host, video) => {
    let restarting = false;

    video.addEventListener("timeupdate", () => {
      if (restarting || !isActiveHost(host)) {
        return;
      }
      const duration = video.duration;
      if (!duration || !Number.isFinite(duration)) {
        return;
      }
      if (video.currentTime >= duration - fadeWindow(video)) {
        host.classList.add("is-fading");
      }
    });

    video.addEventListener("ended", () => {
      if (!isActiveHost(host)) {
        return;
      }
      restarting = true;
      host.classList.add("is-fading");
      video.currentTime = 0;
      const start = video.play();
      const resume = () => {
        window.requestAnimationFrame(() => {
          host.classList.remove("is-fading");
          restarting = false;
        });
      };
      if (start && typeof start.then === "function") {
        start.then(resume).catch(() => {
          restarting = false;
        });
      } else {
        resume();
      }
    });
  };

  const hero = document.querySelector(".hero");
  const heroVideo = document.querySelector(".hero__video");
  if (hero && heroVideo) {
    const markLive = () => hero.classList.add("is-live");
    bindLoopFade(hero, heroVideo);
    heroVideo.addEventListener("playing", markLive);
    const playHero = heroVideo.play();
    if (playHero && typeof playHero.then === "function") {
      playHero.then(markLive).catch(() => {});
    }
  }

  const cards = Array.from(document.querySelectorAll(".profile-card"));
  if (!cards.length) {
    return;
  }

  let activeCard = null;
  let userPinned = null;

  const videoOf = (card) => card.querySelector("video");

  const unload = (card) => {
    const video = videoOf(card);
    if (!video) {
      return;
    }
    video.pause();
    video.removeAttribute("src");
    video.load();
    card.classList.remove("is-playing", "is-fading", "is-instant");
    if (activeCard === card) {
      activeCard = null;
    }
  };

  const playCard = (card) => {
    if (!card || activeCard === card) {
      return;
    }
    cards.forEach((other) => {
      if (other !== card) {
        unload(other);
      }
    });
    const video = videoOf(card);
    if (!video) {
      return;
    }
    if (!video.getAttribute("src")) {
      video.src = video.dataset.src;
    }
    const start = video.play();
    if (start && typeof start.then === "function") {
      start
        .then(() => {
          activeCard = card;
          card.classList.add("is-playing", "is-instant");
          void card.offsetWidth;
          window.requestAnimationFrame(() => {
            card.classList.remove("is-instant");
          });
        })
        .catch(() => {
          card.classList.remove("is-playing", "is-instant");
        });
    }
  };

  const stopCard = (card) => {
    if (!card) {
      return;
    }
    const video = videoOf(card);
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
    card.classList.remove("is-playing", "is-fading", "is-instant");
    if (activeCard === card) {
      activeCard = null;
    }
  };

  cards.forEach((card) => {
    const video = videoOf(card);
    if (video) {
      bindLoopFade(card, video);
    }
  });

  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (canHover) {
    cards.forEach((card) => {
      card.addEventListener("mouseenter", () => playCard(card));
      card.addEventListener("mouseleave", () => stopCard(card));
      card.addEventListener("focusin", () => playCard(card));
      card.addEventListener("focusout", (event) => {
        if (!card.contains(event.relatedTarget)) {
          stopCard(card);
        }
      });
    });
    return;
  }

  const ratios = new Map(cards.map((card) => [card, 0]));

  const pickVisible = () => {
    if (userPinned && ratios.get(userPinned) > 0.2) {
      playCard(userPinned);
      return;
    }
    if (userPinned && ratios.get(userPinned) <= 0.2) {
      userPinned = null;
    }
    let best = null;
    let bestRatio = 0;
    cards.forEach((card) => {
      const ratio = ratios.get(card) || 0;
      if (ratio > bestRatio) {
        best = card;
        bestRatio = ratio;
      }
    });
    if (best && bestRatio >= 0.55) {
      playCard(best);
    } else if (activeCard) {
      stopCard(activeCard);
    }
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        ratios.set(entry.target, entry.intersectionRatio);
      });
      pickVisible();
    },
    { threshold: [0, 0.25, 0.5, 0.55, 0.75, 1] }
  );

  cards.forEach((card) => {
    observer.observe(card);
    card.addEventListener("click", () => {
      if (activeCard === card) {
        userPinned = null;
        stopCard(card);
        return;
      }
      userPinned = card;
      playCard(card);
    });
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden && activeCard) {
      const video = videoOf(activeCard);
      if (video) {
        video.pause();
      }
    }
  });
})();
