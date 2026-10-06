import type { ReactNode } from 'react';

export default function Tag({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <span className={`px-2 py-1 text-xs ${className}`}>{children}</span>;
}
