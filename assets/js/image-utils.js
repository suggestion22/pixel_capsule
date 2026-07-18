(function () {
  var supportedTypes = ["image/jpeg", "image/png", "image/webp"];
  var maxPixels = 48000000;
  var maxFileSize = 40 * 1024 * 1024;

  function formatBytes(bytes) {
    if (!Number.isFinite(bytes)) return "-";
    if (bytes < 1024) return bytes + " B";
    var units = ["KB", "MB", "GB"];
    var value = bytes / 1024;
    var unit = units[0];
    for (var index = 1; value >= 1024 && index < units.length; index += 1) {
      value /= 1024;
      unit = units[index];
    }
    return value.toFixed(value >= 10 ? 1 : 2) + " " + unit;
  }

  function extensionFor(type) {
    if (type === "image/png") return "png";
    if (type === "image/webp") return "webp";
    return "jpg";
  }

  function readImage(file) {
    return new Promise(function (resolve, reject) {
      if (!file || supportedTypes.indexOf(file.type) === -1) {
        reject(new Error("이 파일 형식은 현재 지원하지 않습니다. JPG, PNG 또는 WebP 이미지를 선택해 주세요."));
        return;
      }
      if (file.size > maxFileSize) {
        reject(new Error("파일이 너무 큽니다. 40MB 이하의 이미지를 선택해 주세요."));
        return;
      }
      var url = URL.createObjectURL(file);
      var image = new Image();
      image.onload = function () {
        if (image.naturalWidth * image.naturalHeight > maxPixels) {
          URL.revokeObjectURL(url);
          reject(new Error("이미지 해상도가 너무 큽니다. 더 작은 이미지를 선택해 주세요."));
          return;
        }
        resolve({ file: file, url: url, image: image, width: image.naturalWidth, height: image.naturalHeight, size: file.size, type: file.type });
      };
      image.onerror = function () {
        URL.revokeObjectURL(url);
        reject(new Error("이미지를 불러오지 못했습니다. 파일이 손상되지 않았는지 확인해 주세요."));
      };
      image.src = url;
    });
  }

  function renderImage(loaded, width, height, outputType, quality, background) {
    return new Promise(function (resolve, reject) {
      var canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      var context = canvas.getContext("2d");
      if (!context) {
        reject(new Error("브라우저에서 이미지 처리 화면을 만들 수 없습니다."));
        return;
      }
      if (outputType === "image/jpeg") {
        context.fillStyle = background || "#ffffff";
        context.fillRect(0, 0, width, height);
      }
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      context.drawImage(loaded.image, 0, 0, width, height);
      canvas.toBlob(function (blob) {
        if (!blob) {
          reject(new Error("이미지 변환에 실패했습니다. 다른 출력 형식을 선택해 보세요."));
          return;
        }
        resolve(blob);
      }, outputType, outputType === "image/png" ? undefined : quality);
    });
  }

  function resultName(file, type, suffix) {
    return file.name.replace(/\.[^.]+$/, "") + "-" + suffix + "." + extensionFor(type);
  }

  window.PixelCapsuleImage = {
    formatBytes: formatBytes,
    readImage: readImage,
    renderImage: renderImage,
    extensionFor: extensionFor,
    resultName: resultName
  };
})();
