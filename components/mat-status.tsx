'use client';

import { useEffect, useState } from 'react';
import type { Session } from '../content/timetable';
import { matStatus, matStatusLabel, NEUTRAL_STATUS, type MatStatus } from '../lib/schedule';
import { site } from '../lib/site';

/**
 * "On the mat now / next class", computed in the browser in the dojo's time zone and refreshed every
 * minute. Static HTML and no-JS visitors see neutral copy.
 */
export function MatStatusLine({ sessions, className = '' }: { sessions: readonly Session[]; className?: string }) {
  const [status, setStatus] = useState<MatStatus>({ kind: 'unknown' });
  useEffect(() => {
    const update = () => setStatus(matStatus(sessions, site.timeZone, new Date()));
    update();
    const timer = setInterval(update, 60_000);
    return () => clearInterval(timer);
  }, [sessions]);
  const live = status.kind === 'on';
  return (
    <p className={`flex items-start gap-3 ${className}`} data-status={status.kind}>
      <span aria-hidden="true" className="relative mt-[.45em] grid size-3 shrink-0 place-items-center">
        {live ? <span className="absolute inset-0 animate-ping rounded-full bg-primary-ink opacity-50" /> : null}
        <span className={`size-2.5 rounded-full ${live ? 'bg-primary-ink' : 'border-2 border-muted'}`} />
      </span>
      <span>{status.kind === 'unknown' ? NEUTRAL_STATUS : matStatusLabel(status)}</span>
    </p>
  );
}
