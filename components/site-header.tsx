import { DarkModeToggle } from 'jamstacks';
import { business } from '../content/business';
import { HeaderRule, Seal } from './art/ink';
import { MobileNav } from './mobile-nav';
import { SiteLink } from './site-link';

export const NAV = [
  { href: '/programs/', label: 'Programs' },
  { href: '/belts/', label: 'Belts' },
  { href: '/timetable/', label: 'Timetable' },
  { href: '/instructors/', label: 'Instructors' },
  { href: '/contact/', label: 'Contact' },
] as const;

export function SiteHeader() {
  return (
    <header className="relative z-20">
      <div className="wrap flex min-h-22 items-center justify-between gap-4 py-3">
        <SiteLink href="/" className="group flex items-center gap-3 no-underline">
          <Seal text={business.sealMark} className="size-10 shrink-0 sm:size-12 transition-transform duration-300 group-hover:-rotate-3" />
          <span className="font-display text-[1.08rem] leading-[1.02] sm:text-[1.32rem] font-extrabold tracking-[-.01em]">
            <span className="whitespace-nowrap">Still Mountain</span><span className="block text-[.78em] font-extrabold text-muted">Dojo</span>
          </span>
        </SiteLink>
        <nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
          {NAV.map(item => (
            <SiteLink key={item.href} href={item.href} markCurrent="page" className="brush-mark font-medium tracking-[.01em] no-underline">{item.label}</SiteLink>
          ))}
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <SiteLink href="/contact/" className="button min-h-11 px-4 text-[.95rem] whitespace-nowrap max-[380px]:px-3"><span className="sm:hidden">Free trial</span><span className="max-sm:hidden">Free trial class</span></SiteLink>
          <DarkModeToggle />
          <MobileNav items={NAV} />
        </div>
      </div>
      <HeaderRule />
    </header>
  );
}
