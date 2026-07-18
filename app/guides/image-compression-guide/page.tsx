import type { Metadata } from "next";
import { GuidePage } from "../../components/ContentPages";

export const metadata: Metadata = {
  title: "이미지 용량을 줄이는 방법",
  description: "이미지 크기, 품질, 형식을 함께 조절해 웹 이미지 용량을 줄이는 방법입니다.",
  alternates: { canonical: "/guides/image-compression-guide" },
};

export default function CompressionGuidePage() {
  return (
    <GuidePage title="이미지 용량을 줄이는 방법" description="가장 좋은 압축은 품질을 무작정 낮추는 것이 아니라 사용 목적에 맞게 조절하는 것입니다.">
      <h2>먼저 표시 크기를 줄이기</h2>
      <p>웹에서 800px로 표시할 이미지를 4000px 원본 그대로 올리면 불필요하게 무거워집니다. 실제 표시 폭에 맞춰 줄이는 것이 첫 단계입니다.</p>
      <h2>품질은 75에서 85 사이부터</h2>
      <p>JPG와 WebP는 품질 75~85 구간에서 체감 화질과 용량의 균형을 찾기 쉽습니다. 작은 글자나 세부 질감은 결과 화면에서 직접 확인하세요.</p>
      <h2>형식 변환도 비교하기</h2>
      <p>PNG 사진은 WebP나 JPG로 바꾸면 크게 줄어드는 경우가 많습니다. 반대로 투명 배경이 필요한 이미지는 PNG 또는 WebP를 유지해야 합니다.</p>
    </GuidePage>
  );
}
