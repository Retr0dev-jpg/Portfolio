import HeroShape from '../ui/HeroShape';
import RotatingWords from './hero/RotatingWords';
import InteractiveTagline from './hero/InteractiveTagline';
import { SECTION_ID } from '@/app/data/navigation';

const revealDelay = (ms: number) => ({ animationDelay: `${ms}ms`, animationFillMode: 'forwards' as const });

export default function HeroSection() {
  return (
    <section id={SECTION_ID.home} className="flex items-center bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-xl mx-auto md:mx-0 md:ml-[210px] relative">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
            <span className="text-accent font-mono">
              Retr0<span className="animate-blink">_</span>
            </span>
          </h1>
          <p
            className="text-base md:text-2xl mb-6 opacity-0 animate-slide-up text-gray-700 skills-container"
            style={revealDelay(300)}
          >
            <RotatingWords />
          </p>
          <div className="opacity-0 animate-slide-up" style={revealDelay(600)}>
            <InteractiveTagline />
          </div>
          <div
            className="absolute right-[-600px] top-1/2 -translate-y-1/2 w-[400px] h-[400px] opacity-0 animate-fade-in hidden md:block"
            style={revealDelay(900)}
          >
            <HeroShape className="text-accent" />
          </div>
        </div>
      </div>
    </section>
  );
}
