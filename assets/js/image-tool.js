(function () {
  function initImageTool(config) {
    var root = document.querySelector("[data-image-tool]");
    if (!root) return;

    var utils = window.PixelCapsuleImage;
    var mode = config.mode;
    var state = { loaded: null, result: null, width: 0, height: 0, scale: 100, keepRatio: true, quality: 82, outputType: "image/webp", background: "#ffffff" };
    var input = root.querySelector("[data-file-input]");
    var dropZone = root.querySelector("[data-drop-zone]");
    var status = root.querySelector("[data-status]");
    var error = root.querySelector("[data-error]");
    var original = root.querySelector("[data-original]");
    var settings = root.querySelector("[data-settings]");
    var result = root.querySelector("[data-result]");
    var afterResult = document.querySelector("[data-after-result]");

    function setMessage(message, isError) {
      status.textContent = isError ? "" : message;
      error.textContent = isError ? message : "";
    }

    function setValue(name, value) {
      var field = root.querySelector('[name="' + name + '"]');
      if (field) field.value = value;
    }

    function getValue(name) {
      var field = root.querySelector('[name="' + name + '"]');
      return field ? field.value : "";
    }

    function renderInfo() {
      if (!state.loaded) return;
      original.innerHTML =
        '<h2>원본 이미지</h2><img src="' + state.loaded.url + '" alt="선택한 원본 이미지 미리보기">' +
        '<dl class="info-list"><div><dt>가로</dt><dd>' + state.loaded.width + 'px</dd></div><div><dt>세로</dt><dd>' + state.loaded.height + 'px</dd></div><div><dt>용량</dt><dd>' + utils.formatBytes(state.loaded.size) + '</dd></div><div><dt>형식</dt><dd>' + state.loaded.type.replace("image/", "").toUpperCase() + "</dd></div></dl>";
    }

    function renderSettings() {
      var html = '<h2>설정</h2>';
      if (mode === "resize" || mode === "presets") {
        html += '<div class="field-row"><label for="target-width">변경할 가로</label><input id="target-width" name="width" type="number" min="1" value="' + state.width + '"></div>';
        html += '<div class="field-row"><label for="target-height">변경할 세로</label><input id="target-height" name="height" type="number" min="1" value="' + state.height + '"></div>';
        html += '<label class="check-row"><input name="keepRatio" type="checkbox" checked>원본 비율 유지</label>';
        html += '<div class="field-row"><label for="scale">백분율 크기 변경: <span data-scale-label>' + state.scale + '</span>%</label><input id="scale" name="scale" type="range" min="10" max="200" step="5" value="' + state.scale + '"></div>';
      }
      if (mode === "presets") {
        html += '<div class="preset-list" aria-label="이미지 크기 프리셋">' + (window.PixelCapsulePresets || []).map(function (preset) {
          return '<button type="button" data-preset-id="' + preset.id + '"><strong>' + preset.name + '</strong><span>' + preset.width + ' x ' + preset.height + ' · ' + preset.ratio + '</span></button>';
        }).join("") + "</div>";
      }
      if (mode === "compress" || mode === "convert") {
        html += '<div class="field-row"><label for="quality">출력 품질: <span data-quality-label>' + state.quality + ' · 균형</span></label><input id="quality" name="quality" type="range" min="10" max="100" value="' + state.quality + '"></div>';
        html += '<div class="field-row"><label for="output-type">출력 형식</label><select id="output-type" name="outputType"><option value="image/jpeg">JPG</option><option value="image/png">PNG</option><option value="image/webp">WebP</option></select></div>';
        html += '<div class="field-row" data-background-field><label for="background">JPG 배경색</label><input id="background" name="background" type="color" value="' + state.background + '"></div>';
        if (mode === "compress") html += '<p class="note">PNG는 JPG처럼 단순 품질 조절로 크게 압축되지 않을 수 있습니다. 용량 감소가 작다면 WebP 변환을 함께 확인해 보세요.</p>';
      }
      html += '<div class="button-row"><button class="primary-button" type="button" data-process>변환 실행</button><button class="secondary-button" type="button" data-reset>초기화</button></div>';
      settings.innerHTML = html;
      syncSettings();
    }

    function qualityLabel(value) {
      if (value < 55) return value + " · 낮은 용량";
      if (value < 86) return value + " · 균형";
      return value + " · 높은 화질";
    }

    function syncSettings() {
      setValue("width", state.width);
      setValue("height", state.height);
      setValue("scale", state.scale);
      setValue("quality", state.quality);
      setValue("outputType", state.outputType);
      setValue("background", state.background);
      var scaleLabel = root.querySelector("[data-scale-label]");
      var qualityLabelTarget = root.querySelector("[data-quality-label]");
      var bgField = root.querySelector("[data-background-field]");
      if (scaleLabel) scaleLabel.textContent = state.scale;
      if (qualityLabelTarget) qualityLabelTarget.textContent = qualityLabel(state.quality);
      if (bgField) bgField.hidden = state.outputType !== "image/jpeg";
    }

    function renderEmptyResult() {
      result.innerHTML = '<h2>결과 이미지</h2><p class="empty-result">설정을 적용하면 결과 미리보기가 여기에 표시됩니다.</p>';
    }

    function renderResult() {
      if (!state.result || !state.loaded) {
        renderEmptyResult();
        return;
      }
      var saved = state.loaded.size - state.result.blob.size;
      var rate = Math.max(0, Math.round((1 - state.result.blob.size / state.loaded.size) * 100));
      result.innerHTML =
        '<h2>결과 이미지</h2><img src="' + state.result.url + '" alt="변환된 결과 이미지 미리보기">' +
        '<dl class="info-list"><div><dt>가로</dt><dd>' + state.result.width + 'px</dd></div><div><dt>세로</dt><dd>' + state.result.height + 'px</dd></div><div><dt>용량</dt><dd>' + utils.formatBytes(state.result.blob.size) + '</dd></div><div><dt>감소</dt><dd>' + (saved > 0 ? utils.formatBytes(saved) + " (" + rate + "%)" : "변화 없음") + '</dd></div></dl>' +
        '<a class="download-button" href="' + state.result.url + '" download="' + utils.resultName(state.loaded.file, state.result.type, mode) + '">다운로드</a>';
      if (afterResult) afterResult.hidden = false;
    }

    function updateWidth(value) {
      state.width = Math.max(1, Number(value) || 0);
      if (state.keepRatio && state.loaded && state.width > 0) state.height = Math.round((state.width / state.loaded.width) * state.loaded.height);
      syncSettings();
    }

    function updateHeight(value) {
      state.height = Math.max(1, Number(value) || 0);
      if (state.keepRatio && state.loaded && state.height > 0) state.width = Math.round((state.height / state.loaded.height) * state.loaded.width);
      syncSettings();
    }

    function updateScale(value) {
      state.scale = Number(value) || 100;
      if (state.loaded) {
        state.width = Math.max(1, Math.round(state.loaded.width * (state.scale / 100)));
        state.height = Math.max(1, Math.round(state.loaded.height * (state.scale / 100)));
      }
      syncSettings();
    }

    function handleFile(file) {
      if (!file) return;
      setMessage("이미지를 불러오는 중입니다.");
      if (state.result) URL.revokeObjectURL(state.result.url);
      state.result = null;
      utils.readImage(file).then(function (loaded) {
        if (state.loaded) URL.revokeObjectURL(state.loaded.url);
        state.loaded = loaded;
        state.width = loaded.width;
        state.height = loaded.height;
        state.scale = 100;
        state.outputType = mode === "convert" ? "image/jpeg" : loaded.type === "image/png" && mode === "compress" ? "image/webp" : loaded.type;
        renderInfo();
        renderSettings();
        renderEmptyResult();
        setMessage("이미지가 준비되었습니다.");
      }).catch(function (err) {
        setMessage(err.message || "이미지를 불러오지 못했습니다.", true);
      });
    }

    function processImage() {
      if (!state.loaded) {
        setMessage("먼저 이미지를 선택해 주세요.", true);
        return;
      }
      if (!state.width || !state.height || state.width <= 0 || state.height <= 0) {
        setMessage("가로와 세로 크기는 1 이상의 숫자로 입력해 주세요.", true);
        return;
      }
      setMessage("이미지를 처리하고 있습니다.");
      var targetType = mode === "resize" || mode === "presets" ? state.loaded.type : state.outputType;
      utils.renderImage(state.loaded, state.width, state.height, targetType, Math.min(1, Math.max(0.05, state.quality / 100)), state.background).then(function (blob) {
        if (state.result) URL.revokeObjectURL(state.result.url);
        state.result = { url: URL.createObjectURL(blob), blob: blob, width: state.width, height: state.height, type: targetType };
        renderResult();
        setMessage("이미지 변환이 완료되었습니다.");
      }).catch(function (err) {
        setMessage(err.message || "변환 중 문제가 발생했습니다.", true);
      });
    }

    function reset() {
      if (state.loaded) URL.revokeObjectURL(state.loaded.url);
      if (state.result) URL.revokeObjectURL(state.result.url);
      state.loaded = null;
      state.result = null;
      state.width = 0;
      state.height = 0;
      state.scale = 100;
      original.innerHTML = "";
      settings.innerHTML = "";
      renderEmptyResult();
      if (input) input.value = "";
      if (afterResult) afterResult.hidden = true;
      setMessage("");
    }

    dropZone.addEventListener("click", function () { input.click(); });
    dropZone.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") input.click();
    });
    dropZone.addEventListener("dragover", function (event) {
      event.preventDefault();
      dropZone.classList.add("is-dragging");
    });
    dropZone.addEventListener("dragleave", function () {
      dropZone.classList.remove("is-dragging");
    });
    dropZone.addEventListener("drop", function (event) {
      event.preventDefault();
      dropZone.classList.remove("is-dragging");
      handleFile(event.dataTransfer.files[0]);
    });
    input.addEventListener("change", function () {
      handleFile(input.files[0]);
    });
    root.addEventListener("input", function (event) {
      if (event.target.name === "width") updateWidth(event.target.value);
      if (event.target.name === "height") updateHeight(event.target.value);
      if (event.target.name === "scale") updateScale(event.target.value);
      if (event.target.name === "quality") {
        state.quality = Number(event.target.value) || 82;
        syncSettings();
      }
      if (event.target.name === "background") state.background = event.target.value;
    });
    root.addEventListener("change", function (event) {
      if (event.target.name === "keepRatio") state.keepRatio = event.target.checked;
      if (event.target.name === "outputType") {
        state.outputType = event.target.value;
        syncSettings();
      }
    });
    root.addEventListener("click", function (event) {
      var process = event.target.closest("[data-process]");
      var resetButton = event.target.closest("[data-reset]");
      var presetButton = event.target.closest("[data-preset-id]");
      if (process) processImage();
      if (resetButton) reset();
      if (presetButton) {
        var preset = (window.PixelCapsulePresets || []).find(function (item) { return item.id === presetButton.dataset.presetId; });
        if (preset) {
          state.width = preset.width;
          state.height = preset.height;
          syncSettings();
        }
      }
    });
    renderEmptyResult();
  }

  window.PixelCapsule = window.PixelCapsule || {};
  window.PixelCapsule.initImageTool = initImageTool;
})();
