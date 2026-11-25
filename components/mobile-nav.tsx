'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { SiteLink } from './site-link';

/** Small-screen navigation. A native <details> disclosure, so it works without JavaScript; closes after navigating. */
export function MobileNav({ items }: { items: readonly { href: string; label: string }[] }) {
  const ref = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();
  useEffect(() => { if (ref.current) ref.current.open = false; }, [pathname]);
  return (
    <details ref={ref} className="group relative lg:hidden">
      <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-ui border border-line px-3 font-medium [&::-webkit-details-marker]:hidden">
        <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M4 7.2c5.4-.4 10.6-.3 16 .2M4 12.2c4-.2 8-.2 12 0M4 17c5.4.3 10.6.2 16-.2" className="group-open:hidden" />
          <path d="M6 6l12 12M18 6 6 18" className="hidden group-open:block" />
        </svg>
        <span className="sr-only sm:not-sr-only">Menu</span>
      </summary>
      <nav aria-label="Main" className="mount absolute top-[calc(100%+.9rem)] right-0 z-30 grid w-[min(17rem,calc(100vw-2.5rem))] p-4">
        {items.map(item => (
          <SiteLink key={item.href} href={item.href} markCurrent="page"
            className="group/item flex items-center justify-between border-b border-line/65 px-2 py-3 font-display text-xl font-extrabold no-underline transition-colors last:border-b-0 hover:bg-bg/70 aria-[current=page]:border-seal/45 aria-[current=page]:text-primary-ink">
            <span>{item.label}</span>
            <span aria-hidden="true" className="size-1.5 rotate-45 bg-seal opacity-0 transition-opacity group-aria-[current=page]/item:opacity-100" />
          </SiteLink>
        ))}
      </nav>
    </details>
  );
}
