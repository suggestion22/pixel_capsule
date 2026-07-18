import type { Metadata } from "next";
import { StandardPage } from "../components/ContentPages";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Pixel Capsule의 이미지 처리, 쿠키, 광고, 분석 도구 사용 가능성에 관한 개인정보처리방침입니다.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <StandardPage eyebrow="Privacy" title="개인정보처리방침" description="시행일: 2026년 7월 18일">
      <h2>이미지 파일 처리 방식</h2>
      <p>현재 이미지 크기 변경, 압축, 형식 변환 기능은 브라우저 내부에서 처리됩니다. 선택한 이미지 파일은 Pixel Capsule 서버에 업로드하거나 저장하지 않습니다.</p>
      <h2>문의 시 수집 정보</h2>
      <p>이메일 문의를 보내는 경우 답변을 위해 이메일 주소, 문의 내용, 사용자가 직접 제공한 정보를 확인할 수 있습니다.</p>
      <h2>쿠키와 광고</h2>
      <p>사이트는 다크모드 같은 로컬 설정 저장을 위해 브라우저 저장소를 사용할 수 있습니다. 향후 Google AdSense가 적용되면 제3자 광고 사업자가 쿠키를 사용할 수 있습니다.</p>
      <h2>분석 도구</h2>
      <p>현재 Google Analytics 코드는 삽입되어 있지 않습니다. 향후 분석 도구가 추가되면 이 정책을 갱신합니다.</p>
      <h2>쿠키 관리</h2>
      <p>이용자는 브라우저 설정에서 쿠키 저장, 삭제, 맞춤 광고 설정을 관리할 수 있습니다.</p>
      <h2>문의</h2>
      <p>개인정보 관련 문의는 hello@pixelcapsule.example 로 연락해 주세요. 실제 운영 전 공식 이메일로 교체해야 합니다.</p>
    </StandardPage>
  );
}
