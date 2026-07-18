"use client";

import { useMemo, useRef, useState } from "react";
import { imagePresets } from "../lib/data";
import type { ToolId } from "../lib/data";
import { AdPlaceholder } from "./SiteShell";
import { CapsuleWidget } from "./CapsuleWidget";

type LoadedImage = {
  file: File;
  url: string;
  width: number;
  height: number;
  size: number;
  type: string;
  image: HTMLImageElement;
};

type ResultImage = {
  url: string;
  blob: Blob;
  width: number;
  height: number;
  type: string;
};

const supportedTypes = ["image/jpeg", "image/png", "image/webp"];
const maxPixels = 48_000_000;
const maxFileSize = 40 * 1024 * 1024;

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes)) return "-";
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let value = bytes / 1024;
  let unit = units[0];
  for (let index = 1; value >= 1024 && index < units.length; index += 1) {
    value /= 1024;
    unit = units[index];
  }
  return `${value.toFixed(value >= 10 ? 1 : 2)} ${unit}`;
}

function extensionFor(type: string) {
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  return "jpg";
}

function readImage(file: File): Promise<LoadedImage> {
  return new Promise((resolve, reject) => {
    if (!supportedTypes.includes(file.type)) {
      reject(new Error("이 파일 형식은 현재 지원하지 않습니다. JPG, PNG 또는 WebP 이미지를 선택해 주세요."));
      return;
    }
    if (file.size > maxFileSize) {
      reject(new Error("파일이 너무 큽니다. 40MB 이하의 이미지를 선택해 주세요."));
      return;
    }
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      if (image.naturalWidth * image.naturalHeight > maxPixels) {
        URL.revokeObjectURL(url);
        reject(new Error("이미지 해상도가 너무 큽니다. 더 작은 이미지를 선택하거나 원본을 먼저 줄여 주세요."));
        return;
      }
      resolve({
        file,
        url,
        width: image.naturalWidth,
        height: image.naturalHeight,
        size: file.size,
        type: file.type,
        image,
      });
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("이미지를 불러오지 못했습니다. 파일이 손상되지 않았는지 확인해 주세요."));
    };
    image.src = url;
  });
}

async function renderImage(
  loaded: LoadedImage,
  width: number,
  height: number,
  outputType: string,
  quality: number,
  background: string,
) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("브라우저에서 이미지 처리 화면을 만들 수 없습니다.");
  if (outputType === "image/jpeg") {
    context.fillStyle = background || "#ffffff";
    context.fillRect(0, 0, width, height);
  }
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(loaded.image, 0, 0, width, height);
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, outputType, outputType === "image/png" ? undefined : quality),
  );
  if (!blob) throw new Error("이미지 변환에 실패했습니다. 다른 출력 형식을 선택해 보세요.");
  return blob;
}

function resultName(file: File, type: string, suffix: string) {
  const base = file.name.replace(/\.[^.]+$/, "");
  return `${base}-${suffix}.${extensionFor(type)}`;
}

