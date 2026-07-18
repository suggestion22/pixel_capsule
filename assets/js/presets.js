document.addEventListener("DOMContentLoaded", function () {
  var list = document.querySelector("[data-preset-overview]");
  if (list) {
    list.innerHTML = (window.PixelCapsulePresets || []).map(function (preset) {
      return '<div><strong>' + preset.name + '</strong><span>' + preset.width + ' x ' + preset.height + ' · ' + preset.ratio + '</span><small>' + preset.platform + ' · 확인 ' + preset.lastVerified + '</small></div>';
    }).join("");
  }
  var checked = document.querySelector("[data-preset-last-checked]");
  if (checked) {
    var metadata = window.PixelCapsulePresetMetadata || {};
    var parts = metadata.lastVerified ? metadata.lastVerified.split("-") : [];
    checked.textContent = parts.length === 3 ? "플랫폼 이미지 규격 마지막 확인: " + parts[0] + "년 " + Number(parts[1]) + "월 " + Number(parts[2]) + "일" : "플랫폼 이미지 규격 마지막 확인일을 확인할 수 없습니다.";
  }
  if (document.querySelector("[data-image-tool]")) {
    window.PixelCapsule.initImageTool({ mode: "presets" });
  }
});
