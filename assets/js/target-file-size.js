(function () {
  var MAX_TARGET_BYTES = 20 * 1024 * 1024;
  var MIN_TARGET_BYTES = 1024;
  var MIN_QUALITY = 0.1;
  var MAX_QUALITY = 0.95;
  var SEARCH_STEPS = 10;

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function formatType(type) {
    return (type || "").replace("image/", "").replace("jpeg", "jpg").toUpperCase();
  }

  function percentChange(original, result) {
    if (!original) return "변화 계산 불가";
    var diff = original - result;
    var rate = Math.round(Math.abs(diff) / original * 100);
    if (diff > 0) return rate + "% 감소";
    if (diff < 0) return rate + "% 증가";
    return "변화 없음";
  }

  function pixelChange(originalWidth, originalHeight, resultWidth, resultHeight) {
    var originalPixels = originalWidth * originalHeight;
    var resultPixels = resultWidth * resultHeight;
    if (!originalPixels) return "변화 계산 불가";
    var diff = originalPixels - resultPixels;
    var rate = Math.round(Math.abs(diff) / originalPixels * 100);
    if (diff > 0) return rate + "% 감소";
    if (diff < 0) return rate + "% 증가";
    return "유지";
  }

  function chooseNearest(current, candidate, targetBytes) {
    if (!current) return candidate;
    var currentDiff = Math.abs(current.blob.size - targetBytes);
    var candidateDiff = Math.abs(candidate.blob.size - targetBytes);
    if (candidateDiff < currentDiff) return candidate;
    if (candidateDiff === currentDiff && candidate.quality > current.quality) return candidate;
    return current;
  }

  function initTargetFileSizeTool() {
    var root = document.querySelector("[data-target-file-size-tool]");
    if (!root || !window.PixelCapsuleImage) return;

    var utils = window.PixelCapsuleImage;
    var state = {
      loaded: null,
      result: null,
      targetBytes: 500 * 1024,
      targetAmount: 500,
      targetUnit: "KB",
      targetPreset: 500 * 1024,
      outputType: "original",
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

    function revokeResultUrl() {
      if (state.result && state.result.url) URL.revokeObjectURL(state.result.url);
      state.result = null;
    }

    function resetResultOnly() {
      revokeResultUrl();
      result.innerHTML = "";
      if (afterResult) afterResult.hidden = true;
    }

    function outputType() {
      if (!state.loaded) return "image/webp";
      if (state.outputType === "original") return state.loaded.type;
      return state.outputType;
    }

    function targetBytesFromFields() {
      var amount = Number(state.targetAmount);
      if (!Number.isFinite(amount) || amount <= 0) return NaN;
      return Math.round(amount * (state.targetUnit === "MB" ? 1024 * 1024 : 1024));
    }

    function validationMessage() {
      var bytes = targetBytesFromFields();
      if (!Number.isFinite(bytes)) return "목표 용량을 숫자로 입력해 주세요.";
      if (bytes < MIN_TARGET_BYTES) return "목표 용량은 1KB 이상이어야 합니다.";
      if (bytes > MAX_TARGET_BYTES) return "목표 용량은 20MB 이하로 입력해 주세요.";
      return "";
    }

    function updateActionState() {
      var process = root.querySelector("[data-process]");
      var help = root.querySelector("[data-action-help]");
      var amountField = root.querySelector('[name="targetAmount"]');
      var amountError = root.querySelector("#target-amount-error");
      var message = validationMessage();

      if (amountField) {
        amountField.setAttribute("aria-invalid", message ? "true" : "false");
        amountField.setAttribute("aria-describedby", "target-amount-error");
      }
      if (amountError) amountError.textContent = message;
      if (process) process.disabled = !state.loaded || !!message || state.processing;
      if (help) {
        help.textContent = !state.loaded ? "이미지를 먼저 선택해 주세요." : message || "";
      }
      return !message;
    }

    function syncControls() {
      var amount = root.querySelector('[name="targetAmount"]');
      var unit = root.querySelector('[name="targetUnit"]');
      var output = root.querySelector('[name="outputType"]');
      var expected = root.querySelector("[data-target-size-label]");
      var typeNote = root.querySelector("[data-type-note]");

      if (amount) amount.value = state.targetAmount;
      if (unit) unit.value = state.targetUnit;
      if (output) output.value = state.outputType;
      state.targetBytes = targetBytesFromFields();
      if (expected) expected.textContent = utils.formatBytes(state.targetBytes);
      if (typeNote) {
        var selected = outputType();
        typeNote.textContent = selected === "image/png"
          ? "PNG는 품질 자동 조절이 제한되어 목표 달성이 어려울 수 있습니다."
          : "JPG와 WebP는 품질 값을 자동으로 비교해 목표 용량에 접근합니다.";
      }
      root.querySelectorAll("[data-target-preset]").forEach(function (button) {
        var active = Number(button.dataset.targetPreset) === state.targetPreset;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", active ? "true" : "false");
      });
      updateActionState();
    }

    function renderOriginal() {
      if (!state.loaded) return;
      var fileName = escapeHtml(state.loaded.file.name);
      original.innerHTML =
        '<div class="step-title"><span class="step-number">1</span><div><p class="eyebrow">Original</p><h2>원본 이미지</h2></div></div>' +
        '<div class="image-preview-surface"><img src="' + state.loaded.url + '" alt="선택한 원본 이미지 미리보기"></div>' +
        '<div class="file-summary"><strong title="' + fileName + '">' + fileName + '</strong><span>' + state.loaded.width + ' × ' + state.loaded.height + 'px · ' + utils.formatBytes(state.loaded.size) + ' · ' + formatType(state.loaded.type) + '</span></div>' +
        '<button class="secondary-button subtle-button" type="button" data-choose-file>다른 이미지 선택</button>';
    }

    function renderSettings() {
      settings.innerHTML =
        '<div class="step-title"><span class="step-number">2</span><div><p class="eyebrow">Target</p><h2>목표 용량 설정</h2></div></div>' +
        '<div class="target-preset-grid" aria-label="목표 파일 용량 빠른 선택">' +
          '<button type="button" data-target-preset="' + (100 * 1024) + '"><strong>100KB</strong><span>작은 아이콘·썸네일</span></button>' +
          '<button type="button" data-target-preset="' + (200 * 1024) + '"><strong>200KB</strong><span>가벼운 웹 이미지</span></button>' +
          '<button type="button" data-target-preset="' + (500 * 1024) + '"><strong>500KB</strong><span>블로그·상세 이미지</span></button>' +
          '<button type="button" data-target-preset="' + (1024 * 1024) + '"><strong>1MB</strong><span>고화질 유지 우선</span></button>' +
        '</div>' +
        '<div class="target-input-grid">' +
          '<div class="field-row"><label for="target-amount">사용자 지정 목표</label><div class="input-with-unit target-input-with-unit"><input id="target-amount" name="targetAmount" type="number" min="1" step="1" inputmode="decimal" value="' + state.targetAmount + '" aria-describedby="target-amount-error"><select name="targetUnit" aria-label="목표 용량 단위"><option value="KB">KB</option><option value="MB">MB</option></select></div><p id="target-amount-error" class="field-error"></p></div>' +
          '<div class="field-row"><label for="target-output-type">출력 형식</label><select id="target-output-type" name="outputType"><option value="original">원본 형식 유지</option><option value="image/jpeg">JPG</option><option value="image/webp">WebP</option></select></div>' +
        '</div>' +
        '<div class="expected-result-card"><span>목표 파일 용량</span><strong data-target-size-label>' + utils.formatBytes(state.targetBytes) + '</strong><small data-type-note></small></div>' +
        '<p class="format-note">투명 배경을 반드시 유지해야 한다면 원본 형식 또는 WebP 결과를 확인하세요. JPG는 투명 영역을 흰색 배경으로 채웁니다.</p>' +
        '<div class="button-row action-stack"><button class="primary-button" type="button" data-process>목표 용량으로 압축</button><button class="secondary-button" type="button" data-reset>초기화</button></div>' +
        '<p class="action-help" data-action-help></p>';
      syncControls();
    }

    function renderResult() {
      if (!state.result || !state.loaded) return;
      var fileName = escapeHtml(state.loaded.file.name);
      var extension = utils.extensionFor(state.result.type).toUpperCase();
      var achieved = state.result.blob.size <= state.targetBytes;
      var statusClass = achieved ? "is-success" : "is-warning";
      var statusText = achieved ? "목표 용량 달성" : "목표 용량 미달성";
      var qualityText = state.result.quality ? Math.round(state.result.quality * 100) + "%" : "품질 조절 없음";
      result.innerHTML =
        '<div class="step-title"><span class="step-number complete">3</span><div><p class="eyebrow">Result</p><h2>변환 완료</h2></div></div>' +
        '<p class="target-status-badge ' + statusClass + '">' + statusText + '</p>' +
        '<div class="image-preview-surface result-surface"><img src="' + state.result.url + '" alt="목표 용량으로 압축한 결과 이미지 미리보기"></div>' +
        '<dl class="info-list result-info"><div><dt>원본 파일명</dt><dd title="' + fileName + '">' + fileName + '</dd></div><div><dt>원본 정보</dt><dd>' + state.loaded.width + ' × ' + state.loaded.height + 'px · ' + utils.formatBytes(state.loaded.size) + ' · ' + formatType(state.loaded.type) + '</dd></div><div><dt>목표 용량</dt><dd>' + utils.formatBytes(state.targetBytes) + '</dd></div><div><dt>결과 용량</dt><dd>' + utils.formatBytes(state.result.blob.size) + '</dd></div><div><dt>결과 형식</dt><dd>' + extension + '</dd></div><div><dt>사용 품질</dt><dd>' + qualityText + '</dd></div><div><dt>해상도 변화</dt><dd>' + pixelChange(state.loaded.width, state.loaded.height, state.result.width, state.result.height) + '</dd></div><div><dt>파일 용량 변화</dt><dd>' + percentChange(state.loaded.size, state.result.blob.size) + '</dd></div></dl>' +
        '<p class="preview-note">' + (achieved ? "목표 이하 결과 중 가능한 높은 품질을 선택했습니다." : "현재 해상도와 형식에서는 목표 이하로 줄이지 못했습니다. 해상도를 줄이거나 다른 출력 형식을 비교해 보세요.") + '</p>' +
        '<div class="button-row result-actions"><a class="download-button" href="' + state.result.url + '" download="' + utils.resultName(state.loaded.file, state.result.type, "target-size") + '">' + extension + ' 이미지 다운로드</a><button class="secondary-button" type="button" data-focus-settings>설정 수정</button><button class="secondary-button subtle-button" type="button" data-choose-file>새 이미지 선택</button></div>';
      if (afterResult) afterResult.hidden = false;
      root.dataset.state = "done";
    }

    function setProcessing(isProcessing) {
      state.processing = isProcessing;
      var process = root.querySelector("[data-process]");
      if (process) {
        process.disabled = isProcessing || !updateActionState();
        process.textContent = isProcessing ? "압축 중..." : "목표 용량으로 압축";
      }
      root.dataset.state = isProcessing ? "processing" : root.dataset.state;
    }

    function renderBestWithQuality(targetType, targetBytes) {
      if (targetType === "image/png") {
        return utils.renderImage(state.loaded, state.loaded.width, state.loaded.height, targetType, undefined, "#ffffff").then(function (blob) {
          return { blob: blob, quality: null, type: blob.type || targetType };
        });
      }

      var low = MIN_QUALITY;
      var high = MAX_QUALITY;
      var bestUnder = null;
      var nearest = null;
      var sequence = Promise.resolve();

      for (var index = 0; index < SEARCH_STEPS; index += 1) {
        sequence = sequence.then(function () {
          var quality = (low + high) / 2;
          return utils.renderImage(state.loaded, state.loaded.width, state.loaded.height, targetType, quality, "#ffffff").then(function (blob) {
            var candidate = { blob: blob, quality: quality, type: blob.type || targetType };
            nearest = chooseNearest(nearest, candidate, targetBytes);
            if (blob.size <= targetBytes) {
              bestUnder = !bestUnder || quality > bestUnder.quality ? candidate : bestUnder;
              low = quality;
            } else {
              high = quality;
            }
          });
        });
      }

      return sequence.then(function () {
        return bestUnder || nearest;
      });
    }

    function processImage() {
      if (state.processing) return;
      if (!state.loaded) {
        setMessage("이미지를 먼저 선택해 주세요.", true);
        return;
      }
      if (!updateActionState()) {
        setMessage("목표 용량 값을 확인해 주세요.", true);
        return;
      }

      resetResultOnly();
      state.targetBytes = targetBytesFromFields();
      var targetType = outputType();
      setProcessing(true);
      setMessage("품질 값을 자동으로 탐색하고 있습니다...");
      renderBestWithQuality(targetType, state.targetBytes).then(function (finalResult) {
        if (!finalResult || !finalResult.blob) {
          throw new Error("다운로드 파일을 생성하지 못했습니다. 이미지를 다시 변환해 주세요.");
        }
        revokeResultUrl();
        state.result = {
          blob: finalResult.blob,
          url: URL.createObjectURL(finalResult.blob),
          width: state.loaded.width,
          height: state.loaded.height,
          type: finalResult.type || targetType,
          quality: finalResult.quality
        };
        renderResult();
        setMessage(state.result.blob.size <= state.targetBytes ? "목표 용량 이하의 결과를 만들었습니다." : "가장 작은 결과를 만들었지만 목표 용량에는 도달하지 못했습니다.");
      }).catch(function (err) {
        root.dataset.state = "error";
        setMessage(err.message || "이미지를 처리하지 못했습니다. 이미지 크기를 줄이거나 다른 브라우저에서 다시 시도해 주세요.", true);
      }).finally(function () {
        setProcessing(false);
        syncControls();
      });
    }

    function handleFile(file) {
      if (!file) return;
      setMessage("이미지를 불러오는 중입니다.");
      root.dataset.state = "loading";
      resetResultOnly();
      utils.readImage(file).then(function (loaded) {
        if (state.loaded) URL.revokeObjectURL(state.loaded.url);
        state.loaded = loaded;
        state.outputType = loaded.type === "image/png" ? "image/webp" : "original";
        root.classList.add("has-image");
        root.dataset.state = "ready";
        renderOriginal();
        renderSettings();
        setMessage("이미지가 준비되었습니다. 목표 파일 용량을 선택해 주세요.");
      }).catch(function (err) {
        if (state.loaded) URL.revokeObjectURL(state.loaded.url);
        state.loaded = null;
        root.classList.remove("has-image");
        root.dataset.state = "error";
        original.innerHTML = "";
        settings.innerHTML = "";
        resetResultOnly();
        setMessage(err.message || "이미지를 불러올 수 없습니다. 파일이 손상되지 않았는지 확인해 주세요.", true);
      });
    }

    function reset() {
      if (state.loaded) URL.revokeObjectURL(state.loaded.url);
      state.loaded = null;
      state.targetAmount = 500;
      state.targetUnit = "KB";
      state.targetPreset = 500 * 1024;
      state.outputType = "original";
      state.processing = false;
      original.innerHTML = "";
      settings.innerHTML = "";
      resetResultOnly();
      root.classList.remove("has-image");
      root.dataset.state = "idle";
      if (input) input.value = "";
      setMessage("");
    }

    function chooseFile() {
      if (input) input.click();
    }

    if (dropZone) {
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

    if (input) {
      input.addEventListener("change", function () {
        handleFile(input.files[0]);
      });
    }

    root.addEventListener("input", function (event) {
      if (event.target.name === "targetAmount") {
        state.targetAmount = event.target.value;
        state.targetPreset = 0;
        resetResultOnly();
        syncControls();
      }
    });

    root.addEventListener("change", function (event) {
      if (event.target.name === "targetUnit") {
        state.targetUnit = event.target.value;
        state.targetPreset = 0;
        resetResultOnly();
        syncControls();
      }
      if (event.target.name === "outputType") {
        state.outputType = event.target.value;
        resetResultOnly();
        syncControls();
      }
    });

    root.addEventListener("click", function (event) {
      var preset = event.target.closest("[data-target-preset]");
      var process = event.target.closest("[data-process]");
      var resetButton = event.target.closest("[data-reset]");
      var choose = event.target.closest("[data-choose-file]");
      var focusSettings = event.target.closest("[data-focus-settings]");
      if (preset) {
        var bytes = Number(preset.dataset.targetPreset);
        state.targetPreset = bytes;
        if (bytes >= 1024 * 1024) {
          state.targetAmount = bytes / 1024 / 1024;
          state.targetUnit = "MB";
        } else {
          state.targetAmount = bytes / 1024;
          state.targetUnit = "KB";
        }
        resetResultOnly();
        syncControls();
      }
      if (process) processImage();
      if (resetButton) reset();
      if (choose) chooseFile();
      if (focusSettings) {
        var firstField = settings.querySelector("input, select, button, a");
        settings.scrollIntoView({ behavior: "smooth", block: "start" });
        if (firstField) firstField.focus({ preventScroll: true });
      }
    });

    root.dataset.state = "idle";
  }

  document.addEventListener("DOMContentLoaded", initTargetFileSizeTool);
})();
