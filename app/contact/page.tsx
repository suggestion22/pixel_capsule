import type { Metadata } from "next";
import { StandardPage } from "../components/ContentPages";

export const metadata: Metadata = {
  title: "Contact",
  description: "Pixel Capsule 문의 방법과 피드백 안내입니다.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <StandardPage eyebrow="Contact" title="문의하기" description="오류 제보, 기능 제안, 정책 문의가 있다면 아래 방법으로 연락해 주세요.">
      <h2>문의 방법</h2>
      <p>현재는 별도 서버 문의 폼을 사용하지 않습니다. 공개 후 운영 이메일을 연결할 예정입니다.</p>
      <p><strong>이메일:</strong> hello@pixelcapsule.example</p>
      <h2>보내주면 좋은 정보</h2>
      <p>사용한 브라우저, 이미지 형식, 오류가 발생한 도구, 재현 단계를 함께 보내주시면 문제를 더 빠르게 확인할 수 있습니다.</p>
    </StandardPage>
  );
}
