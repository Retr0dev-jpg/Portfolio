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

      <p className="text-white text-xl md:text-2xl text-center max-w-2xl mx-auto z-10 px-6">
        Sono uno sviluppatore web con una forte passione per il design minimalista e le esperienze digitali essenziali. Credo che la semplicità sia la chiave per un web moderno, accessibile e bello.
      </p>

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
