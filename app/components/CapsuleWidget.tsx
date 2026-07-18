"use client";

import React from "react";
import Link from "next/link";
import { capsuleIdeas } from "../lib/data";

function pickRandomId(exceptId?: number) {
  if (capsuleIdeas.length === 1) return capsuleIdeas[0].id;
  let next = capsuleIdeas[Math.floor(Math.random() * capsuleIdeas.length)].id;
  while (next === exceptId) {
    next = capsuleIdeas[Math.floor(Math.random() * capsuleIdeas.length)].id;
  }
  return next;
}

export function CapsuleWidget({ compact = false }: { compact?: boolean }) {
  const first = capsuleIdeas[0];
  const [ideaId, setIdeaId] = React.useState(first.id);
  const [collapsed, setCollapsed] = React.useState(false);
  const [hidden, setHidden] = React.useState(false);
  const idea = capsuleIdeas.find((item) => item.id === ideaId) ?? first;

  if (hidden) return null;

  return (
    <section className={compact ? "capsule-card compact" : "capsule-card"} aria-label="아이디어 캡슐">
      <div className="capsule-top">
        <div>
          <span className="capsule-category">{idea.category}</span>
          <h2>{compact ? "오늘의 아이디어 캡슐" : idea.title}</h2>
        </div>
        <div className="capsule-actions">
          <button type="button" onClick={() => setCollapsed((value) => !value)} aria-label="아이디어 접기">
            {collapsed ? "펼치기" : "접기"}
          </button>
          <button type="button" onClick={() => setHidden(true)} aria-label="아이디어 닫기">
            닫기
          </button>
        </div>
      </div>
      {!collapsed && (
        <>
          {compact && <h3>{idea.title}</h3>}
          <p>{idea.description}</p>
          <div className="capsule-bottom">
            <button type="button" onClick={() => setIdeaId(pickRandomId(idea.id))}>
              새 아이디어 뽑기
            </button>
            <Link href={idea.toolHref}>관련 도구로 이동</Link>
          </div>
        </>
      )}
    </section>
  );
}
