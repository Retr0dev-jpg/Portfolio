import type { Project } from '@/app/data/projects';

export default function ProjectIcon({ icon, className }: { icon: Project['icon']; className: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
      <path d={icon.d} fillRule={icon.evenOdd ? 'evenodd' : undefined} clipRule={icon.evenOdd ? 'evenodd' : undefined} />
    </svg>
  );
}
