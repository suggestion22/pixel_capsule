document.addEventListener("DOMContentLoaded", function () {
  var list = document.querySelector("[data-preset-overview]");
  if (list) {
    list.innerHTML = (window.PixelCapsulePresets || []).map(function (preset) {
      return '<div><strong>' + preset.name + '</strong><span>' + preset.width + ' x ' + preset.height + ' · ' + preset.ratio + '</span></div>';
    }).join("");
  }
  var checked = document.querySelector("[data-preset-last-checked]");
  if (checked) checked.textContent = window.PixelCapsulePresetLastChecked || "";
  if (document.querySelector("[data-image-tool]")) {
    window.PixelCapsule.initImageTool({ mode: "presets" });
  }
});
