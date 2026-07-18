(function () {
  var previousIdeaId = null;
  var categoryLabels = {
    "Thumbnail Tip": "썸네일 팁",
    "Format Tip": "파일 형식 팁",
    "Color Idea": "컬러 아이디어",
    "Social Media": "SNS 이미지",
    "Web Optimization": "웹 최적화",
    "File Size Tip": "파일 용량 팁",
    "Layout Tip": "레이아웃 팁"
  };

  function getRelatedTool(idea) {
    if (idea.relatedTool) return idea.relatedTool;
    if (idea.href) return { label: "관련 도구로 이동", href: idea.href };
    return null;
  }

  function pick(exceptId) {
    var ideas = window.PixelCapsuleIdeas || [];
    if (!ideas.length) return null;
    if (ideas.length === 1) return ideas[0];
    var blockedId = exceptId || previousIdeaId;
    var available = ideas.filter(function (idea) { return idea.id !== blockedId; });
    var next = available[Math.floor(Math.random() * available.length)];
    previousIdeaId = next.id;
    return next;
  }

  function render(target, idea) {
    if (!target || !idea) return;
    var category = categoryLabels[idea.category] || idea.category;
    var relatedTool = getRelatedTool(idea);
    target.dataset.ideaId = String(idea.id);
    target.setAttribute("aria-live", "polite");
    target.innerHTML =
      '<div class="capsule-top"><div><span class="capsule-category">' + category + '</span><h2>오늘의 아이디어 캡슐</h2></div>' +
      '<div class="capsule-actions"><button type="button" data-capsule-collapse>접기</button><button type="button" data-capsule-close>닫기</button></div></div>' +
      '<div data-capsule-body><h3>' + idea.title + '</h3><p>' + idea.description + '</p>' +
      '<div class="capsule-bottom"><button type="button" data-capsule-next>다른 아이디어 보기</button>' +
      (relatedTool ? '<a href="' + (window.PixelCapsuleRoute ? window.PixelCapsuleRoute(relatedTool.href) : relatedTool.href) + '">' + relatedTool.label + '</a>' : "") +
      '</div></div>';
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
