(function () {
  var navItems = [
    { href: "/", label: "Home", page: "home" },
    { href: "/tools/image-resizer/", label: "Resize", page: "resize" },
    { href: "/tools/image-compressor/", label: "Compress", page: "compress" },
    { href: "/tools/image-converter/", label: "Convert", page: "convert" },
    { href: "/tools/image-presets/", label: "Presets", page: "presets" },
    { href: "/guides/image-size-guide/", label: "Guides", page: "guides" }
  ];

  var footerItems = [
    { href: "/about/", label: "About" },
    { href: "/contact/", label: "Contact" },
    { href: "/privacy-policy/", label: "Privacy Policy" },
    { href: "/terms/", label: "Terms of Use" },
    { href: "/guides/image-size-guide/", label: "Guides" }
  ];

  var basePath = location.pathname.indexOf("/pixel_capsule/") === 0 ? "/pixel_capsule" : "";

  function route(path) {
    if (path === "/") return basePath + "/";
    return basePath + path;
  }

  function brand() {
    return '<a class="brand" href="' + route("/") + '" aria-label="Pixel Capsule 홈"><span class="brand-mark" aria-hidden="true"><span></span><span></span><span></span><span></span></span>Pixel Capsule</a>';
  }

  function injectHeader() {
    var target = document.querySelector("[data-site-header]");
    if (!target) return;
    var current = document.body.dataset.page || "";
    target.innerHTML =
      brand() +
      '<div class="nav-wrap"><nav class="main-nav" id="mainNav" aria-label="주요 메뉴">' +
      navItems.map(function (item) {
        var aria = current === item.page || (item.page === "guides" && current.indexOf("guide") === 0) ? ' aria-current="page"' : "";
        return '<a href="' + route(item.href) + '"' + aria + ">" + item.label + "</a>";
      }).join("") +
      '</nav><button class="theme-toggle" type="button" aria-label="다크모드 전환">Dark</button>' +
      '<button class="menu-button" type="button" aria-label="모바일 메뉴 열기" aria-expanded="false" aria-controls="mainNav"><span></span><span></span><span></span></button></div>';
  }

  function injectFooter() {
    var target = document.querySelector("[data-site-footer]");
    if (!target) return;
    target.innerHTML =
      '<div>' + brand() + '<p>브라우저에서 빠르게 처리하는 무료 이미지 도구.</p></div>' +
      '<nav aria-label="푸터 링크">' +
      footerItems.map(function (item) {
        return '<a href="' + route(item.href) + '">' + item.label + "</a>";
      }).join("") +
      '</nav><p class="copyright">© Pixel Capsule. All rights reserved.</p>';
  }

  function wireControls() {
    var themeButton = document.querySelector(".theme-toggle");
    var menuButton = document.querySelector(".menu-button");
    var nav = document.querySelector(".main-nav");

    function syncThemeLabel() {
      if (themeButton) themeButton.textContent = window.PixelCapsuleTheme && window.PixelCapsuleTheme.isDark() ? "Light" : "Dark";
    }

    if (themeButton) {
      themeButton.addEventListener("click", function () {
        window.PixelCapsuleTheme.toggle();
        syncThemeLabel();
      });
      syncThemeLabel();
    }

    if (menuButton && nav) {
      menuButton.addEventListener("click", function () {
        var open = !nav.classList.contains("is-open");
        nav.classList.toggle("is-open", open);
        menuButton.setAttribute("aria-expanded", String(open));
      });
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    injectHeader();
    injectFooter();
    wireControls();
  });

  window.PixelCapsuleRoute = route;
})();
