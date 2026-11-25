'use client';

import { useEffect, useState } from 'react';
import { instructorById } from '../content/instructors';
import type { Program } from '../content/programs';
import { CLASS_DAYS, dayLabel, levelLabel, type Session } from '../content/timetable';
import { filterFromHash, formatTime, sessionsOn, toMinutes } from '../lib/schedule';
import { Enso } from './art/ink';
import { LevelMark } from './art/misc';

const FIRST = 8 * 60;   // grid starts at 8 am
const LAST = 21 * 60;   // and ends at 9 pm

/**
 * The week on a practice-paper grid, with programme tabs. Without JavaScript the whole week shows and
 * the tabs stay hidden. The selected tab is kept in the URL hash (#teens), so links can pre-filter.
 */
export function TimetableView({ sessions, programs }: { sessions: readonly Session[]; programs: readonly Pick<Program, 'id' | 'name'>[] }) {
  const [filter, setFilter] = useState('all');
  const [ready, setReady] = useState(false);
  const ids = programs.map(p => p.id);

  useEffect(() => {
    const read = () => setFilter(filterFromHash(window.location.hash, ids));
    read();
    setReady(true);
    window.addEventListener('hashchange', read);
    return () => window.removeEventListener('hashchange', read);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function choose(id: string) {
    setFilter(id);
    const url = id === 'all' ? window.location.pathname + window.location.search : `#${id}`;
    window.history.replaceState(null, '', url);
  }

  const shown = (s: Session) => filter === 'all' || s.programIds.includes(filter);
  const tabs = [{ id: 'all', name: 'All classes' }, ...programs];
  const count = sessions.filter(shown).length;

  return (
    <div>
      <div role="group" aria-label="Show classes for" className={`flex flex-wrap gap-x-2 gap-y-3 ${ready ? '' : 'hidden'}`}>
        {tabs.map(tab => (
          <button key={tab.id} type="button" aria-pressed={filter === tab.id} onClick={() => choose(tab.id)}
            className="rounded-full border border-line px-4 py-2 font-medium transition-colors hover:border-ink aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-bg">
            {tab.name}
          </button>
        ))}
      </div>
      <p className="sr-only" role="status" aria-live="polite">{ready ? `${count} classes shown` : ''}</p>

      {/* Desktop: day columns positioned by time. */}
      <div className="practice-grid mount mt-8 hidden overflow-hidden lg:block">
        <div className="grid grid-cols-[4.5rem_repeat(6,1fr)_5rem]">
          <div />
          {CLASS_DAYS.map(day => <h3 key={day} className="border-b border-line px-3 py-3 font-display text-xl">{dayLabel[day]}</h3>)}
          <h3 className="border-b border-line px-2 py-3 font-display text-xl text-muted">Sun</h3>
          <div className="relative" style={{ height: `${(LAST - FIRST) * 0.9}px` }}>
            {Array.from({ length: (LAST - FIRST) / 60 + 1 }, (_, i) => FIRST + i * 60).map(m => (
              <span key={m} className="absolute right-3 -translate-y-1/2 font-mono text-xs text-muted" style={{ top: `${(m - FIRST) * 0.9}px` }}>
                {formatTime(`${String(m / 60).padStart(2, '0')}:00`)}
              </span>
            ))}
          </div>
          {CLASS_DAYS.map(day => (
            <div key={day} className="relative border-l border-line/60">
              {sessionsOn(day, sessions).map(s => (
                <article key={s.id} hidden={!shown(s)} aria-label={`${s.title}, ${dayLabel[day]} ${formatTime(s.start)} to ${formatTime(s.end)}`}
                  className="absolute inset-x-1.5 overflow-hidden rounded-ui border-l-4 border-primary bg-surface px-2.5 py-1.5 shadow-[0_1px_0_var(--line)]"
                  style={{ top: `${(toMinutes(s.start) - FIRST) * 0.9}px`, height: `${(toMinutes(s.end) - toMinutes(s.start)) * 0.9 - 2}px` }}>
                  <p className="font-mono text-[.78rem] leading-tight tabular-nums text-muted">{formatTime(s.start)}–{formatTime(s.end)}</p>
                  <h4 className="mt-0.5 flex items-start gap-1.5 text-[.95rem] leading-tight font-semibold">
                    <LevelMark level={s.level} className="mt-0.5 size-3.5 shrink-0" />{s.title}
                  </h4>
                  <p className="text-[.8rem] leading-tight text-muted">{instructorById(s.instructorId)?.name}</p>
                </article>
              ))}
            </div>
          ))}
          <div className="relative grid place-items-center border-l border-line/60 bg-wash/50">
            <div className="grid justify-items-center gap-3 text-center">
              <Enso className="size-14 opacity-60" seed={12} />
              <p className="font-display text-sm [writing-mode:vertical-rl]">Rest day</p>
            </div>
          </div>
        </div>
      </div>

      {/* Small screens and print: stacked days with sticky labels. */}
      <div className="mt-8 grid gap-8 lg:hidden print:grid">
        {CLASS_DAYS.map(day => {
          const list = sessionsOn(day, sessions);
          const visible = list.filter(shown);
          return (
            <section key={day} aria-labelledby={`day-${day}`} hidden={ready && visible.length === 0}>
              <h3 id={`day-${day}`} className="sticky top-0 z-10 border-b-2 border-ink bg-bg/95 py-2 font-display text-2xl backdrop-blur-sm">{dayLabel[day]}</h3>
              <ol>
                {list.map(s => (
                  <li key={s.id} hidden={!shown(s)} className="grid grid-cols-[5.8rem_1fr] gap-x-4 border-b border-line py-3">
                    <span className="font-mono text-[1.05rem] leading-snug tabular-nums">{formatTime(s.start)}<span className="block text-[.85rem] text-muted">to {formatTime(s.end)}</span></span>
                    <span>
                      <span className="flex items-center gap-2 font-semibold"><LevelMark level={s.level} className="size-4 shrink-0" />{s.title}</span>
                      <span className="block text-[.92rem] text-muted">{levelLabel[s.level]}, with {instructorById(s.instructorId)?.name}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </section>
          );
        })}
        <section aria-labelledby="day-sun">
          <h3 id="day-sun" className="border-b-2 border-ink py-2 font-display text-2xl">Sunday</h3>
          <p className="py-3 text-muted">Rest day. The dojo is closed.</p>
        </section>
      </div>
    </div>
  );
}
