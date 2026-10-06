import dynamic from 'next/dynamic';
import AnimatedSection from '../ui/AnimatedSection';
import ContactInfo from './contact/ContactInfo';
import { SECTION_ID } from '@/app/data/navigation';

const ContactForm = dynamic(() => import('./contact/ContactForm'));

type FloatingEmoji = { emoji: string; className: string; duration: string; delay?: string };

const LEFT_EMOJIS: FloatingEmoji[] = [
  { emoji: '📧', className: '-left-16 top-10 text-5xl opacity-70', duration: '3s' },
  { emoji: '📱', className: '-left-20 top-40 text-4xl opacity-60', duration: '4s', delay: '0.5s' },
  { emoji: '💬', className: '-left-12 bottom-20 text-4xl opacity-50', duration: '3.5s', delay: '1s' },
];

const RIGHT_EMOJIS: FloatingEmoji[] = [
  { emoji: '🚀', className: '-right-12 top-20 text-5xl opacity-70', duration: '3s', delay: '0.3s' },
  { emoji: '💡', className: '-right-16 top-60 text-4xl opacity-60', duration: '3.5s', delay: '0.8s' },
  { emoji: '✨', className: '-right-10 bottom-10 text-4xl opacity-50', duration: '4s', delay: '1.2s' },
];

function FloatingEmojis({ items }: { items: FloatingEmoji[] }) {
  return items.map(({ emoji, className, duration, delay }) => (
    <div
      key={emoji}
      aria-hidden="true"
      className={`hidden lg:block absolute animate-bounce z-0 ${className}`}
      style={{ animationDuration: duration, animationDelay: delay }}
    >
      {emoji}
    </div>
  ));
}

export default function ContactSection() {
  return (
    <AnimatedSection id={SECTION_ID.contact} variant="right">
      <div className="max-w-7xl mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-start">
          <div className="relative">
            <FloatingEmojis items={LEFT_EMOJIS} />
            <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 relative z-10">
              Parliamo del tuo
              <br />
              <span className="text-accent font-mono">prossimo progetto_</span>
            </h2>
            <p className="text-base md:text-lg text-gray-600 mb-8 md:mb-10 leading-relaxed relative z-10">
              Sono sempre interessato a nuove opportunità e collaborazioni. Che tu abbia un&apos;idea da realizzare o
              semplicemente voglia fare una chiacchierata, sarò felice di sentirti.
            </p>
            <ContactInfo />
          </div>

          <div className="relative">
            <FloatingEmojis items={RIGHT_EMOJIS} />
            <div className="bg-white rounded-2xl shadow-xl p-5 md:p-8 border border-gray-100 relative z-10">
              <h3 className="text-xl md:text-2xl font-bold mb-5 md:mb-6 text-gray-900">Invia un messaggio</h3>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
