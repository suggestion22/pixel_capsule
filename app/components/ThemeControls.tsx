"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/tools/image-resizer", label: "Resize" },
  { href: "/tools/image-compressor", label: "Compress" },
  { href: "/tools/image-converter", label: "Convert" },
  { href: "/tools/image-presets", label: "Presets" },
  { href: "/guides/image-size-guide", label: "Guides" },
];

export function ThemeControls() {
  const [isDark, setIsDark] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("pixel-capsule-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const nextDark = saved ? saved === "dark" : prefersDark;
    document.documentElement.dataset.theme = nextDark ? "dark" : "light";
    setIsDark(nextDark);
  }, []);

  function toggleTheme() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    window.localStorage.setItem("pixel-capsule-theme", next ? "dark" : "light");
  }

  return (
    <div className="nav-wrap">
      <nav className={isOpen ? "main-nav is-open" : "main-nav"} aria-label="주요 메뉴">
        {navItems.map((item) => (
          <Link href={item.href} key={item.href} onClick={() => setIsOpen(false)}>
            {item.label}
          </Link>
        ))}
      </nav>
      <button className="icon-button" type="button" onClick={toggleTheme} aria-label="다크모드 전환">
        {isDark ? "Light" : "Dark"}
      </button>
      <button
        className="menu-button"
        type="button"
        aria-label="모바일 메뉴 열기"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((value) => !value)}
      >
        <span />
        <span />
        <span />
      </button>
    </div>
  );
}
