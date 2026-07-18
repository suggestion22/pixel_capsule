import type { Metadata } from "next";
import { GuidePage } from "../../components/ContentPages";

export const metadata: Metadata = {
  title: "브라우저 이미지 처리 방식",
  description: "File API, Canvas API, Blob을 사용해 이미지가 기기 안에서 처리되는 방식과 한계를 설명합니다.",
  alternates: { canonical: "/guides/browser-image-processing" },
};

export default function BrowserProcessingGuidePage() {
  return (
    <GuidePage title="브라우저 이미지 처리 방식" description="Pixel Capsule의 초기 도구는 서버 업로드 없이 브라우저에서 이미지를 처리하도록 설계되었습니다.">
      <h2>파일 선택</h2>
      <p>브라우저의 File API로 사용자가 선택한 파일을 읽고 미리보기 URL을 만듭니다. 이 단계에서 파일을 서버로 전송하지 않습니다.</p>
      <h2>Canvas 변환</h2>
      <p>이미지를 Canvas에 그린 뒤 원하는 크기와 형식의 Blob으로 다시 저장합니다. 이 과정은 사용자의 기기 성능과 브라우저 메모리에 영향을 받습니다.</p>
      <h2>한계</h2>
      <p>매우 큰 이미지, 손상된 파일, 브라우저가 지원하지 않는 형식은 처리되지 않을 수 있습니다. 향후 서버 처리 기능이 추가되면 정책 문구도 함께 바뀌어야 합니다.</p>
    </GuidePage>
  );
}
