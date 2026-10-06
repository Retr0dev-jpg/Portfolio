export const SITE = {
  brand: 'Retr0_',
  owner: 'Marco Simone Cannizzaro',
  url: 'https://retr0hub.dev',
  repository: {
    slug: 'Retr0dev-jpg/Portfolio',
    url: 'https://github.com/Retr0dev-jpg/Portfolio',
  },
  license: {
    name: 'GPL v3',
    url: 'https://www.gnu.org/licenses/gpl-3.0.html',
  },
  cv: {
    href: '/CV/CV%20Cannizzaro%20Marco%20Simone.pdf',
    updatedAt: process.env.NEXT_PUBLIC_CV_UPDATED_AT ?? '',
  },
  socials: {
    linkedin: {
      label: 'Marco Simone Cannizzaro',
      url: 'https://linkedin.com/in/marco-simone-cannizzaro-582787283',
    },
    github: {
      label: '@Retr0dev-jpg',
      url: 'https://github.com/Retr0dev-jpg',
    },
  },
} as const;

// NEXT_PUBLIC_* must be read with literal names so Next.js can inline them in the client bundle.
export const FEATURES = {
  showBanner: process.env.NEXT_PUBLIC_SHOW_BANNER === 'true',
  analytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  speedInsights: process.env.NEXT_PUBLIC_ENABLE_SPEED_INSIGHTS === 'true',
} as const;

export const BUILD_INFO = {
  time: process.env.NEXT_PUBLIC_BUILD_TIME ?? '',
  commitMessage: process.env.NEXT_PUBLIC_GIT_COMMIT_MSG ?? '',
  commitSha: process.env.NEXT_PUBLIC_GIT_COMMIT_SHA ?? '',
} as const;

export const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '';
