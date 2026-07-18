import type { Metadata } from "next";
import { ImageTool } from "../../components/ImageTool";
import { ToolPage } from "../../components/ContentPages";

export const metadata: Metadata = {
  title: "무료 이미지 크기 변경 도구",
  description: "JPG, PNG, WebP 이미지를 원하는 픽셀 크기나 백분율로 브라우저에서 변경합니다.",
  alternates: { canonical: "/tools/image-resizer" },
};

export default function ImageResizerPage() {
  return (
    <ToolPage
      title="무료 이미지 크기 변경 도구"
      description="원본 비율 유지, 백분율 조절, 결과 미리보기와 다운로드를 지원합니다."
      notice="선택한 이미지는 서버에 업로드하지 않고 사용자의 브라우저 안에서 처리됩니다."
    >
      <ImageTool mode="resize" />
    </ToolPage>
  );
}
