import type { Metadata } from "next";
import { ImageTool } from "../../components/ImageTool";
import { ToolPage } from "../../components/ContentPages";
import { imagePresets, presetLastChecked } from "../../lib/data";

export const metadata: Metadata = {
  title: "SNS 이미지 크기 프리셋",
  description: "YouTube, Instagram, Open Graph, 블로그 썸네일 규격을 선택해 이미지 크기를 변경합니다.",
  alternates: { canonical: "/tools/image-presets" },
};

export default function ImagePresetsPage() {
  return (
    <ToolPage
      title="SNS 및 웹 이미지 크기 프리셋"
      description="자주 쓰는 규격을 직접 입력하지 않고 선택해서 이미지 크기에 적용하세요."
      notice={`프리셋 데이터는 별도 객체로 관리됩니다. 마지막 확인 날짜: ${presetLastChecked}`}
    >
      <div className="preset-overview">
        {imagePresets.map((preset) => (
          <div key={preset.id}>
            <strong>{preset.name}</strong>
            <span>{preset.width} x {preset.height} · {preset.ratio}</span>
          </div>
        ))}
      </div>
      <ImageTool mode="presets" />
    </ToolPage>
  );
}
