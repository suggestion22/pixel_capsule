import Link from "next/link";
import { SiteShell } from "./components/SiteShell";

export default function NotFound() {
  return (
    <SiteShell>
      <main>
        <section className="page-hero not-found">
          <p className="eyebrow">404</p>
          <h1>페이지를 찾을 수 없습니다.</h1>
          <p>주소가 바뀌었거나 아직 공개되지 않은 페이지일 수 있습니다.</p>
          <Link className="primary-button" href="/">홈으로 이동</Link>
        </section>
      </main>
    </SiteShell>
  );
}