export function ImageTool({ mode }: { mode: ToolId }) {
  const [loaded, setLoaded] = useState<LoadedImage | null>(null);
  const [result, setResult] = useState<ResultImage | null>(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [scale, setScale] = useState(100);
  const [keepRatio, setKeepRatio] = useState(true);
  const [quality, setQuality] = useState(82);
  const [outputType, setOutputType] = useState("image/webp");
  const [background, setBackground] = useState("#ffffff");
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedPreset = useMemo(
    () => imagePresets.find((preset) => preset.width === width && preset.height === height),
    [width, height],
  );

  async function handleFile(file?: File) {
    if (!file) return;
    setError("");
    setStatus("이미지를 불러오는 중입니다.");
    setResult((current) => {
      if (current) URL.revokeObjectURL(current.url);
      return null;
    });
    try {
      const next = await readImage(file);
      setLoaded((current) => {
        if (current) URL.revokeObjectURL(current.url);
        return next;
      });
      setWidth(next.width);
      setHeight(next.height);
      setScale(100);
      setOutputType(mode === "convert" ? "image/jpeg" : next.type === "image/png" && mode === "compress" ? "image/webp" : next.type);
      setStatus("이미지가 준비되었습니다.");
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "이미지를 불러오지 못했습니다.");
      setStatus("");
    }
  }

  function updateWidth(nextWidth: number) {
    setWidth(nextWidth);
    if (keepRatio && loaded && nextWidth > 0) {
      setHeight(Math.round((nextWidth / loaded.width) * loaded.height));
    }
  }

  function updateHeight(nextHeight: number) {
    setHeight(nextHeight);
    if (keepRatio && loaded && nextHeight > 0) {
      setWidth(Math.round((nextHeight / loaded.height) * loaded.width));
    }
  }

  function updateScale(nextScale: number) {
    setScale(nextScale);
    if (loaded && nextScale > 0) {
      setWidth(Math.max(1, Math.round(loaded.width * (nextScale / 100))));
      setHeight(Math.max(1, Math.round(loaded.height * (nextScale / 100))));
    }
  }

  async function processImage() {
    if (!loaded) {
      setError("먼저 이미지를 선택해 주세요.");
      return;
    }
    if (!width || !height || width <= 0 || height <= 0) {
      setError("가로와 세로 크기는 1 이상의 숫자로 입력해 주세요.");
      return;
    }
    setError("");
    setStatus("이미지를 처리하고 있습니다.");
    try {
      const targetType = mode === "resize" || mode === "presets" ? loaded.type : outputType;
      const targetQuality = Math.min(1, Math.max(0.05, quality / 100));
      const blob = await renderImage(loaded, width, height, targetType, targetQuality, background);
      setResult((current) => {
        if (current) URL.revokeObjectURL(current.url);
        return {
          url: URL.createObjectURL(blob),
          blob,
          width,
          height,
          type: targetType,
        };
      });
      setStatus("이미지 변환이 완료되었습니다.");
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "변환 중 문제가 발생했습니다.");
      setStatus("");
    }
  }

  function reset() {
    setLoaded((current) => {
      if (current) URL.revokeObjectURL(current.url);
      return null;
    });
    setResult((current) => {
      if (current) URL.revokeObjectURL(current.url);
      return null;
    });
    setError("");
    setStatus("");
    setWidth(0);
    setHeight(0);
    setScale(100);
  }

  const qualityLabel = quality < 55 ? "낮은 용량" : quality < 86 ? "균형" : "높은 화질";
  const savedBytes = loaded && result ? loaded.size - result.blob.size : 0;
  const compressionRate = loaded && result ? Math.max(0, Math.round((1 - result.blob.size / loaded.size) * 100)) : 0;
  const isConverterJpg = outputType === "image/jpeg";

  return (
    <div className="tool-workspace">
      <section
        className={dragging ? "drop-zone is-dragging" : "drop-zone"}
        tabIndex={0}
        role="button"
        aria-label="이미지 파일 선택"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") inputRef.current?.click();
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          handleFile(event.dataTransfer.files[0]);
        }}
      >
        <input
          ref={inputRef}
          className="file-input"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(event) => handleFile(event.target.files?.[0])}
        />
        <strong>이미지를 드래그하거나 클릭해서 선택하세요</strong>
        <span>JPG, PNG, WebP 지원. 파일은 브라우저 안에서 처리됩니다.</span>
      </section>

      {error && <p className="message error" role="alert">{error}</p>}
      <p className="message" aria-live="polite">{status}</p>

      {loaded && (
        <div className="tool-panels">
          <section className="panel">
            <h2>원본 이미지</h2>
            <img src={loaded.url} alt="선택한 원본 이미지 미리보기" />
            <dl className="info-list">
              <div><dt>가로</dt><dd>{loaded.width}px</dd></div>
              <div><dt>세로</dt><dd>{loaded.height}px</dd></div>
              <div><dt>용량</dt><dd>{formatBytes(loaded.size)}</dd></div>
              <div><dt>형식</dt><dd>{loaded.type.replace("image/", "").toUpperCase()}</dd></div>
            </dl>
          </section>

          <section className="panel settings-panel">
            <h2>설정</h2>
            {(mode === "resize" || mode === "presets") && (
              <>
                <div className="field-row">
                  <label htmlFor="target-width">변경할 가로</label>
                  <input id="target-width" type="number" min="1" value={width} onChange={(event) => updateWidth(Number(event.target.value))} />
                </div>
                <div className="field-row">
                  <label htmlFor="target-height">변경할 세로</label>
                  <input id="target-height" type="number" min="1" value={height} onChange={(event) => updateHeight(Number(event.target.value))} />
                </div>
                <label className="check-row">
                  <input type="checkbox" checked={keepRatio} onChange={(event) => setKeepRatio(event.target.checked)} />
                  원본 비율 유지
                </label>
                <div className="field-row">
                  <label htmlFor="scale">백분율 크기 변경: {scale}%</label>
                  <input id="scale" type="range" min="10" max="200" step="5" value={scale} onChange={(event) => updateScale(Number(event.target.value))} />
                </div>
              </>
            )}

            {mode === "presets" && (
              <div className="preset-list" aria-label="이미지 크기 프리셋">
                {imagePresets.map((preset) => (
                  <button type="button" key={preset.id} onClick={() => { setWidth(preset.width); setHeight(preset.height); }}>
                    <strong>{preset.name}</strong>
                    <span>{preset.width} x {preset.height} · {preset.ratio}</span>
                  </button>
                ))}
              </div>
            )}

            {(mode === "compress" || mode === "convert") && (
              <>
                <div className="field-row">
                  <label htmlFor="quality">출력 품질: {quality} · {qualityLabel}</label>
                  <input id="quality" type="range" min="10" max="100" value={quality} onChange={(event) => setQuality(Number(event.target.value))} />
                </div>
                <div className="field-row">
                  <label htmlFor="output-type">출력 형식</label>
                  <select id="output-type" value={outputType} onChange={(event) => setOutputType(event.target.value)}>
                    <option value="image/jpeg">JPG</option>
                    <option value="image/png">PNG</option>
                    <option value="image/webp">WebP</option>
                  </select>
                </div>
                {isConverterJpg && (
                  <div className="field-row">
                    <label htmlFor="background">JPG 배경색</label>
                    <input id="background" type="color" value={background} onChange={(event) => setBackground(event.target.value)} />
                  </div>
                )}
                {loaded.type === "image/png" && mode === "compress" && (
                  <p className="note">PNG는 JPG처럼 품질 슬라이더만으로 크게 압축되지 않을 수 있습니다. 용량 감소가 작다면 WebP 변환을 함께 확인해 보세요.</p>
                )}
              </>
            )}

            {selectedPreset && <p className="note">선택된 프리셋: {selectedPreset.name}</p>}
            {isConverterJpg && loaded.type !== "image/jpeg" && (
              <p className="note">투명 배경은 JPG에서 보존되지 않으며 선택한 배경색으로 채워집니다.</p>
            )}

            <div className="button-row">
              <button className="primary-button" type="button" onClick={processImage}>변환 실행</button>
              <button className="secondary-button" type="button" onClick={reset}>초기화</button>
            </div>
          </section>

          <section className="panel">
            <h2>결과 이미지</h2>
            {result ? (
              <>
                <img src={result.url} alt="변환된 결과 이미지 미리보기" />
                <dl className="info-list">
                  <div><dt>가로</dt><dd>{result.width}px</dd></div>
                  <div><dt>세로</dt><dd>{result.height}px</dd></div>
                  <div><dt>용량</dt><dd>{formatBytes(result.blob.size)}</dd></div>
                  <div><dt>감소</dt><dd>{savedBytes > 0 ? `${formatBytes(savedBytes)} (${compressionRate}%)` : "변화 없음"}</dd></div>
                </dl>
                <a className="download-button" href={result.url} download={resultName(loaded.file, result.type, mode)}>다운로드</a>
              </>
            ) : (
              <p className="empty-result">설정을 적용하면 결과 미리보기가 여기에 표시됩니다.</p>
            )}
          </section>
        </div>
      )}

      {result && (
        <>
          <AdPlaceholder />
          <CapsuleWidget compact />
        </>
      )}
    </div>
  );
}
