(function () {
  var STORAGE_KEY = "nsw-locale";
  var pageLocale = document.documentElement.getAttribute("data-locale") || "en";

  function prefersJa() {
    var primary = "";
    if (navigator.languages && navigator.languages.length) {
      primary = navigator.languages[0];
    } else {
      primary = navigator.language || "";
    }
    return String(primary).toLowerCase().indexOf("ja") === 0;
  }

  function isJaPath(pathname) {
    return pathname === "/ja" || pathname.indexOf("/ja/") === 0;
  }

  function counterpartPath(pathname, target) {
    var path = pathname || "/";
    if (target === "ja") {
      if (isJaPath(path)) {
        return path === "/ja" ? "/ja/" : path;
      }
      return path === "/" ? "/ja/" : "/ja" + path;
    }
    if (!isJaPath(path)) {
      return path;
    }
    if (path === "/ja" || path === "/ja/") {
      return "/";
    }
    return path.replace(/^\/ja/, "") || "/";
  }

  function readStored() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      return null;
    }
  }

  function writeStored(locale) {
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch (error) {
      // Ignore quota / private mode.
    }
  }

  if (pageLocale === "en") {
    var stored = readStored();
    if (stored === "ja" || (!stored && prefersJa())) {
      var dest = counterpartPath(location.pathname, "ja");
      if (dest !== location.pathname) {
        location.replace(dest + location.search + location.hash);
      }
    }
  }

  document.addEventListener("click", function (event) {
    var link = event.target.closest("a[data-set-locale]");
    if (!link) {
      return;
    }
    writeStored(link.getAttribute("data-set-locale"));
  });
})();
