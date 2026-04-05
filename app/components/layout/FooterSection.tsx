'use client';
import { useEffect, useState } from 'react';

async function getRepoStars(): Promise<number | null> {
  try {
    const res = await fetch('https://api.github.com/repos/Retr0dev-jpg/Portfolio', {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.stargazers_count ?? null;
  } catch {
    return null;
  }
}

export default function FooterSection() {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    getRepoStars().then(setStars);
  }, []);

  return (
    <footer className="py-10 border-t border-gray-200">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <div className="text-center md:text-left">
            <span className="text-2xl font-mono font-bold text-accent">Retr0_</span>
            <p className="text-xs text-gray-400 mt-1 font-mono">
              {`// costruito con caffè, bug e determinazione`}
            </p>
          </div>

          <div className="flex gap-6 items-center">
            <a
              href="https://github.com/Retr0dev-jpg/Portfolio"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-gray-500 hover:text-accent transition-colors text-sm font-mono"
            >
              GitHub
              {stars !== null && (
                <span className="inline-flex items-center gap-0.5 text-xs text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3 text-yellow-400">
                    <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
                  </svg>
                  {stars}
                </span>
              )}
            </a>
            <a
              href="https://linkedin.com/in/marco-simone-cannizzaro-582787283"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-accent transition-colors text-sm font-mono"
            >
              LinkedIn
            </a>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6 flex flex-col md:flex-row items-center justify-between gap-2 text-center">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Marco Simone Cannizzaro
          </p>
          <p className="text-xs text-gray-400 font-mono">
            Rilasciato sotto{' '}
            <a
              href="https://www.gnu.org/licenses/gpl-3.0.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              GPL v3
            </a>
            {' — il codice è libero. usalo con saggezza.'}
          </p>
        </div>
      </div>
    </footer>
  );
}
