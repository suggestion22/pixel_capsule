import type { Metadata } from "next";
import { ImageTool } from "../../components/ImageTool";
import { ToolPage } from "../../components/ContentPages";

export const metadata: Metadata = {
  title: "무료 이미지 형식 변환 도구",
  description: "JPG, PNG, WebP 이미지를 변환하고 JPG 배경색과 출력 품질을 설정합니다.",
  alternates: { canonical: "/tools/image-converter" },
};

export default function ImageConverterPage() {
  return (
    <ToolPage
      title="무료 이미지 형식 변환 도구"
      description="PNG, JPG, WebP 사이의 변환과 투명 배경 처리 옵션을 제공합니다."
      notice="형식 변환은 브라우저 안에서 이루어지며 결과 이미지에 워터마크를 넣지 않습니다."
    >
      <ImageTool mode="convert" />
    </ToolPage>
  );
}
