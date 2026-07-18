(function () {
  function pick(exceptId) {
    var ideas = window.PixelCapsuleIdeas || [];
    if (!ideas.length) return null;
    if (ideas.length === 1) return ideas[0];
    var next = ideas[Math.floor(Math.random() * ideas.length)];
    while (next.id === exceptId) {
      next = ideas[Math.floor(Math.random() * ideas.length)];
    }
    return next;
  }

  function render(target, idea) {
    if (!target || !idea) return;
    target.dataset.ideaId = String(idea.id);
    target.innerHTML =
      '<div class="capsule-top"><div><span class="capsule-category">' + idea.category + '</span><h2>오늘의 아이디어 캡슐</h2></div>' +
      '<div class="capsule-actions"><button type="button" data-capsule-collapse>접기</button><button type="button" data-capsule-close>닫기</button></div></div>' +
      '<div data-capsule-body><h3>' + idea.title + '</h3><p>' + idea.description + '</p>' +
      '<div class="capsule-bottom"><button type="button" data-capsule-next>새 아이디어 뽑기</button><a href="' + (window.PixelCapsuleRoute ? window.PixelCapsuleRoute(idea.href) : idea.href) + '">관련 도구로 이동</a></div></div>';
  }

  function initCapsule(target) {
    if (!target) return;
    render(target, pick());
    target.addEventListener("click", function (event) {
      var button = event.target.closest("button");
      if (!button) return;
      var body = target.querySelector("[data-capsule-body]");
      if (button.matches("[data-capsule-next]")) {
        render(target, pick(Number(target.dataset.ideaId)));
      }
      if (button.matches("[data-capsule-collapse]") && body) {
        var hidden = body.hidden;
        body.hidden = !hidden;
        button.textContent = hidden ? "접기" : "펼치기";
      }
      if (button.matches("[data-capsule-close]")) {
        target.hidden = true;
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-capsule]").forEach(initCapsule);
  });

  window.PixelCapsule = window.PixelCapsule || {};
  window.PixelCapsule.showIdea = function (target) {
    initCapsule(target);
  };
})();
