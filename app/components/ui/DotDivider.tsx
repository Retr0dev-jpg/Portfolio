const DOTS = [
  { className: 'bg-accent/40', delay: '0s' },
  { className: 'bg-accent/60', delay: '0.2s' },
  { className: 'bg-accent', delay: '0.4s' },
];

export default function DotDivider() {
  return (
    <div className="py-8 md:py-16 bg-white" aria-hidden="true">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-4">
          <div className="h-px bg-gradient-to-r from-transparent via-accent/30 to-accent/50 flex-1 max-w-xs" />
          <div className="flex gap-2">
            {DOTS.map(({ className, delay }) => (
              <div key={delay} className={`w-2 h-2 rounded-full animate-pulse ${className}`} style={{ animationDelay: delay }} />
            ))}
          </div>
          <div className="h-px bg-gradient-to-l from-transparent via-accent/30 to-accent/50 flex-1 max-w-xs" />
        </div>
      </div>
    </div>
  );
}
