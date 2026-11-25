import type { OpeningHours } from '../lib/hours';
import { formatTime } from '../lib/schedule';

/** Weekly open hours as a compact table. Static: it never says whether the dojo is open right now. */
export function HoursTable({ hours, className = '' }: { hours: readonly OpeningHours[]; className?: string }) {
  return (
    <table className={`w-full max-w-xs border-collapse ${className}`}>
      <caption className="sr-only">Open hours</caption>
      <tbody>
        {hours.map(entry => (
          <tr key={entry.day} className="border-b border-line/70 last:border-0">
            <th scope="row" className="py-1 pr-4 text-left font-medium">{entry.day}</th>
            <td className="py-1 text-right font-mono text-[.88em] tabular-nums">
              {entry.opens && entry.closes ? `${formatTime(entry.opens)} – ${formatTime(entry.closes)}` : 'Rest day'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
