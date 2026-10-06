(function () {
  const root = document.documentElement;
  const version = root.dataset.version || "";
  const download = root.dataset.download || "";

  document.querySelectorAll("[data-fill-version]").forEach((node) => {
    node.textContent = version;
  });

  if (download) {
    document.querySelectorAll("#download a.button").forEach((link) => {
      link.setAttribute("href", download);
    });
  }

  const copyText = (text) => {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise((resolve, reject) => {
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.left = "-9999px";
      document.body.appendChild(area);
      area.select();
      try {
        const ok = document.execCommand("copy");
        document.body.removeChild(area);
        if (ok) {
          resolve();
        } else {
          reject(new Error("copy failed"));
        }
      } catch (error) {
        document.body.removeChild(area);
        reject(error);
      }
    });
  };

  const copyButton = document.querySelector("[data-copy-link]");
  if (copyButton) {
    const status = document.querySelector("[data-copy-status]");
    const idleLabel = copyButton.textContent;
    const copiedLabel = copyButton.getAttribute("data-copied-label") || "Copied";
    copyButton.addEventListener("click", () => {
      const canonical = document.querySelector('link[rel="canonical"]');
      const url = (canonical && canonical.href) || window.location.href;
      copyText(url)
        .then(() => {
          copyButton.textContent = copiedLabel;
          if (status) {
            status.textContent = copiedLabel;
          }
          window.setTimeout(() => {
            copyButton.textContent = idleLabel;
            if (status) {
              status.textContent = "";
            }
          }, 2000);
        })
        .catch(() => {
          if (status) {
            status.textContent = url;
          }
        });
    });
  }

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

  const hero = document.querySelector(".product-hero");
  const heroVideo = document.querySelector(".product-hero__video");
  if (hero && heroVideo) {
    let shown = false;
    let bound = false;
    const playButton = hero.querySelector("[data-play-preview]");
    const markLive = () => {
      if (shown) {
        return;
      }
      shown = true;
      hero.classList.add("is-live", "is-instant");
      void hero.offsetWidth;
      window.requestAnimationFrame(() => {
        hero.classList.remove("is-instant");
      });
    };
    const startHero = () => {
      if (!heroVideo.getAttribute("src") && heroVideo.dataset.src) {
        heroVideo.src = heroVideo.dataset.src;
      }
      if (!bound) {
        bound = true;
        bindLoopFade(hero, heroVideo);
        heroVideo.addEventListener("playing", markLive);
      }
      const playHero = heroVideo.play();
      if (playHero && typeof playHero.then === "function") {
        playHero.then(markLive).catch(() => {
          if (playButton) {
            playButton.classList.add("is-needed");
          }
        });
      }
    };
    const desktop = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (desktop) {
      startHero();
    } else if (playButton) {
      playButton.addEventListener("click", startHero);
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
