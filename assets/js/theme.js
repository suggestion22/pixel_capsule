(function () {
  var key = "pixel-capsule-theme";
  var saved = localStorage.getItem(key);
  var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  var isDark = saved ? saved === "dark" : prefersDark;
  document.documentElement.dataset.theme = isDark ? "dark" : "light";

  window.PixelCapsuleTheme = {
    toggle: function () {
      isDark = document.documentElement.dataset.theme !== "dark";
      document.documentElement.dataset.theme = isDark ? "dark" : "light";
      localStorage.setItem(key, isDark ? "dark" : "light");
      return isDark;
    },
    isDark: function () {
      return document.documentElement.dataset.theme === "dark";
    }
  };
})();
