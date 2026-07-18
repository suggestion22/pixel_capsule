import type { Metadata } from "next";
import { GuidePage } from "../../components/ContentPages";

export const metadata: Metadata = {
  title: "이미지 해상도와 크기의 차이",
  description: "픽셀 크기, 비율, 파일 용량의 차이를 이해하고 SNS와 웹에 맞게 조정하세요.",
  alternates: { canonical: "/guides/image-size-guide" },
};

export default function SizeGuidePage() {
  return (
    <GuidePage title="이미지 해상도와 크기의 차이" description="이미지 작업에서 크기는 픽셀 수, 비율, 파일 용량을 함께 봐야 합니다.">
      <h2>픽셀 크기</h2>
      <p>1280 x 720 같은 값은 이미지의 실제 가로와 세로 픽셀 수입니다. 표시 영역보다 지나치게 크면 로딩이 느려질 수 있습니다.</p>
      <h2>비율</h2>
      <p>16:9, 1:1, 4:5 같은 비율은 화면에서 보이는 형태를 결정합니다. SNS별 권장 비율에 맞추면 잘림을 줄일 수 있습니다.</p>
      <h2>파일 용량</h2>
      <p>같은 픽셀 크기라도 형식과 품질에 따라 용량이 크게 달라집니다. 크기 변경과 압축을 함께 확인하는 것이 좋습니다.</p>
    </GuidePage>
  );
}
