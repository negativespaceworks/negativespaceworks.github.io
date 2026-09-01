(function () {
  const header = document.querySelector(".site-header");
  const hero = document.querySelector(".hero");
  if (!header || !hero) {
    return;
  }

  const show = () => {
    header.classList.add("is-visible");
    header.removeAttribute("aria-hidden");
    header.inert = false;
  };

  const hide = () => {
    header.classList.remove("is-visible");
    header.setAttribute("aria-hidden", "true");
    header.inert = true;
  };

  hide();

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        hide();
      } else {
        show();
      }
    },
    { threshold: 0 }
  );

  observer.observe(hero);
})();
