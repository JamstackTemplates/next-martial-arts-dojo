'use client';

import { useEffect, useState } from 'react';
import { instructorById } from '../content/instructors';
import type { Session } from '../content/timetable';
import { formatTime, sessionsOn, todayAndTomorrow, weekDayLabel, type WeekDay } from '../lib/schedule';
import { site } from '../lib/site';
import { LevelMark } from './art/misc';

type Column = { heading: string; day: WeekDay };

/**
 * Today's and tomorrow's classes. Static output shows a typical Monday under a neutral heading;
 * the browser swaps in today and tomorrow in the dojo's time zone, refreshing every minute.
 */
export function OnTheMat({ sessions }: { sessions: readonly Session[] }) {
  const [columns, setColumns] = useState<Column[]>([{ heading: 'A typical Monday', day: 'mon' }]);
  useEffect(() => {
    const update = () => {
      const days = todayAndTomorrow(site.timeZone, new Date());
      if (!days) return;
      setColumns([
        { heading: `Today, ${weekDayLabel(days[0])}`, day: days[0] },
        { heading: `Tomorrow, ${weekDayLabel(days[1])}`, day: days[1] },
      ]);
    };
    update();
    const timer = setInterval(update, 60_000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`grid gap-x-12 gap-y-10 ${columns.length > 1 ? 'md:grid-cols-2' : ''}`}>
      {columns.map(column => {
        const list = sessionsOn(column.day, sessions);
        return (
          <div key={column.heading}>
            <h3 className="font-display text-2xl">{column.heading}</h3>
            {list.length ? (
              <ol className="mt-4">
                {list.map(session => (
                  <li key={session.id} className="grid grid-cols-[6.5rem_1fr] items-baseline gap-x-4 border-t border-ink/70 py-3.5 sm:grid-cols-[8.5rem_1fr]">
                    <span className="font-mono text-[1.35rem] leading-none tabular-nums sm:text-[1.6rem]">{formatTime(session.start)}</span>
                    <span>
                      <span className="block font-semibold">{session.title}</span>
                      <span className="flex items-center gap-2 text-[.92rem] text-muted">
                        <LevelMark level={session.level} className="size-4 shrink-0" />
                        until {formatTime(session.end)}, with {instructorById(session.instructorId)?.name.split(' ')[0]}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="mt-4 border-t border-ink/70 py-4 text-muted">Rest day. The dojo is closed.</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
