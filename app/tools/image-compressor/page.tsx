import type { Metadata } from "next";
import { ImageTool } from "../../components/ImageTool";
import { ToolPage } from "../../components/ContentPages";

export const metadata: Metadata = {
  title: "무료 이미지 압축 도구",
  description: "이미지 품질을 조절해 JPG와 WebP 용량을 줄이고 압축 전후 용량을 비교합니다.",
  alternates: { canonical: "/tools/image-compressor" },
};

export default function ImageCompressorPage() {
  return (
    <ToolPage
      title="무료 이미지 압축 도구"
      description="품질 슬라이더로 용량과 화질의 균형을 찾고 결과 파일 크기를 바로 확인하세요."
      notice="압축은 브라우저의 Canvas API를 사용하며 현재 파일을 외부 서버로 전송하지 않습니다."
    >
      <ImageTool mode="compress" />
    </ToolPage>
  );
}
