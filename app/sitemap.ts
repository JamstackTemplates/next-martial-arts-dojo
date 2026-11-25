import type { MetadataRoute } from 'next';
import { absoluteUrl } from '../lib/paths';

export const dynamic = 'force-static';

/** Every public route. Add new pages here. */
export const ROUTES = ['/', '/programs/', '/belts/', '/timetable/', '/instructors/', '/contact/'] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.flatMap(path => {
    const url = absoluteUrl(path);
    return url ? [{ url }] : [];
  });
}
