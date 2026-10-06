import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

function StrokeIcon({ d, ...props }: IconProps & { d: string }) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d} />
    </svg>
  );
}

export const ChevronDownIcon = (props: IconProps) => <StrokeIcon d="M19 9l-7 7-7-7" {...props} />;
export const ChevronLeftIcon = (props: IconProps) => <StrokeIcon d="M15 19l-7-7 7-7" {...props} />;
export const ChevronRightIcon = (props: IconProps) => <StrokeIcon d="M9 5l7 7-7 7" {...props} />;
export const ArrowRightIcon = (props: IconProps) => <StrokeIcon d="M17 8l4 4m0 0l-4 4m4-4H3" {...props} />;
export const DownloadIcon = (props: IconProps) => <StrokeIcon d="M12 4v12m0 0l-4-4m4 4l4-4m-9 9h10" {...props} />;
export const ExternalLinkIcon = (props: IconProps) => (
  <StrokeIcon d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" {...props} />
);
export const CodeIcon = (props: IconProps) => (
  <StrokeIcon d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" {...props} />
);

export const StarIcon = (props: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
  </svg>
);

export const SpinnerIcon = (props: IconProps) => (
  <svg fill="none" viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);
