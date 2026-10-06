import type { Project } from '@/app/data/projects';
import { openInNewTab, scrollToTop } from '@/app/lib/scroll';

export function openProject({ target }: Project) {
  if (target.kind === 'external') openInNewTab(target.url);
  else if (target.kind === 'scroll-top') scrollToTop();
}

export const isComingSoon = (project: Project) => project.target.kind === 'coming-soon';
