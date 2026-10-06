import { SITE } from '@/app/config/site';
import { StarIcon } from '../ui/Icons';

const STARS_REVALIDATE_SECONDS = 3600;

async function getRepoStars(): Promise<number | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${SITE.repository.slug}`, {
      next: { revalidate: STARS_REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;
    const data: { stargazers_count?: number } = await res.json();
    return data.stargazers_count ?? null;
  } catch {
    return null;
  }
}

const FOOTER_LINK = 'text-gray-500 hover:text-accent transition-colors text-sm font-mono';

export default async function FooterSection() {
  const stars = await getRepoStars();

  return (
    <footer className="py-10 border-t border-gray-200">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <div className="text-center md:text-left">
            <span className="text-2xl font-mono font-bold text-accent">{SITE.brand}</span>
            <p className="text-xs text-gray-400 mt-1 font-mono">{'// costruito con caffè, bug e determinazione'}</p>
          </div>

          <div className="flex gap-6 items-center">
            <a href={SITE.repository.url} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-1.5 ${FOOTER_LINK}`}>
              GitHub
              {stars !== null && (
                <span className="inline-flex items-center gap-0.5 text-xs text-gray-400">
                  <StarIcon className="w-3 h-3 text-yellow-400" />
                  {stars}
                </span>
              )}
            </a>
            <a href={SITE.socials.linkedin.url} target="_blank" rel="noopener noreferrer" className={FOOTER_LINK}>
              LinkedIn
            </a>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6 flex flex-col md:flex-row items-center justify-between gap-2 text-center">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} {SITE.owner}
          </p>
          <p className="text-xs text-gray-400 font-mono">
            Rilasciato sotto{' '}
            <a href={SITE.license.url} target="_blank" rel="noopener noreferrer" className="text-accent">
              {SITE.license.name}
            </a>
            {' — il codice è libero. usalo con saggezza.'}
          </p>
        </div>
      </div>
    </footer>
  );
}
