export default function AboutSection() {
  return (
    <section id="about" className="bg-accent !min-h-[280px] md:!min-h-[550px] flex items-center justify-center relative overflow-hidden">
      <div className="absolute left-4 md:left-20 top-1/4 text-3xl md:text-7xl rotate-[-15deg] drop-shadow-[0_10px_10px_rgba(0,0,0,0.25)] opacity-30 md:opacity-70 emoji-up-down-1">
        💻
      </div>
      <div className="hidden md:block absolute left-40 bottom-1/4 text-6xl rotate-[10deg] drop-shadow-[0_10px_10px_rgba(0,0,0,0.25)] opacity-60 emoji-up-down-2">
        📱
      </div>
      <div className="hidden md:block absolute left-10 bottom-1/3 text-5xl rotate-[-5deg] drop-shadow-[0_10px_10px_rgba(0,0,0,0.25)] opacity-50 emoji-down-up-1">
        ⚙️
      </div>

      <div className="flex flex-col items-center text-center z-10 px-6 max-w-lg mx-auto gap-5">
        <h2 className="text-white font-mono text-3xl md:text-4xl font-bold tracking-tight leading-snug">
          Marco Simone Cannizzaro
        </h2>
        <div className="w-10 h-px bg-white/25" />
        <div className="flex flex-col gap-3">
          <p className="text-white/70 text-sm md:text-base leading-relaxed">
            Classe 2007. Scrivo codice da quando capire come funzionano le cose era più forte di qualsiasi altra distrazione.
          </p>
          <p className="text-white/70 text-sm md:text-base leading-relaxed">
            Costruisco interfacce HMI per sistemi industriali e prodotti web — minimalisti per design, solidi nell&apos;architettura.
          </p>
        </div>
        <p className="text-white text-sm md:text-base italic font-light">
          Il buon codice non si vede: si sente. E ogni bug trovato in dev vale più di mille scuse in prod.
        </p>
      </div>

      <div className="absolute right-4 md:right-20 top-1/3 text-3xl md:text-7xl rotate-[15deg] drop-shadow-[0_10px_10px_rgba(0,0,0,0.25)] opacity-30 md:opacity-70 emoji-up-down-3">
        🎨
      </div>
      <div className="hidden md:block absolute right-40 top-1/4 text-6xl rotate-[-8deg] drop-shadow-[0_10px_10px_rgba(0,0,0,0.25)] opacity-60 emoji-down-up-2">
        ✨
      </div>
      <div className="absolute right-6 md:right-10 bottom-1/4 text-3xl md:text-5xl rotate-[5deg] drop-shadow-[0_10px_10px_rgba(0,0,0,0.25)] opacity-25 md:opacity-50 emoji-up-down-4">
        🚀
      </div>
    </section>
  );
}
