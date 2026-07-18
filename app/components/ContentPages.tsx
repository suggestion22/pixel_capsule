import Link from "next/link";
import { AdPlaceholder, GuideCards, SiteShell, ToolCards } from "./SiteShell";

export function StandardPage({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <SiteShell>
      <main>
        <section className="page-hero">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p>{description}</p>
        </section>
        <section className="text-page">{children}</section>
      </main>
    </SiteShell>
  );
}

export function ToolPage({
  title,
  description,
  notice,
  children,
}: {
  title: string;
  description: string;
  notice: string;
  children: React.ReactNode;
}) {
  return (
    <SiteShell>
      <main>
        <section className="page-hero tool-hero">
          <p className="eyebrow">Browser image tool</p>
          <h1>{title}</h1>
          <p>{description}</p>
          <p className="privacy-note">{notice}</p>
        </section>
        {children}
        <section className="text-page">
          <h2>사용 방법</h2>
          <ol>
            <li>JPG, PNG 또는 WebP 이미지를 선택하거나 드래그 앤 드롭합니다.</li>
            <li>원하는 크기, 품질, 형식 또는 프리셋을 설정합니다.</li>
            <li>변환 실행 후 결과 미리보기와 용량을 확인합니다.</li>
            <li>다운로드 버튼으로 결과 파일을 저장합니다.</li>
          </ol>
          <h2>주의사항</h2>
          <p>
            이미지는 브라우저 메모리 안에서 처리되므로 매우 큰 파일이나 손상된 파일은 처리되지 않을 수 있습니다.
            낮은 품질로 저장한 이미지는 원래 선명도로 되돌리기 어렵기 때문에 원본 파일을 보관해 주세요.
          </p>
          <h2>자주 묻는 질문</h2>
          <h3>이미지가 서버에 업로드되나요?</h3>
          <p>현재 도구는 파일을 서버로 보내지 않고 브라우저에서 Canvas API로 처리합니다.</p>
          <h3>PNG 압축률이 낮은 이유는 무엇인가요?</h3>
          <p>PNG는 JPG처럼 단순 품질 조절로 압축되는 형식이 아니어서 WebP 변환이 더 효과적일 수 있습니다.</p>
        </section>
        <AdPlaceholder />
        <section className="section-block">
          <div className="section-heading">
            <p className="eyebrow">More tools</p>
            <h2>관련 도구</h2>
          </div>
          <ToolCards />
        </section>
      </main>
    </SiteShell>
  );
}

export function GuidePage({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <SiteShell>
      <main>
        <section className="page-hero">
          <p className="eyebrow">Guide</p>
          <h1>{title}</h1>
          <p>{description}</p>
        </section>
        <section className="text-page">
          {children}
          <div className="next-links">
            <Link href="/tools/image-resizer">이미지 크기 변경하기</Link>
            <Link href="/tools/image-compressor">이미지 압축하기</Link>
          </div>
        </section>
        <AdPlaceholder />
        <section className="section-block">
          <div className="section-heading">
            <p className="eyebrow">Related</p>
            <h2>다른 가이드</h2>
          </div>
          <GuideCards />
        </section>
      </main>
    </SiteShell>
  );
}
