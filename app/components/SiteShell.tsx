import Link from "next/link";
import { guideCards, tools } from "../lib/data";
import { ThemeControls } from "./ThemeControls";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="site-header">
        <Link className="brand" href="/" aria-label="Pixel Capsule 홈">
          <span className="brand-mark" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </span>
          Pixel Capsule
        </Link>
        <ThemeControls />
      </header>
      {children}
      <footer className="site-footer">
        <div>
          <Link className="brand footer-brand" href="/">
            <span className="brand-mark" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </span>
            Pixel Capsule
          </Link>
          <p>브라우저에서 빠르게 처리하는 무료 이미지 도구.</p>
        </div>
        <nav aria-label="푸터 링크">
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/privacy-policy">Privacy Policy</Link>
          <Link href="/terms">Terms of Use</Link>
          <Link href="/guides/image-size-guide">Guides</Link>
        </nav>
        <p className="copyright">© Pixel Capsule. All rights reserved.</p>
      </footer>
    </>
  );
}

export function ToolCards() {
  return (
    <div className="tool-grid">
      {tools.map((tool, index) => (
        <Link className="tool-card" href={tool.href} key={tool.id}>
          <span className="tool-icon" aria-hidden="true">{index + 1}</span>
          <strong>{tool.title}</strong>
          <span>{tool.description}</span>
          <em>{tool.label} 열기</em>
        </Link>
      ))}
    </div>
  );
}

export function GuideCards() {
  return (
    <div className="guide-grid">
      {guideCards.map((guide) => (
        <Link className="content-card" href={guide.href} key={guide.href}>
          <strong>{guide.title}</strong>
          <span>{guide.description}</span>
        </Link>
      ))}
    </div>
  );
}

export function AdPlaceholder() {
  return (
    <div className="ad-placeholder" aria-label="Advertisement placeholder">
      Advertisement
    </div>
  );
}
