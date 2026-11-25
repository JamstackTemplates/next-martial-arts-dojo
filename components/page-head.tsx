import type { ReactNode } from 'react';
import { Enso, Kasure, PineBough } from './art/ink';

type Children = { children: ReactNode };

/**
 * Inner-page heading: a tall, narrow scroll panel holding one kanji in huge display type, with the
 * English heading and introduction beside it. Page copy goes in PageHead.Title / .Intro / .Extra.
 */
function PageHeadRoot({ kanji, reading, children, art = 'enso' }: Children & {
  /** One character, e.g. 道. Decorative: its reading is shown beside it. */
  kanji: string;
  /** Romanised reading and meaning, e.g. "Dō, the way". */
  reading: string;
  art?: 'enso' | 'kasure';
}) {
  const seed = kanji.codePointAt(0)! % 50;
  return (
    <header className="zen-wash-glow relative overflow-hidden">
      <PineBough flip seed={seed + 40} className="absolute -top-3 -right-12 hidden w-72 opacity-[.075] md:block" />
      <div className="wrap relative z-10 grid items-end gap-x-[clamp(1.5rem,5vw,4.5rem)] gap-y-8 pt-[clamp(2.5rem,5.5vw,4.5rem)] pb-[clamp(2.5rem,4.5vw,4rem)] sm:grid-cols-[auto_1fr]">
        <div className="flex items-end gap-4 sm:block">
          <div className="mount relative grid w-[clamp(5.2rem,11vw,8.5rem)] place-items-center px-2 pt-5 pb-7 sm:pt-8 sm:pb-10">
            {art === 'enso' ? <Enso className="absolute inset-x-1 top-1/2 -translate-y-1/2 opacity-20" seed={seed} /> : null}
            <span lang="ja" aria-hidden="true" className="relative font-display text-[clamp(3.6rem,8vw,6.2rem)] leading-none font-extrabold">{kanji}</span>
          </div>
          <p className="mt-4 font-mono text-xs uppercase tracking-[.06em] text-muted sm:mt-4 sm:text-center">{reading}</p>
        </div>
        <div className="pb-1">
          {children}
          {art === 'kasure' ? <Kasure variant={2} className="mt-7 max-w-md opacity-75" /> : null}
        </div>
      </div>
      <div className="wrap" aria-hidden="true"><div className="zen-rule-fade" /></div>
    </header>
  );
}

function Title({ children, id }: Children & { id?: string }) {
  return <h1 id={id} className="max-w-[16ch] text-[clamp(2.7rem,6.4vw,5.2rem)]">{children}</h1>;
}

function Intro({ children }: Children) {
  return <div className="measure mt-6 text-[clamp(1.08rem,1.6vw,1.24rem)] leading-relaxed text-muted [&>p+p]:mt-3">{children}</div>;
}

function Extra({ children }: Children) {
  return <div className="mt-7">{children}</div>;
}

export const PageHead = Object.assign(PageHeadRoot, { Title, Intro, Extra });
