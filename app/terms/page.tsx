import type { Metadata } from "next";
import { StandardPage } from "../components/ContentPages";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Pixel Capsule 무료 이미지 도구 이용약관입니다.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <StandardPage eyebrow="Terms" title="이용약관" description="Pixel Capsule을 사용하기 전에 아래 내용을 확인해 주세요.">
      <h2>서비스 범위</h2>
      <p>Pixel Capsule은 브라우저 기반 이미지 크기 변경, 압축, 형식 변환, 프리셋 선택 기능을 무료로 제공합니다.</p>
      <h2>사용자 책임</h2>
      <p>사용자는 자신이 권리를 가진 이미지 또는 사용 허가를 받은 이미지만 처리해야 합니다. 처리 결과의 최종 사용 책임은 사용자에게 있습니다.</p>
      <h2>기능 제한</h2>
      <p>브라우저 환경, 이미지 크기, 파일 손상 여부에 따라 일부 처리가 실패할 수 있습니다. 서비스는 가능한 범위에서 오류 메시지와 안내를 제공합니다.</p>
      <h2>광고</h2>
      <p>초기 버전에는 실제 광고 코드 대신 광고 위치 표시만 포함합니다. 광고가 적용되더라도 다운로드나 도구 실행을 방해하지 않는 위치에 배치합니다.</p>
    </StandardPage>
  );
}
