(function () {
  const header = document.querySelector(".site-header");
  const hero = document.querySelector(".hero");
  if (!header || !hero) {
    return;
  }

  let shown = false;
  let ticking = false;

  const setShown = (next) => {
    if (next === shown) {
      return;
    }
    shown = next;
    header.classList.toggle("is-visible", shown);
    if (shown) {
      header.removeAttribute("aria-hidden");
      header.inert = false;
    } else {
      header.setAttribute("aria-hidden", "true");
    }
  };

  const update = () => {
    ticking = false;
    const bottom = hero.getBoundingClientRect().bottom;
    if (!shown && bottom <= 0) {
      setShown(true);
    } else if (shown && bottom > 64) {
      setShown(false);
    }
  };

  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  };

  header.addEventListener("transitionend", (event) => {
    if (event.propertyName !== "transform") {
      return;
    }
    if (!shown) {
      header.inert = true;
    }
  });

  setShown(false);
  header.inert = true;
  update();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
})();
