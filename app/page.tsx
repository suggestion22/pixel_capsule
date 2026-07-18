import type { Metadata } from "next";
import Link from "next/link";
import { CapsuleWidget } from "./components/CapsuleWidget";
import { AdPlaceholder, GuideCards, SiteShell, ToolCards } from "./components/SiteShell";

export const metadata: Metadata = {
  title: "무료 브라우저 이미지 도구",
  description: "이미지 크기 변경, 용량 압축, 형식 변환을 브라우저에서 빠르게 처리하세요.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <SiteShell>
      <main>
        <section className="hero-section">
          <div className="hero-copy">
            <p className="eyebrow">Free browser image tools</p>
            <h1>빠른 이미지 변환과 작은 아이디어 캡슐</h1>
            <p>
              이미지 크기 변경, 용량 압축, 형식 변환을 브라우저에서 빠르게 처리하세요.
              파일은 가능한 범위에서 사용자의 기기 안에서 처리됩니다.
            </p>
            <div className="button-row">
              <Link className="primary-button" href="/tools/image-resizer">이미지 크기 변경</Link>
              <Link className="secondary-button" href="/tools/image-compressor">이미지 압축</Link>
            </div>
          </div>
          <div className="hero-tool" aria-label="Pixel Capsule 이미지 도구 미리보기">
            <div className="pixel-board">
              {Array.from({ length: 36 }).map((_, index) => (
                <span key={index} className={index % 5 === 0 ? "active" : index % 7 === 0 ? "accent" : ""} />
              ))}
            </div>
            <div className="mini-result">
              <span>1280 x 720</span>
              <strong>WebP</strong>
              <em>-42%</em>
            </div>
          </div>
        </section>

        <section className="section-block">
          <div className="section-heading">
            <p className="eyebrow">Tools</p>
            <h2>대표 이미지 도구</h2>
          </div>
          <ToolCards />
        </section>

        <section className="trust-band" aria-label="브라우저 처리 안내">
          {["회원가입 없음", "워터마크 없음", "브라우저에서 처리", "빠른 다운로드", "모바일 지원"].map((item) => (
            <span key={item}>{item}</span>
          ))}
        </section>

        <section className="split-section">
          <div>
            <p className="eyebrow">Idea Capsule</p>
            <h2>작업이 끝난 뒤 작은 아이디어를 만나보세요.</h2>
            <p>
              이미지 비율, 파일 형식, 컬러 조합, 썸네일 구성에 관한 짧은 추천을 랜덤으로 제공합니다.
              다운로드를 막거나 사용을 강제하지 않습니다.
            </p>
          </div>
          <CapsuleWidget />
        </section>

        <AdPlaceholder />

        <section className="section-block">
          <div className="section-heading">
            <p className="eyebrow">Guides</p>
            <h2>이미지 최적화 가이드</h2>
          </div>
          <GuideCards />
        </section>
      </main>
    </SiteShell>
  );
}
