import type { Metadata } from "next";
import { StandardPage } from "../components/ContentPages";

export const metadata: Metadata = {
  title: "About",
  description: "Pixel Capsule이 제공하는 무료 브라우저 이미지 도구의 목적과 원칙입니다.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <StandardPage eyebrow="About" title="Pixel Capsule 소개" description="Pixel Capsule은 설치와 회원가입 없이 사용할 수 있는 무료 이미지 도구 사이트입니다.">
      <h2>우리가 만드는 것</h2>
      <p>이미지 크기 변경, 압축, 형식 변환, SNS 규격 프리셋을 한 곳에서 빠르게 처리할 수 있게 만드는 것이 핵심입니다.</p>
      <h2>운영 원칙</h2>
      <p>다운로드 전에 광고 클릭이나 보너스 기능 이용을 요구하지 않습니다. 결과 이미지에는 워터마크를 삽입하지 않습니다.</p>
      <h2>아이디어 캡슐</h2>
      <p>아이디어 캡슐은 작업 후 짧은 디자인 팁을 제공하는 보조 기능입니다. 이미지 도구 사용을 방해하지 않도록 설계했습니다.</p>
    </StandardPage>
  );
}
