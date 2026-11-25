'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import type { Belt } from '../content/belts';
import { BeltLadder } from './belt-ladder';
import { BeltStroke } from './art/belt-stroke';

function Detail({ belt, previous, headingLevel = 3 }: { belt: Belt; previous?: Belt; headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3';
  return (
    <div>
      <BeltStroke swatch={belt.swatch} seed={3} className="h-12 w-64 max-w-full" />
      <Heading className="mt-4 text-[clamp(2.2rem,4vw,3.2rem)]">{belt.belt} belt</Heading>
      <p className="font-mono text-muted">{belt.rank}</p>
      <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-y border-line py-5">
        <div>
          <dt className="text-sm text-muted">Time at {previous ? `${previous.belt.toLowerCase()} belt` : 'the previous rank'}</dt>
          <dd className="font-mono text-2xl tabular-nums">{belt.minMonths ? `${belt.minMonths} months` : 'None'}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted">Classes since last grading</dt>
          <dd className="font-mono text-2xl tabular-nums">{belt.minClasses || 'None'}</dd>
        </div>
        {belt.juniorStripes ? (
          <div className="col-span-2">
            <dt className="text-sm text-muted">Junior stripes first</dt>
            <dd className="mt-1 flex items-center gap-3">
              <span className="flex gap-1" aria-hidden="true">
                {Array.from({ length: belt.juniorStripes }, (_, i) => <span key={i} className="h-5 w-1.5 -skew-x-12 rounded-[1px] bg-ink" />)}
              </span>
              <span>{belt.juniorStripes} stripes on the {previous?.belt.toLowerCase()} belt</span>
            </dd>
          </div>
        ) : null}
      </dl>
      <h4 className="mt-6 font-display text-xl">What you learn</h4>
      <ul className="mt-2 grid gap-1.5">
        {belt.learn.map(item => <li key={item} className="flex gap-3"><span aria-hidden="true" className="mt-[.7em] h-0.5 w-4 shrink-0 bg-ink" />{item}</li>)}
      </ul>
      <p className="mt-5"><span className="text-muted">Kata introduced: </span><span className="font-semibold">{belt.kata || 'None yet. First you learn to stand.'}</span></p>
    </div>
  );
}

/**
 * The full belt ladder with a detail panel. Each stroke is a button; arrow keys move between ranks.
 * Without JavaScript, every rank's details are listed below the ladder instead.
 */
export function BeltExplorer({ belts }: { belts: readonly Belt[] }) {
  const [ready, setReady] = useState(false);
  const [selected, setSelected] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  useEffect(() => setReady(true), []);

  function onKey(event: KeyboardEvent, index: number) {
    const moves: Record<string, number> = { ArrowUp: 1, ArrowRight: 1, ArrowDown: -1, ArrowLeft: -1, Home: -index, End: belts.length - 1 - index };
    const move = moves[event.key];
    if (move === undefined) return;
    event.preventDefault();
    const next = Math.min(belts.length - 1, Math.max(0, index + move));
    setSelected(next);
    buttons.current[next]?.focus();
  }

  return (
    <div className="grid items-start gap-x-16 gap-y-12 lg:grid-cols-[1.1fr_1fr]">
      <BeltLadder belts={belts} className="mx-auto w-full max-w-xl" renderItem={(belt, index, stroke) => ready ? (
        <button
          ref={el => { buttons.current[index] = el; }}
          type="button"
          aria-pressed={selected === index}
          tabIndex={selected === index ? 0 : -1}
          onClick={() => setSelected(index)}
          onKeyDown={event => onKey(event, index)}
          className="group flex items-center gap-3 rounded-ui py-1 pr-3 text-left transition-transform duration-300 aria-pressed:-translate-y-1"
        >
          <span className="transition-transform duration-300 group-hover:translate-x-1 group-aria-pressed:scale-[1.06]">{stroke}</span>
          <span className="leading-tight">
            <span className="block font-semibold group-aria-pressed:underline group-aria-pressed:decoration-2 group-aria-pressed:underline-offset-4">{belt.belt}</span>
            <span className="block font-mono text-[.8rem] text-muted">{belt.rank}</span>
          </span>
        </button>
      ) : (
        <a href={`#rank-${belt.id}`} className="flex items-center gap-3 no-underline">
          {stroke}
          <span className="leading-tight"><span className="block font-semibold underline">{belt.belt}</span><span className="block font-mono text-[.8rem] text-muted">{belt.rank}</span></span>
        </a>
      )} />

      {ready ? (
        <div className="mount p-6 sm:p-8 lg:sticky lg:top-8" aria-live="polite">
          <Detail belt={belts[selected]} previous={belts[selected - 1]} />
          <p className="mt-6 text-sm text-muted">Use the arrow keys on the ladder to climb or descend.</p>
        </div>
      ) : (
        <ol className="grid gap-10 lg:col-span-2">
          {belts.map((belt, index) => (
            <li key={belt.id} id={`rank-${belt.id}`} className="mount p-6 sm:p-8">
              <Detail belt={belt} previous={belts[index - 1]} />
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
