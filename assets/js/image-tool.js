(function () {
  var MAX_OUTPUT_PIXELS = 48000000;

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function initImageTool(config) {
    var root = document.querySelector("[data-image-tool]");
    if (!root) return;

    var utils = window.PixelCapsuleImage;
    var mode = config.mode;
    var isResizer = mode === "resize";
    var state = {
      loaded: null,
      result: null,
      width: 0,
      height: 0,
      scale: 100,
      keepRatio: true,
      quality: 82,
      outputType: "image/webp",
      background: "#ffffff",
      processing: false
    };
    var input = root.querySelector("[data-file-input]");
    var dropZone = root.querySelector("[data-drop-zone]");
    var dropTitle = root.querySelector("[data-drop-title]");
    var status = root.querySelector("[data-status]");
    var error = root.querySelector("[data-error]");
    var original = root.querySelector("[data-original]");
    var settings = root.querySelector("[data-settings]");
    var result = root.querySelector("[data-result]");
    var afterResult = document.querySelector("[data-after-result]");

    function setMessage(message, isError) {
      status.textContent = isError ? "" : message;
      error.textContent = isError ? message : "";
      root.dataset.state = isError ? "error" : root.dataset.state || "idle";
    }

    function setValue(name, value) {
      var field = root.querySelector('[name="' + name + '"]');
      if (field) field.value = value;
    }

    function formatType(type) {
      return (type || "").replace("image/", "").replace("jpeg", "jpg").toUpperCase();
    }

    function outputPixelsInvalid() {
      return state.width * state.height > MAX_OUTPUT_PIXELS;
    }

    function getResizeValidation() {
      var widthError = "";
      var heightError = "";
      if (!state.loaded) return { valid: false, widthError: "", heightError: "" };
      if (!Number.isFinite(state.width) || state.width < 1) widthError = "가로 크기는 1px 이상이어야 합니다.";
      if (!Number.isFinite(state.height) || state.height < 1) heightError = "세로 크기는 1px 이상이어야 합니다.";
      if (!widthError && !heightError && outputPixelsInvalid()) {
        widthError = "출력 해상도가 너무 큽니다. 가로와 세로를 줄여 주세요.";
        heightError = "최대 출력 해상도는 약 48MP입니다.";
      }
      return { valid: !widthError && !heightError, widthError: widthError, heightError: heightError };
    }

    function updateValidationUi() {
      if (!isResizer) return true;
      var validation = getResizeValidation();
      var widthField = root.querySelector('[name="width"]');
      var heightField = root.querySelector('[name="height"]');
      var widthError = root.querySelector("#resize-width-error");
      var heightError = root.querySelector("#resize-height-error");
      var process = root.querySelector("[data-process]");
      var help = root.querySelector("[data-action-help]");

      if (widthField) {
        widthField.setAttribute("aria-invalid", validation.widthError ? "true" : "false");
        widthField.setAttribute("aria-describedby", "resize-width-error");
      }
      if (heightField) {
        heightField.setAttribute("aria-invalid", validation.heightError ? "true" : "false");
        heightField.setAttribute("aria-describedby", "resize-height-error");
      }
      if (widthError) widthError.textContent = validation.widthError;
      if (heightError) heightError.textContent = validation.heightError;
      if (process) process.disabled = !state.loaded || !validation.valid || state.processing;
      if (help) {
        help.textContent = !state.loaded ? "이미지를 먼저 선택해 주세요." : validation.valid ? "" : "가로와 세로 값을 확인해 주세요.";
      }
      return validation.valid;
    }

    function renderInfo() {
      if (!state.loaded) return;
      if (!isResizer) {
        original.innerHTML =
          '<h2>원본 이미지</h2><img src="' + state.loaded.url + '" alt="선택한 원본 이미지 미리보기">' +
          '<dl class="info-list"><div><dt>가로</dt><dd>' + state.loaded.width + 'px</dd></div><div><dt>세로</dt><dd>' + state.loaded.height + 'px</dd></div><div><dt>용량</dt><dd>' + utils.formatBytes(state.loaded.size) + '</dd></div><div><dt>형식</dt><dd>' + formatType(state.loaded.type) + "</dd></div></dl>";
        return;
      }

      var fileName = escapeHtml(state.loaded.file.name);
      original.innerHTML =
        '<div class="step-title"><span class="step-number">1</span><div><p class="eyebrow">Original</p><h2>원본 이미지</h2></div></div>' +
        '<div class="image-preview-surface"><img src="' + state.loaded.url + '" alt="선택한 원본 이미지 미리보기"></div>' +
        '<div class="file-summary"><strong title="' + fileName + '">' + fileName + '</strong><span>' + state.loaded.width + ' × ' + state.loaded.height + 'px · ' + utils.formatBytes(state.loaded.size) + ' · ' + formatType(state.loaded.type) + '</span></div>' +
        '<button class="secondary-button subtle-button" type="button" data-choose-file>다른 이미지 선택</button>';
    }

    function renderResizeSettings() {
      settings.innerHTML =
        '<div class="step-title"><span class="step-number">2</span><div><p class="eyebrow">New size</p><h2>새 이미지 크기</h2></div></div>' +
        '<div class="size-input-grid">' +
          '<div class="field-row"><label for="resize-width">가로</label><div class="input-with-unit"><input id="resize-width" name="width" type="number" min="1" inputmode="numeric" value="' + state.width + '" aria-describedby="resize-width-error"><span>px</span></div><p id="resize-width-error" class="field-error"></p></div>' +
          '<div class="field-row"><label for="resize-height">세로</label><div class="input-with-unit"><input id="resize-height" name="height" type="number" min="1" inputmode="numeric" value="' + state.height + '" aria-describedby="resize-height-error"><span>px</span></div><p id="resize-height-error" class="field-error"></p></div>' +
        '</div>' +
        '<label class="ratio-toggle"><input name="keepRatio" type="checkbox" checked><span>원본 비율 유지</span></label>' +
        '<p class="note distortion-note" data-distortion-note hidden>비율을 해제하면 이미지가 늘어나거나 눌릴 수 있습니다.</p>' +
        '<div class="quick-size-panel"><strong>빠른 크기 선택</strong><div class="quick-size-grid" aria-label="빠른 크기 선택">' +
          '<button type="button" data-quick-scale="25">25%</button>' +
          '<button type="button" data-quick-scale="50">50%</button>' +
          '<button type="button" data-quick-scale="75">75%</button>' +
          '<button type="button" data-quick-scale="100">원본 크기</button>' +
        '</div></div>' +
        '<div class="expected-result-card"><span>예상 결과 크기</span><strong data-expected-size>' + state.width + ' × ' + state.height + 'px</strong><small>파일 용량은 변환 후 확인할 수 있습니다.</small></div>' +
        '<p class="format-note">출력 형식은 원본 형식을 유지합니다. JPG, PNG, WebP 변환은 <a href="../image-converter/">이미지 형식 변환 도구</a>에서 사용할 수 있습니다.</p>' +
        '<div class="button-row action-stack"><button class="primary-button" type="button" data-process>이미지 크기 변경</button><button class="secondary-button" type="button" data-reset>초기화</button></div>' +
        '<p class="action-help" data-action-help></p>';
      syncSettings();
    }

    function renderSettings() {
      if (isResizer) {
        renderResizeSettings();
        return;
      }

      var html = '<h2>설정</h2>';
      if (mode === "presets") {
        html += '<div class="field-row"><label for="target-width">변경할 가로</label><input id="target-width" name="width" type="number" min="1" value="' + state.width + '"></div>';
        html += '<div class="field-row"><label for="target-height">변경할 세로</label><input id="target-height" name="height" type="number" min="1" value="' + state.height + '"></div>';
        html += '<label class="check-row"><input name="keepRatio" type="checkbox" checked>원본 비율 유지</label>';
        html += '<div class="field-row"><label for="scale">백분율 크기 변경: <span data-scale-label>' + state.scale + '</span>%</label><input id="scale" name="scale" type="range" min="10" max="200" step="5" value="' + state.scale + '"></div>';
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

    function updateQuickButtons() {
      root.querySelectorAll("[data-quick-scale]").forEach(function (button) {
        var active = Number(button.dataset.quickScale) === state.scale;
        button.classList.toggle("is-active", active);
        if (active) button.setAttribute("aria-pressed", "true");
        else button.setAttribute("aria-pressed", "false");
      });
    }

    function syncSettings() {
      setValue("width", state.width);
      setValue("height", state.height);
      setValue("scale", state.scale);
      setValue("quality", state.quality);
      setValue("outputType", state.outputType);
      setValue("background", state.background);

      var keepRatio = root.querySelector('[name="keepRatio"]');
      var expected = root.querySelector("[data-expected-size]");
      var distortion = root.querySelector("[data-distortion-note]");
      var scaleLabel = root.querySelector("[data-scale-label]");
      var qualityLabelTarget = root.querySelector("[data-quality-label]");
      var bgField = root.querySelector("[data-background-field]");
      if (keepRatio) keepRatio.checked = state.keepRatio;
      if (expected) expected.textContent = state.width + " × " + state.height + "px";
      if (distortion) distortion.hidden = state.keepRatio;
      if (scaleLabel) scaleLabel.textContent = state.scale;
      if (qualityLabelTarget) qualityLabelTarget.textContent = qualityLabel(state.quality);
      if (bgField) bgField.hidden = state.outputType !== "image/jpeg";
      updateQuickButtons();
      updateValidationUi();
    }

    function renderEmptyResult() {
      if (isResizer && !state.loaded) {
        original.innerHTML = "";
        settings.innerHTML = "";
        result.innerHTML = "";
        return;
      }
      result.innerHTML = '<h2>결과 이미지</h2><p class="empty-result">설정을 적용하면 결과 미리보기가 여기에 표시됩니다.</p>';
    }

    function renderResult() {
      if (!state.result || !state.loaded) {
        renderEmptyResult();
        return;
      }

      var saved = state.loaded.size - state.result.blob.size;
      var rate = Math.round(Math.abs(saved) / state.loaded.size * 100);
      var deltaText = saved > 0 ? "원본보다 " + rate + "% 감소" : saved < 0 ? "원본보다 " + rate + "% 증가" : "원본과 용량 동일";
      var extension = utils.extensionFor(state.result.type).toUpperCase();

      if (!isResizer) {
        result.innerHTML =
          '<h2>결과 이미지</h2><img src="' + state.result.url + '" alt="변환된 결과 이미지 미리보기">' +
          '<dl class="info-list"><div><dt>가로</dt><dd>' + state.result.width + 'px</dd></div><div><dt>세로</dt><dd>' + state.result.height + 'px</dd></div><div><dt>용량</dt><dd>' + utils.formatBytes(state.result.blob.size) + '</dd></div><div><dt>변화</dt><dd>' + deltaText + '</dd></div></dl>' +
          '<a class="download-button" href="' + state.result.url + '" download="' + utils.resultName(state.loaded.file, state.result.type, mode) + '">다운로드</a>';
      } else {
        result.innerHTML =
          '<div class="step-title"><span class="step-number complete">3</span><div><p class="eyebrow">Result</p><h2>변환 완료</h2></div></div>' +
          '<div class="comparison-summary" aria-label="원본과 결과 비교 요약"><span>원본 ' + state.loaded.width + ' × ' + state.loaded.height + 'px</span><span>결과 ' + state.result.width + ' × ' + state.result.height + 'px</span></div>' +
          '<div class="image-preview-surface result-surface"><img src="' + state.result.url + '" alt="변환된 결과 이미지 미리보기"></div>' +
          '<p class="preview-note">화면 맞춤 미리보기입니다. 실제 파일 크기는 아래 정보를 확인하세요.</p>' +
          '<dl class="info-list result-info"><div><dt>결과 해상도</dt><dd>' + state.result.width + ' × ' + state.result.height + 'px</dd></div><div><dt>결과 용량</dt><dd>' + utils.formatBytes(state.result.blob.size) + '</dd></div><div><dt>용량 변화</dt><dd>' + deltaText + '</dd></div><div><dt>파일 형식</dt><dd>' + extension + '</dd></div></dl>' +
          '<div class="button-row result-actions"><a class="download-button" href="' + state.result.url + '" download="' + utils.resultName(state.loaded.file, state.result.type, "resized") + '">' + extension + ' 이미지 다운로드</a><button class="secondary-button" type="button" data-focus-settings>설정 수정</button><button class="secondary-button subtle-button" type="button" data-choose-file>새 이미지 선택</button></div>';
      }
      if (afterResult) afterResult.hidden = false;
      root.dataset.state = "done";
    }

    function updateWidth(value) {
      state.width = Number(value);
      if (state.keepRatio && state.loaded && state.width > 0) {
        state.height = Math.max(1, Math.round((state.width / state.loaded.width) * state.loaded.height));
      }
      syncSettings();
    }

    function updateHeight(value) {
      state.height = Number(value);
      if (state.keepRatio && state.loaded && state.height > 0) {
        state.width = Math.max(1, Math.round((state.height / state.loaded.height) * state.loaded.width));
      }
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

    function revokeResultUrl() {
      if (state.result) URL.revokeObjectURL(state.result.url);
      state.result = null;
    }

    function handleFile(file) {
      if (!file) return;
      setMessage("이미지를 불러오는 중입니다.");
      root.dataset.state = "loading";
      revokeResultUrl();
      utils.readImage(file).then(function (loaded) {
        if (state.loaded) URL.revokeObjectURL(state.loaded.url);
        state.loaded = loaded;
        state.width = loaded.width;
        state.height = loaded.height;
        state.scale = 100;
        state.keepRatio = true;
        state.outputType = mode === "convert" ? "image/jpeg" : loaded.type === "image/png" && mode === "compress" ? "image/webp" : loaded.type;
        root.classList.add("has-image");
        root.dataset.state = "ready";
        renderInfo();
        renderSettings();
        renderEmptyResult();
        if (afterResult) afterResult.hidden = true;
        setMessage("이미지가 준비되었습니다. 원하는 가로와 세로를 설정해 주세요.");
      }).catch(function (err) {
        if (state.loaded) URL.revokeObjectURL(state.loaded.url);
        state.loaded = null;
        state.width = 0;
        state.height = 0;
        state.scale = 100;
        root.classList.remove("has-image");
        root.dataset.state = "error";
        original.innerHTML = "";
        settings.innerHTML = "";
        renderEmptyResult();
        if (afterResult) afterResult.hidden = true;
        setMessage(err.message || "이미지를 불러올 수 없습니다. 파일이 손상되지 않았는지 확인해 주세요.", true);
      });
    }

    function setProcessing(isProcessing) {
      state.processing = isProcessing;
      var process = root.querySelector("[data-process]");
      if (process) {
        process.disabled = isProcessing || (isResizer && !getResizeValidation().valid);
        process.textContent = isProcessing ? "변환 중..." : isResizer ? "이미지 크기 변경" : "변환 실행";
      }
      root.dataset.state = isProcessing ? "processing" : root.dataset.state;
    }

    function processImage() {
      if (!state.loaded) {
        setMessage("이미지를 먼저 선택해 주세요.", true);
        return;
      }
      if (isResizer && !updateValidationUi()) {
        setMessage("가로와 세로 크기는 1px 이상이어야 합니다.", true);
        return;
      }
      if (!state.width || !state.height || state.width <= 0 || state.height <= 0) {
        setMessage("가로와 세로 크기는 1px 이상이어야 합니다.", true);
        return;
      }

      setProcessing(true);
      setMessage(isResizer ? "이미지 크기를 변경하고 있습니다..." : "이미지를 처리하고 있습니다.");
      var targetType = mode === "resize" || mode === "presets" ? state.loaded.type : state.outputType;
      utils.renderImage(state.loaded, state.width, state.height, targetType, Math.min(1, Math.max(0.05, state.quality / 100)), state.background).then(function (blob) {
        revokeResultUrl();
        state.result = { url: URL.createObjectURL(blob), blob: blob, width: state.width, height: state.height, type: targetType };
        renderResult();
        setMessage("이미지 변환이 완료되었습니다.");
      }).catch(function (err) {
        root.dataset.state = "error";
        setMessage(err.message || "이미지를 처리하지 못했습니다. 이미지 크기를 줄이거나 다른 브라우저에서 다시 시도해 주세요.", true);
      }).finally(function () {
        setProcessing(false);
        syncSettings();
      });
    }

    function reset() {
      if (state.loaded) URL.revokeObjectURL(state.loaded.url);
      revokeResultUrl();
      state.loaded = null;
      state.width = 0;
      state.height = 0;
      state.scale = 100;
      state.keepRatio = true;
      state.processing = false;
      original.innerHTML = "";
      settings.innerHTML = "";
      renderEmptyResult();
      root.classList.remove("has-image");
      root.dataset.state = "idle";
      if (input) input.value = "";
      if (afterResult) afterResult.hidden = true;
      setMessage("");
    }

    function chooseFile() {
      if (input) input.click();
    }

    if (dropZone) {
      if (dropZone.tagName !== "LABEL") {
        dropZone.addEventListener("click", chooseFile);
      }
      dropZone.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          chooseFile();
        }
      });
      ["dragenter", "dragover"].forEach(function (eventName) {
        dropZone.addEventListener(eventName, function (event) {
          event.preventDefault();
          dropZone.classList.add("is-dragging");
          if (dropTitle) dropTitle.textContent = "이미지를 놓아서 업로드하세요";
        });
      });
      ["dragleave", "drop"].forEach(function (eventName) {
        dropZone.addEventListener(eventName, function () {
          dropZone.classList.remove("is-dragging");
          if (dropTitle) dropTitle.textContent = "이미지를 여기에 끌어다 놓으세요";
        });
      });
      dropZone.addEventListener("drop", function (event) {
        event.preventDefault();
        handleFile(event.dataTransfer.files[0]);
      });
    }

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
      if (event.target.name === "keepRatio") {
        state.keepRatio = event.target.checked;
        syncSettings();
      }
      if (event.target.name === "outputType") {
        state.outputType = event.target.value;
        syncSettings();
      }
    });
    root.addEventListener("click", function (event) {
      var process = event.target.closest("[data-process]");
      var resetButton = event.target.closest("[data-reset]");
      var presetButton = event.target.closest("[data-preset-id]");
      var choose = event.target.closest("[data-choose-file]");
      var quickScale = event.target.closest("[data-quick-scale]");
      var focusSettings = event.target.closest("[data-focus-settings]");
      if (process) processImage();
      if (resetButton) reset();
      if (choose) chooseFile();
      if (quickScale) updateScale(quickScale.dataset.quickScale);
      if (focusSettings) {
        var firstField = settings.querySelector("input, button, select, a");
        settings.scrollIntoView({ behavior: "smooth", block: "start" });
        if (firstField) firstField.focus({ preventScroll: true });
      }
      if (presetButton) {
        var preset = (window.PixelCapsulePresets || []).find(function (item) { return item.id === presetButton.dataset.presetId; });
        if (preset) {
          state.width = preset.width;
          state.height = preset.height;
          syncSettings();
        }
      }
    });

    root.dataset.state = "idle";
    renderEmptyResult();
  }

  window.PixelCapsule = window.PixelCapsule || {};
  window.PixelCapsule.initImageTool = initImageTool;
})();
