'use client';
import { useState, useRef } from 'react';
import AnimatedSection from '../ui/AnimatedSection';
import ObfuscatedEmail from '../ui/ObfuscatedEmail';

export default function ContactSection() {
  const formRef = useRef<HTMLFormElement>(null);
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current || formStatus === 'sending') return;

    const formData = new FormData(formRef.current);

    setFormStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('from_name'),
          email: formData.get('from_email'),
          subject: formData.get('subject'),
          message: formData.get('message'),
        }),
      });

      if (!res.ok) throw new Error('Invio fallito');

      setFormStatus('success');
      formRef.current.reset();
      setTimeout(() => setFormStatus('idle'), 5000);
    } catch {
      setFormStatus('error');
      setTimeout(() => setFormStatus('idle'), 5000);
    }
  };

  return (
    <AnimatedSection id="contact" title="Contact" variant="right" showTitle={false}>
      <div className="max-w-7xl mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-start">
          {/* Colonna Sinistra - Info */}
          <div className="relative">
            <div className="hidden lg:block absolute -left-16 top-10 text-5xl opacity-70 animate-bounce z-0" style={{ animationDuration: '3s' }}>
              📧
            </div>
            <div className="hidden lg:block absolute -left-20 top-40 text-4xl opacity-60 animate-bounce z-0" style={{ animationDuration: '4s', animationDelay: '0.5s' }}>
              📱
            </div>
            <div className="hidden lg:block absolute -left-12 bottom-20 text-4xl opacity-50 animate-bounce z-0" style={{ animationDuration: '3.5s', animationDelay: '1s' }}>
              💬
            </div>

            <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 relative z-10">
              Parliamo del tuo<br />
              <span className="text-accent font-mono">prossimo progetto_</span>
            </h2>
            
            <p className="text-base md:text-lg text-gray-600 mb-8 md:mb-10 leading-relaxed relative z-10">
              Sono sempre interessato a nuove opportunità e collaborazioni. Che tu abbia un'idea da realizzare o semplicemente voglia fare una chiacchierata, sarò felice di sentirti.
            </p>

            <div className="space-y-4 relative z-10">
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-md flex-shrink-0">
                  <span className="text-2xl md:text-3xl">📧</span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Email</p>
                  <ObfuscatedEmail
                    className="text-accent font-medium text-base md:text-lg truncate block"
                    subject="Richiesta dal portfolio"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-md flex-shrink-0">
                  <span className="text-2xl md:text-3xl">💼</span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">LinkedIn</p>
                  <a href="https://linkedin.com/in/marco-simone-cannizzaro-582787283" target="_blank" rel="noopener noreferrer" className="text-accent font-medium text-base md:text-lg truncate block">Marco Simone Cannizzaro</a>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-md flex-shrink-0">
                  <span className="text-2xl md:text-3xl">🐙</span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">GitHub</p>
                  <a href="https://github.com/Retr0dev-jpg" target="_blank" rel="noopener noreferrer" className="text-accent font-medium text-base md:text-lg truncate block">@Retr0dev-jpg</a>
                </div>
              </div>
            </div>
          </div>

          {/* Colonna Destra - Form */}
          <div className="relative">
            <div className="hidden lg:block absolute -right-12 top-20 text-5xl opacity-70 animate-bounce z-0" style={{ animationDuration: '3s', animationDelay: '0.3s' }}>
              🚀
            </div>
            <div className="hidden lg:block absolute -right-16 top-60 text-4xl opacity-60 animate-bounce z-0" style={{ animationDuration: '3.5s', animationDelay: '0.8s' }}>
              💡
            </div>
            <div className="hidden lg:block absolute -right-10 bottom-10 text-4xl opacity-50 animate-bounce z-0" style={{ animationDuration: '4s', animationDelay: '1.2s' }}>
              ✨
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-5 md:p-8 border border-gray-100 relative z-10">
              <h3 className="text-xl md:text-2xl font-bold mb-5 md:mb-6 text-gray-900">Invia un messaggio</h3>
              
              <form ref={formRef} onSubmit={handleContactSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">Nome</label>
                    <input 
                      type="text" 
                      id="name"
                      name="from_name"
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent focus:bg-white transition-all" 
                      placeholder="Il tuo nome"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">Email</label>
                    <input 
                      type="email" 
                      id="email"
                      name="from_email"
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent focus:bg-white transition-all" 
                      placeholder="La tua email"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block mb-2 text-sm font-medium text-gray-700">Oggetto</label>
                  <input 
                    type="text" 
                    id="subject"
                    name="subject"
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent focus:bg-white transition-all" 
                    placeholder="Di cosa vuoi parlare?"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-700">Messaggio</label>
                  <textarea 
                    id="message"
                    name="message"
                    required
                    rows={6} 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent focus:bg-white transition-all resize-none" 
                    placeholder="Raccontami la tua idea o il tuo progetto..."
                  ></textarea>
                </div>

                {formStatus === 'success' && (
                  <div className="px-4 py-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm font-medium">
                    Messaggio inviato con successo! Ti risponderò il prima possibile.
                  </div>
                )}
                {formStatus === 'error' && (
                  <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
                    Errore nell&apos;invio. Riprova o contattami direttamente via email.
                  </div>
                )}
                
                <button 
                  type="submit"
                  disabled={formStatus === 'sending'}
                  className="w-full px-6 py-4 bg-accent text-white rounded-lg hover:bg-accent/90 transition-all duration-300 font-semibold text-base shadow-lg hover:shadow-xl hover:scale-[1.02] flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {formStatus === 'sending' ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Invio in corso...
                    </>
                  ) : (
                    <>
                      Invia Messaggio
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
