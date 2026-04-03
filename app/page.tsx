'use client';
import Header from './components/Header';
import AnimatedSection from './components/AnimatedSection';
import VerticalSliderNav from './components/VerticalSliderNav';
import HeroShape from './components/HeroShape';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useIsMobile } from './hooks/useIsMobile';

const skillsData = {
  skill1: ['Sviluppo web', 'Frontend', 'Backend', 'Full-stack development', 'API REST'],
  skill2: ['design minimalista', 'interfacce intuitive', 'UX/UI design', 'design responsive', 'prototipazione'],
  skill3: ['creatività', 'innovazione', 'problem solving', 'pensiero laterale', 'soluzioni eleganti']
} as const;

type SkillKey = keyof typeof skillsData;
const skillIds = Object.keys(skillsData) as SkillKey[];

const nodeKeys = ['node1', 'node2', 'node3', 'node4', 'nodeCV'] as const;
type NodeId = typeof nodeKeys[number];
type NodePositions = Record<NodeId, { x: number; y: number }>;

function AnimatedHeroShape() {
  const shapes = ['circle', 'triangle'] as const;
  const [index, setIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIndex((prev) => (prev + 1) % shapes.length);
  };

  // Sblocca il click solo dopo la durata dell'animazione
  useEffect(() => {
    if (!isAnimating) return;
    const timeout = setTimeout(() => setIsAnimating(false), 1200); // stessa durata di transition
    return () => clearTimeout(timeout);
  }, [isAnimating]);

  const shape = shapes[index];

  return (
    <div
      className="absolute right-[-600px] top-1/2 transform -translate-y-1/2 w-[400px] h-[400px] opacity-0 animate-fade-in hidden md:block cursor-pointer"
      style={{ animationDelay: '900ms', animationFillMode: 'forwards' }}
      onClick={handleClick}
      aria-disabled={isAnimating}
      tabIndex={0}
      role="button"
    >
      <HeroShape shape={shape} className="w-full h-full text-accent" />
    </div>
  );
}

export default function Home() {
  // ═══ BANNER "IN COSTRUZIONE" ═══ cambia a false per disattivarlo
  const SHOW_BANNER = true;
  const isMobile = useIsMobile();

  const [skillIndices, setSkillIndices] = useState<Record<SkillKey, number>>({
    skill1: 0,
    skill2: 0,
    skill3: 0
  });
  const [pausedSkills, setPausedSkills] = useState<Record<SkillKey, boolean>>({
    skill1: false,
    skill2: false,
    skill3: false
  });

  const [isProjectsVisible, setIsProjectsVisible] = useState(false);

  // State per le posizioni dei nodi della sezione Works (draggable)
  const [nodePositions, setNodePositions] = useState<NodePositions>({
    node1: { x: 15, y: 30 }, // Metapack Engineering
    node2: { x: 45, y: 50 }, // Freelancer
    node3: { x: 85, y: 30 }, // Diploma
    node4: { x: 50, y: 80 },  // PCTO MTECH
    nodeCV: { x: 50, y: 0 }  // Pulsante CV
  });

  const [draggingNode, setDraggingNode] = useState<NodeId | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(null);
  const [hoveredNode, setHoveredNode] = useState<NodeId | null>(null);
  const [pinnedNode, setPinnedNode] = useState<NodeId | null>(null);
  const [dragHasMoved, setDragHasMoved] = useState(false);
  const [devTooltip, setDevTooltip] = useState<{ x: number; y: number } | null>(null);
  const [projectIndex, setProjectIndex] = useState(0);
  const projectsContainerRef = useRef<HTMLDivElement>(null);
  const isProgrammaticScroll = useRef(false);
  const shakeTimeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const activeShakingCardsRef = useRef<string[]>([]);
  const isNodeActive = useCallback(
    (nodeId: NodeId) => {
      if (pinnedNode) return pinnedNode === nodeId;
      return hoveredNode === nodeId;
    },
    [hoveredNode, pinnedNode]
  );

  const totalProjects = 5;
  const visibleProjects = 4;
  const canScrollLeft = projectIndex > 0;
  const canScrollRight = projectIndex < totalProjects - visibleProjects;

  const scrollProjects = useCallback((direction: 'left' | 'right') => {
    setProjectIndex(prev => {
      if (direction === 'left') return Math.max(0, prev - 1);
      return Math.min(totalProjects - visibleProjects, prev + 1);
    });
    isProgrammaticScroll.current = true;
  }, [totalProjects, visibleProjects]);

  useEffect(() => {
    const container = projectsContainerRef.current;
    if (!container) return;

    const cardWidth = 256 + 16; // w-64 (256px) + gap-4 (16px)
    container.scrollTo({
      left: projectIndex * cardWidth,
      behavior: 'smooth'
    });

    const timeout = setTimeout(() => {
      isProgrammaticScroll.current = false;
    }, 350);

    return () => clearTimeout(timeout);
  }, [projectIndex]);

  // Funzione per gestire il drag dei nodi
  const handleNodeDrag = useCallback((nodeId: NodeId, e: MouseEvent) => {
    if (draggingNode !== nodeId) return;
    
    const container = document.getElementById('works-container');
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    const offsetX = dragOffset?.x ?? 0;
    const offsetY = dragOffset?.y ?? 0;
    const mouseX = e.clientX - rect.left - offsetX;
    const mouseY = e.clientY - rect.top - offsetY;
    const x = (mouseX / rect.width) * 100;
    const y = (mouseY / rect.height) * 100;
    
    // Constraint: mantieni i nodi all'interno (con margine del 5%)
    const constrainedX = Math.max(5, Math.min(95, x));
    const constrainedY = Math.max(5, Math.min(95, y));
    
    setNodePositions(prev => ({
      ...prev,
      [nodeId]: { x: constrainedX, y: constrainedY }
    }));
    setDragHasMoved(true);
  }, [draggingNode, dragOffset]);

  const handleNodeMouseDown = (nodeId: NodeId, e: React.MouseEvent<HTMLDivElement>) => {
    const draggableElement = (e.target as HTMLElement)?.closest('[data-node-draggable="true"]');
    if (!draggableElement) return;
    const container = document.getElementById('works-container');
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const currentNode = nodePositions[nodeId];
    const nodeCenterX = (currentNode.x / 100) * rect.width;
    const nodeCenterY = (currentNode.y / 100) * rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    setDragOffset({
      x: mouseX - nodeCenterX,
      y: mouseY - nodeCenterY
    });
    setDraggingNode(nodeId);
    setDragHasMoved(false);
  };

  // Handler per mouse move globale
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (draggingNode) {
        handleNodeDrag(draggingNode, e);
      }
    };
    
    const handleMouseUp = () => {
      if (draggingNode) {
        window.dispatchEvent(new CustomEvent('node-drag-end'));
        if (!dragHasMoved) {
          if (draggingNode === 'nodeCV') {
            window.open('/CV/CV_Marco_Simone_Cannizzaro.pdf', '_blank');
          } else {
            setPinnedNode((prev) => (prev === draggingNode ? null : draggingNode));
          }
        }
      }
      setDraggingNode(null);
      setDragOffset(null);
      setDragHasMoved(false);
    };
    
    if (draggingNode) {
      window.dispatchEvent(new CustomEvent('node-drag-start'));
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingNode, dragHasMoved, handleNodeDrag]);

  // Sistema di protezione anti-estensioni e messaggio console 🕵️
  useEffect(() => {
    // Sopprime l'errore di hydration causato dalle estensioni del browser
    const originalError = console.error;
    console.error = (...args) => {
      if (typeof args[0] === 'string' && args[0].includes('hydrated but some attributes')) {
        return; // Ignora errori di hydration
      }
      originalError.apply(console, args);
    };

    // Sistema automatico di rilevamento attributi delle estensioni
    // Attributi standard HTML5 e React che NON devono essere rimossi
    const validAttributes = new Set([
      // HTML5 standard
      'id', 'class', 'style', 'title', 'lang', 'dir', 'hidden', 'tabindex',
      'role', 'aria-*', 'data-testid', 'data-cy', 'data-test',
      // React/Next.js
      'key', 'ref', 'dangerouslySetInnerHTML', 'suppressHydrationWarning',
      // Next.js/Turbopack development attributes
      'data-nextjs-scroll-focus-boundary', 'data-overlay', 'data-nextjs-dialog-overlay',
      'data-nextjs-container', 'data-nextjs-portal', 'data-turbopack-hmr',
      'data-fast-refresh', 'data-next-error-overlay', 'data-reactroot',
      // Form attributes
      'name', 'value', 'type', 'placeholder', 'required', 'disabled', 'readonly',
      'checked', 'selected', 'multiple', 'autocomplete', 'autofocus',
      // Link/Media attributes
      'href', 'src', 'alt', 'width', 'height', 'loading', 'decoding',
      'crossorigin', 'referrerpolicy', 'sizes', 'srcset',
      // Meta attributes
      'content', 'charset', 'http-equiv', 'property'
    ]);

    // Pattern di estensioni comunemente problematiche (da community GitHub)
    const suspiciousPatterns = [
      /^cz-/i,                    // ColorZilla
      /^data-(gramm|gr-)/i,       // Grammarly
      /^data-lastpass/i,          // LastPass
      /^data-(honey|pinterest|facebook)/i, // Social/Shopping
      /^goog(le)?-?te/i,          // Google Translate
      /^data-(darkreader|adblock)/i, // Utility extensions
      /extension/i,               // Generic extension markers
      /^_[a-z]+ext/i,            // Extension prefixes
      /-extension-/i,             // Extension markers
      /^data-[0-9a-f]{8,}/i      // Random extension IDs
    ];

    // Funzione intelligente per rilevare attributi delle estensioni
    const isExtensionAttribute = (attrName: string): boolean => {
      const name = attrName.toLowerCase();
      
      // È un attributo standard? Mantienilo
      if (validAttributes.has(name)) return false;
      if (name.startsWith('aria-')) return false;
      if (name.startsWith('data-test')) return false;
      
      // PROTEZIONE TURBOPACK/NEXT.JS - NON TOCCARE MAI questi
      if (name.includes('next') || name.includes('turbo') || name.includes('react')) return false;
      if (name.includes('hmr') || name.includes('fast-refresh')) return false;
      if (name.includes('overlay') || name.includes('error')) return false;
      
      // Corrisponde a pattern sospetti?
      if (suspiciousPatterns.some(pattern => pattern.test(name))) return true;
      
      // Attributi data-* con nomi molto lunghi o random (probabili estensioni)
      if (name.startsWith('data-') && name.length > 20) return true;
      
      // Attributi che iniziano con simboli strani
      if (/^[_$-]/.test(name)) return true;
      
      return false;
    };

    // Funzione per pulire gli attributi delle estensioni
    const cleanExtensionAttributes = (element: Element) => {
      const attributes = Array.from(element.attributes);
      attributes.forEach(attr => {
        if (isExtensionAttribute(attr.name)) {
          element.removeAttribute(attr.name);
        }
      });
    };

    // Pulisci tutto il documento inizialmente
    const cleanAllElements = () => {
      const allElements = document.querySelectorAll('*');
      allElements.forEach(cleanExtensionAttributes);
    };

    // MutationObserver per monitorare modifiche al DOM
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        // Pulisci attributi modificati
        if (mutation.type === 'attributes' && mutation.target instanceof Element) {
          cleanExtensionAttributes(mutation.target);
        }
        
        // Pulisci nodi aggiunti
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node instanceof Element) {
              cleanExtensionAttributes(node);
              // Pulisci anche tutti i figli
              const children = node.querySelectorAll('*');
              children.forEach(cleanExtensionAttributes);
            }
          });
        }
      });
    });

    // Avvia il monitoraggio
    observer.observe(document.body, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeOldValue: true
    });

    // Pulizia iniziale
    cleanAllElements();

    // Pulizia periodica (ogni 2 secondi)
    const cleanupInterval = setInterval(cleanAllElements, 2000);
    const styles = [
      'color: #7C3AED',
      'font-size: 16px',
      'font-weight: bold',
      'text-shadow: 2px 2px 0px rgba(124, 58, 237, 0.3)'
    ].join(';');

    const message = `
╔══════════════════════════════════════════════════════════════╗
║                    🕵️ Ciao, Curioso! 👋                     ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  Vedo che ti piace sbirciare sotto il cofano! 🔍             ║
║  Rispetto la tua curiosità da sviluppatore 💻                ║
║                                                              ║
║  Questo portfolio è stato realizzato con:                    ║
║  • Next.js 14 + TypeScript                                   ║
║  • Tailwind CSS per lo styling                               ║
║  • Framer Motion per le animazioni                           ║
║  • Tanto amore per i dettagli ❤️                             ║
║                                                              ║
║  Se vuoi collaborare o hai domande, contattami!              ║
║  📧 Email: info@retr0.dev                                    ║
║                                                              ║
║  P.S. Il cursore personalizzato è la mia parte preferita 😉  ║
╚══════════════════════════════════════════════════════════════╝`;

    console.log('%c' + message, styles);
    
    // Array di pro tip randomici
    const proTips = [
      '💡 Pro tip: Prova a cliccare sulle mie skills sopra!',
      '🎨 E hai notato la scia del mouse sul testo? Magico, vero?',
      '🖱️ Il cursore cambia forma a seconda di dove lo posizioni!',
      '✨ Ogni parola del paragrafo ha la sua animazione hover personalizzata!',
      '🔄 Le skills si alternano in modo ciclico - scoprile tutte!',
      //'📱 Il design è completamente responsive - provalo su mobile!',
      '🎯 Hover sulle emoji della sezione About per vederle ballare!',
      '⚡ Tutte le animazioni sono ottimizzate per le performance!',
      '🎪 Ci sono easter egg nascosti in giro... li trovi tutti?',
      '🌟 Il layout si adatta dinamicamente alle diverse lunghezze del testo!',
      '🎨 Il color scheme è basato sul viola #7C3AED - il mio colore preferito!',
      '🔍 Ogni dettaglio è stato pensato per l\'esperienza utente!'
    ];

    const tips = [
      '🚀 Usa Ctrl+Shift+I per aprire/chiudere velocemente la console!',
      '🎯 Questo sito non usa jQuery - tutto vanilla JS e React!',
      '⚡ Zero librerie pesanti - solo quello che serve!',
      '🎪 Il codice è completamente TypeScript per meno bug!',
      '🌟 Framer Motion gestisce tutte le animazioni fluide!',
      '🔮 La scia del mouse funziona anche sui touch device!'
    ];
    
    // Scegli un pro tip casuale
    const randomProTip = proTips[Math.floor(Math.random() * proTips.length)];
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    
    // Messaggio aggiuntivo più divertente
    setTimeout(() => {
      console.log('%c' + randomProTip, 'color: #7C3AED; font-size: 14px; font-style: italic;');
    }, 1000);

    setTimeout(() => {
      console.log('%c' + randomTip, 'color: #7C3AED; font-size: 14px; font-style: italic;');
    }, 2000);

    // Cleanup: ripristina console.error originale e ferma il monitoraggio
    return () => {
      console.error = originalError;
      observer.disconnect();
      clearInterval(cleanupInterval);
    };
  }, []);

  // Intersection Observer per la sezione Projects
  useEffect(() => {
    const projectsSection = document.getElementById('projects');
    if (!projectsSection) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsProjectsVisible(true);
          }
        });
      },
      { threshold: 0.3 } // Attiva quando il 30% della sezione è visibile
    );

    observer.observe(projectsSection);

    return () => {
      observer.disconnect();
    };
  }, []);

  const rotateWord = useCallback((skillId: SkillKey) => {
    const element = document.getElementById(skillId);
    if (!element) return;

    // Aggiungi classe di animazione
    element.classList.add('flipping');
    
    setTimeout(() => {
      // Cambia il testo a metà animazione
      setSkillIndices(prev => ({
        ...prev,
        [skillId]: (prev[skillId] + 1) % skillsData[skillId].length
      }));
      
      setTimeout(() => {
        // Rimuovi classe di animazione
        element.classList.remove('flipping');
      }, 300);
    }, 300);
  }, []);

  // Funzione per mostrare lo stack tecnologico di un progetto
  const handleShowStack = useCallback((stackIds: string[]) => {
    // Cancella tutti i timeout precedenti
    shakeTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    shakeTimeoutsRef.current = [];

    // Fade out graduale delle card attualmente in animazione
    activeShakingCardsRef.current.forEach(id => {
      const card = document.getElementById(`skill-${id}`);
      if (card) {
        card.classList.add('fading-out');
        card.classList.remove('shaking');
        // Rimuovi fading-out dopo la transizione
        const fadeTimeout = setTimeout(() => {
          card.classList.remove('fading-out');
        }, 500);
        shakeTimeoutsRef.current.push(fadeTimeout);
      }
    });
    activeShakingCardsRef.current = [];

    // Scroll alla sezione skills centrata nella viewport
    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
      const rect = skillsSection.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const sectionTop = rect.top + scrollTop;
      const sectionHeight = rect.height;
      const windowHeight = window.innerHeight;
      const targetScroll = sectionTop - (windowHeight / 2) + (sectionHeight / 2);
      
      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
      });
    }

    // Dopo lo scroll, attiva l'animazione sulle nuove card
    const scrollTimeout = setTimeout(() => {
      stackIds.forEach((id, index) => {
        const card = document.getElementById(`skill-${id}`);
        if (card) {
          // Aggiungi delay progressivo per ogni card
          const startTimeout = setTimeout(() => {
            card.classList.remove('fading-out');
            card.classList.add('shaking');
            activeShakingCardsRef.current.push(id);
            
            // Rimuovi la classe dopo 5 secondi di pulse continuo
            const endTimeout = setTimeout(() => {
              card.classList.remove('shaking');
              activeShakingCardsRef.current = activeShakingCardsRef.current.filter(cardId => cardId !== id);
            }, 5000);
            shakeTimeoutsRef.current.push(endTimeout);
          }, index * 100);
          shakeTimeoutsRef.current.push(startTimeout);
        }
      });
    }, 700);
    shakeTimeoutsRef.current.push(scrollTimeout);
  }, []);

  const toggleSkillPause = useCallback((skillId: SkillKey, isHovered: boolean) => {
    setPausedSkills(prev => ({
      ...prev,
      [skillId]: isHovered
    }));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const available = skillIds.filter((skillId) => !pausedSkills[skillId]);
      if (!available.length) {
        return;
      }

      const randomSkill = available[Math.floor(Math.random() * available.length)];
      rotateWord(randomSkill);
    }, 2000);

    return () => clearInterval(interval);
  }, [pausedSkills, rotateWord]);

  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

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

  useEffect(() => {
    if (!SHOW_BANNER) return;
    const targetDate = new Date('2026-04-06T21:30:00').getTime();

    const updateCountdown = () => {
      const now = Date.now();
      const diff = Math.max(0, targetDate - now);
      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [SHOW_BANNER]);

  return (
    <>
      {SHOW_BANNER && (
        <div className="fixed top-0 left-0 w-full z-[60] bg-accent text-white text-center py-2 px-3 md:px-4 text-xs md:text-sm font-mono tracking-wide shadow-md flex items-center justify-center gap-2 md:gap-3 flex-wrap">
          <span className="inline-flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-white animate-pulse" />
            Portfolio in creazione...
          </span>
          <span className="hidden sm:inline text-white/60">|</span>
          <span>
            Prossimo aggiornamento:
            <span className="ml-2 font-bold tabular-nums">
              {String(countdown.days).padStart(2, '0')}g{' '}
              {String(countdown.hours).padStart(2, '0')}h{' '}
              {String(countdown.minutes).padStart(2, '0')}m{' '}
              {String(countdown.seconds).padStart(2, '0')}s
            </span>
          </span>
        </div>
      )}
      <main className={`min-h-screen overflow-x-hidden ${SHOW_BANNER ? 'pt-[36px]' : ''}`}>
        <Header bannerVisible={SHOW_BANNER} />
      <VerticalSliderNav />
      
      {/* Hero Section */}
      <section id="home" className="h-screen flex items-center bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto md:mx-0 md:ml-[210px] relative">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
              <span className="text-accent font-mono">
                Retr0<span className="animate-blink">_</span>
              </span>
            </h1>
            <p className="text-lg md:text-2xl mb-6 opacity-0 animate-slide-up text-gray-700 skills-container" style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>
              <span 
                className="clickable-word"
                onClick={() => rotateWord('skill1')}
                onMouseEnter={() => toggleSkillPause('skill1', true)}
                onMouseLeave={() => toggleSkillPause('skill1', false)}
              >
                <span id="skill1" className="word-flip">{skillsData.skill1[skillIndices.skill1]}</span>
              </span>, <span 
                className="clickable-word"
                onClick={() => rotateWord('skill2')}
                onMouseEnter={() => toggleSkillPause('skill2', true)}
                onMouseLeave={() => toggleSkillPause('skill2', false)}
              >
                <span id="skill2" className="word-flip">{skillsData.skill2[skillIndices.skill2]}</span>
              </span>, <span 
                className="clickable-word"
                onClick={() => rotateWord('skill3')}
                onMouseEnter={() => toggleSkillPause('skill3', true)}
                onMouseLeave={() => toggleSkillPause('skill3', false)}
              >
                <span id="skill3" className="word-flip">{skillsData.skill3[skillIndices.skill3]}</span>
              </span>
            </p>
            <div className="opacity-0 animate-slide-up" style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}>
              <p 
                className="text-lg text-gray-600 interactive-text"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  
                  const spans = e.currentTarget.querySelectorAll('.hover-word');
                  spans.forEach((span) => {
                    const spanRect = span.getBoundingClientRect();
                    const spanX = spanRect.left - rect.left + spanRect.width / 2;
                    const spanY = spanRect.top - rect.top + spanRect.height / 2;
                    
                    const distance = Math.sqrt(Math.pow(x - spanX, 2) + Math.pow(y - spanY, 2));
                    
                    if (distance < 25) {
                      span.classList.add('word-active');
                      setTimeout(() => span.classList.remove('word-active'), 50);
                    }
                  });
                }}
              >
                <span className="hover-word">Benvenuto</span> <span className="hover-word">nel</span> <span className="hover-word">mio</span> <span className="hover-word">portfolio.</span> <span className="hover-word">Sono</span> <span className="hover-word">un</span> <span className="hover-word">appassionato</span> <span className="hover-word">sviluppatore</span> <span className="hover-word">web</span> <span className="hover-word">specializzato</span> <span className="hover-word">nella</span> <span className="hover-word">creazione</span> <span className="hover-word">di</span> <span className="hover-word">esperienze</span> <span className="hover-word">digitali</span> <span className="hover-word">minimaliste</span> <span className="hover-word">e</span> <span className="hover-word">funzionali.</span> <span className="hover-word">Il</span> <span className="hover-word">mio</span> <span className="hover-word">approccio</span> <span className="hover-word">si</span> <span className="hover-word">basa</span> <span className="hover-word">sulla</span> <span className="hover-word">semplicità</span> <span className="hover-word">e</span> <span className="hover-word">sull'essenzialità,</span> <span className="hover-word">concentrandomi</span> <span className="hover-word">sui</span> <span className="hover-word">contenuti</span> <span className="hover-word">e</span> <span className="hover-word">sull'esperienza</span> <span className="hover-word">utente.</span>
              </p>
            </div>
            {/* Cerchio/triangolo animato */}
            <AnimatedHeroShape />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-accent !min-h-[400px] md:!min-h-[550px] flex items-center justify-center relative overflow-hidden">
        {/* Emoji lato sinistro */}
        <div className="hidden md:block absolute left-20 top-1/4 text-7xl rotate-[-15deg] drop-shadow-[0_10px_10px_rgba(0,0,0,0.25)] opacity-70 emoji-up-down-1">
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

        {/* Emoji lato destro */}
        <div className="hidden md:block absolute right-20 top-1/3 text-7xl rotate-[15deg] drop-shadow-[0_10px_10px_rgba(0,0,0,0.25)] opacity-70 emoji-up-down-3">
          🎨
        </div>
        <div className="hidden md:block absolute right-40 top-1/4 text-6xl rotate-[-8deg] drop-shadow-[0_10px_10px_rgba(0,0,0,0.25)] opacity-60 emoji-down-up-2">
          ✨
        </div>
        <div className="hidden md:block absolute right-10 bottom-1/4 text-5xl rotate-[5deg] drop-shadow-[0_10px_10px_rgba(0,0,0,0.25)] opacity-50 emoji-up-down-4">
          🚀
        </div>
      </section>

      {/* Works Section */}
      <AnimatedSection id="works" title="Works" variant="right" showTitle={false}>
        {isMobile ? (
          /* ═══ MOBILE: Timeline verticale ═══ */
          <div className="w-full max-w-lg mx-auto px-2">
            {/* CV Download */}
            <div className="flex justify-center mb-10">
              <a
                href="/CV/CV_Marco_Simone_Cannizzaro.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-2xl shadow-lg border border-gray-200 text-accent font-semibold text-sm hover:shadow-xl transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v12m0 0l-4-4m4 4l4-4m-9 9h10" />
                </svg>
                Scarica CV
                <span className="text-xs text-gray-500 font-normal">PDF</span>
              </a>
            </div>

            {/* Timeline */}
            <div className="relative pl-8 border-l-2 border-accent/30 space-y-10">
              {/* Nodo 1 - Metapack */}
              <div className="relative">
                <div className="absolute -left-[25px] top-1 w-4 h-4 rounded-full bg-accent border-4 border-white shadow-md" />
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-5 py-3">
                    <h3 className="text-base font-bold text-white">Metapack Engineering Srl</h3>
                    <p className="text-xs text-purple-100">Ottobre 2025 - Presente</p>
                  </div>
                  <div className="p-5">
                    <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-2">Software Specialist</p>
                    <p className="text-sm text-gray-700 leading-relaxed mb-3">
                      Sviluppo di applicazioni HMI in ambiente .NET (C#/VB.NET) per il monitoraggio e il controllo di processi industriali.
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded font-medium">Automazione</span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded font-medium">Serializzazione</span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded font-medium">VB.NET</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Nodo 2 - Freelancer */}
              <div className="relative">
                <div className="absolute -left-[25px] top-1 w-4 h-4 rounded-full bg-blue-500 border-4 border-white shadow-md" />
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-5 py-3">
                    <h3 className="text-base font-bold text-white">Freelancer</h3>
                    <p className="text-xs text-blue-100">Giugno 2025 - Ottobre 2025</p>
                  </div>
                  <div className="p-5">
                    <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-2">Freelance Developer</p>
                    <p className="text-sm text-gray-700 leading-relaxed mb-3">
                      Progettazione e realizzazione di prodotti digitali su misura: dal discovery al deploy, con focus su scalabilità, manutenibilità e valore per il business.
                    </p>
                    <div className="mb-3">
                      <p className="text-xs font-semibold text-gray-600 mb-1.5">Progetti realizzati:</p>
                      <div className="space-y-0.5 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <span className="text-gray-400">•</span>
                          <a href="https://new.molisebasket.net" target="_blank" rel="noopener noreferrer" className="text-blue-600">new.molisebasket.net</a>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-gray-400">•</span>
                          <a href="https://www.passoetiro.com" target="_blank" rel="noopener noreferrer" className="text-blue-600">www.passoetiro.com</a>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-gray-400">•</span>
                          <a href="https://retr0hub.dev" target="_blank" rel="noopener noreferrer" className="text-blue-600">retr0hub.dev</a>
                          <span className="text-gray-500 text-xs">(In sviluppo)</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-gray-400">•</span>
                          <a href="https://lab.retr0hub.dev" target="_blank" rel="noopener noreferrer" className="text-blue-600">lab.retr0hub.dev</a>
                          <span className="text-gray-500 text-xs">(Prossimamente)</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded font-medium">React</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded font-medium">Next.js</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded font-medium">Web Design</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Nodo 3 - Diploma */}
              <div className="relative">
                <div className="absolute -left-[25px] top-1 w-4 h-4 rounded-full bg-orange-500 border-4 border-white shadow-md" />
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-3">
                    <h3 className="text-base font-bold text-white">Diploma</h3>
                    <p className="text-xs text-orange-100">2020 - 2025 | IIS Galilei Sani, Latina</p>
                  </div>
                  <div className="p-5">
                    <p className="text-sm text-gray-700 leading-relaxed mb-3">
                      Indirizzo Informatica e Telecomunicazioni (sviluppo base di software, siti web, reti e sistemi informatici).
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded font-medium">Sviluppo Software</span>
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded font-medium">Siti Web</span>
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded font-medium">Reti</span>
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded font-medium">Sistemi IT</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Nodo 4 - PCTO MTECH */}
              <div className="relative">
                <div className="absolute -left-[25px] top-1 w-4 h-4 rounded-full bg-green-500 border-4 border-white shadow-md" />
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 px-5 py-3">
                    <h3 className="text-base font-bold text-white">Apprendista Tecnico di Laboratorio</h3>
                    <p className="text-xs text-green-100">Giugno 2024 - Agosto 2024 | MTECH SOLUTIONS Srl</p>
                  </div>
                  <div className="p-5">
                    <p className="text-sm text-gray-700 leading-relaxed mb-3">
                      Setup tecnico di workstation e periferiche, diagnostica sistemistica e supporto utente in ambito IT.
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded font-medium">Configurazione HW</span>
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded font-medium">Analisi Guasti</span>
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded font-medium">Manutenzione</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ═══ DESKTOP: Layout nodi draggabili originale ═══ */
        <div id="works-container" className="relative w-full max-w-7xl mx-auto pt-24 pb-16" style={{ minHeight: '620px' }}>
          {/* SVG per le connessioni professionali */}
          <svg className="absolute inset-0 w-full h-full z-0" style={{ pointerEvents: 'none' }}>
            <defs>
              <linearGradient id="professionalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#7C3AED', stopOpacity: 0.6 }} />
                <stop offset="100%" style={{ stopColor: '#7C3AED', stopOpacity: 0.3 }} />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* MESH COMPLETO - Tutti i nodi interconnessi */}
            
            {/* Connessioni primarie (cronologiche) - più spesse */}
            {/* Formazione → Web Developer */}
            <line 
              x1={`${nodePositions.node4.x}%`}
              y1={`${nodePositions.node4.y}%`}
              x2={`${nodePositions.node3.x}%`}
              y2={`${nodePositions.node3.y}%`}
              stroke="#7C3AED"
              strokeWidth="3"
              opacity="0.6"
              filter="url(#glow)"
            />
            
            {/* Web Developer → UI/UX Designer */}
            <line 
              x1={`${nodePositions.node3.x}%`}
              y1={`${nodePositions.node3.y}%`}
              x2={`${nodePositions.node2.x}%`}
              y2={`${nodePositions.node2.y}%`}
              stroke="#7C3AED"
              strokeWidth="3"
              opacity="0.6"
              filter="url(#glow)"
            />
            
            {/* UI/UX Designer → Senior Frontend */}
            <line 
              x1={`${nodePositions.node2.x}%`}
              y1={`${nodePositions.node2.y}%`}
              x2={`${nodePositions.node1.x}%`}
              y2={`${nodePositions.node1.y}%`}
              stroke="#7C3AED"
              strokeWidth="3"
              opacity="0.6"
              filter="url(#glow)"
            />
            
            {/* Connessioni secondarie (competenze condivise) - mesh completo */}
            {/* Formazione → UI/UX */}
            <line 
              x1={`${nodePositions.node4.x}%`}
              y1={`${nodePositions.node4.y}%`}
              x2={`${nodePositions.node2.x}%`}
              y2={`${nodePositions.node2.y}%`}
              stroke="#9d4edd"
              strokeWidth="1.5"
              opacity="0.35"
              strokeDasharray="6,4"
            >
              <animate attributeName="stroke-dashoffset" from="10" to="0" dur="3s" repeatCount="indefinite" />
            </line>
            
            {/* Formazione → Senior Frontend */}
            <line 
              x1={`${nodePositions.node4.x}%`}
              y1={`${nodePositions.node4.y}%`}
              x2={`${nodePositions.node1.x}%`}
              y2={`${nodePositions.node1.y}%`}
              stroke="#9d4edd"
              strokeWidth="1.5"
              opacity="0.3"
              strokeDasharray="6,4"
            >
              <animate attributeName="stroke-dashoffset" from="10" to="0" dur="3.5s" repeatCount="indefinite" />
            </line>
            
            {/* Web Developer → Senior Frontend */}
            <line 
              x1={`${nodePositions.node3.x}%`}
              y1={`${nodePositions.node3.y}%`}
              x2={`${nodePositions.node1.x}%`}
              y2={`${nodePositions.node1.y}%`}
              stroke="#9d4edd"
              strokeWidth="1.5"
              opacity="0.35"
              strokeDasharray="6,4"
            >
              <animate attributeName="stroke-dashoffset" from="10" to="0" dur="4s" repeatCount="indefinite" />
            </line>
            
            {/* Linee sottili aggiuntive per completare la mesh */}
            <line 
              x1={`${nodePositions.node1.x}%`}
              y1={`${nodePositions.node1.y}%`}
              x2={`${nodePositions.node3.x}%`}
              y2={`${nodePositions.node3.y}%`}
              stroke="#c4b5fd"
              strokeWidth="1"
              opacity="0.25"
              strokeDasharray="4,6"
            >
              <animate attributeName="stroke-dashoffset" from="10" to="0" dur="5s" repeatCount="indefinite" />
            </line>
            
            <line 
              x1={`${nodePositions.node2.x}%`}
              y1={`${nodePositions.node2.y}%`}
              x2={`${nodePositions.node4.x}%`}
              y2={`${nodePositions.node4.y}%`}
              stroke="#c4b5fd"
              strokeWidth="1"
              opacity="0.25"
              strokeDasharray="4,6"
            >
              <animate attributeName="stroke-dashoffset" from="10" to="0" dur="4.5s" repeatCount="indefinite" />
            </line>
            
            {/* Punti di intersezione pulsanti calcolati dinamicamente */}
            <circle 
              cx={`${(nodePositions.node1.x + nodePositions.node2.x) / 2}%`}
              cy={`${(nodePositions.node1.y + nodePositions.node2.y) / 2}%`}
              r="4" 
              fill="#7C3AED" 
              opacity="0.6"
            >
              <animate attributeName="r" values="4;7;4" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
            </circle>
            
            <circle 
              cx={`${(nodePositions.node2.x + nodePositions.node3.x) / 2}%`}
              cy={`${(nodePositions.node2.y + nodePositions.node3.y) / 2}%`}
              r="4" 
              fill="#7C3AED" 
              opacity="0.6"
            >
              <animate attributeName="r" values="4;7;4" dur="2s" repeatCount="indefinite" begin="0.7s" />
              <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" begin="0.7s" />
            </circle>
            
            <circle 
              cx={`${(nodePositions.node3.x + nodePositions.node4.x) / 2}%`}
              cy={`${(nodePositions.node3.y + nodePositions.node4.y) / 2}%`}
              r="4" 
              fill="#7C3AED" 
              opacity="0.6"
            >
              <animate attributeName="r" values="4;7;4" dur="2s" repeatCount="indefinite" begin="1.4s" />
              <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" begin="1.4s" />
            </circle>
          </svg>

          {/* Nodo 1 - Metapack Engineering */}
          <div 
            className={`absolute group select-none ${isNodeActive('node1') ? 'z-30' : 'z-10'}`}
            style={{ left: `${nodePositions.node1.x}%`, top: `${nodePositions.node1.y}%`, transform: 'translate(-50%, -50%)' }}
            onMouseDown={(e) => handleNodeMouseDown('node1', e)}
            onMouseEnter={() => {
              if (pinnedNode && pinnedNode !== 'node1') return;
              setHoveredNode('node1');
            }}
            onMouseLeave={() => setHoveredNode((prev) => (prev === 'node1' ? null : prev))}
          >
            <div className="relative" style={{ cursor: 'none' }}>
              {/* Anello esterno sottile */}
              <div className="absolute inset-0 w-40 h-40 rounded-full border border-accent/20 animate-pulse" style={{ animationDuration: '4s' }}></div>
              
              {/* Nodo principale professionale */}
              <div className="relative w-40 h-40 bg-white rounded-full flex items-center justify-center shadow-lg border border-gray-200 group-hover:border-accent group-hover:shadow-2xl transition-all duration-500" data-node-draggable="true">
                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-purple-50 to-white"></div>
                <div className="relative text-center z-10 px-4">
                  <div className="text-xs font-semibold text-accent uppercase tracking-wider mb-1">Ott 2025 - Presente</div>
                  <div className="text-sm font-bold text-gray-800 leading-tight">Software Specialist</div>
                </div>
              </div>
              
              {/* Info card professionale */}
              <div
                className={`absolute top-full left-1/2 -translate-x-1/2 mt-6 w-80 bg-white rounded-lg shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden z-20 ${isNodeActive('node1') ? 'opacity-100' : 'opacity-0'}`}
                style={{ pointerEvents: isNodeActive('node1') ? 'auto' : 'none' }}
              >
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-3">
                  <h3 className="text-lg font-bold text-white">Metapack Engineering Srl</h3>
                  <p className="text-xs text-purple-100">Ottobre 2025 - Presente</p>
                </div>
                <div className="p-6">
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">
                  Sviluppo di applicazioni HMI in ambiente .NET (C#/VB.NET) per il monitoraggio e il controllo di processi industriali.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded font-medium">Automazione</span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded font-medium">Serializzazione</span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded font-medium">VB.NET</span>
              </div>
            </div>
              </div>
            </div>
          </div>

          {/* Nodo 2 - Freelancer */}
          <div 
            className={`absolute group select-none ${isNodeActive('node2') ? 'z-30' : 'z-10'}`}
            style={{ left: `${nodePositions.node2.x}%`, top: `${nodePositions.node2.y}%`, transform: 'translate(-50%, -50%)' }}
            onMouseDown={(e) => handleNodeMouseDown('node2', e)}
            onMouseEnter={() => {
              if (pinnedNode && pinnedNode !== 'node2') return;
              setHoveredNode('node2');
            }}
            onMouseLeave={() => setHoveredNode((prev) => (prev === 'node2' ? null : prev))}
          >
            <div className="relative" style={{ cursor: 'none' }}>
              <div className="absolute inset-0 w-36 h-36 rounded-full border border-accent/20 animate-pulse" style={{ animationDuration: '4.5s', animationDelay: '0.5s' }}></div>
              
              <div className="relative w-36 h-36 bg-white rounded-full flex items-center justify-center shadow-lg border border-gray-200 group-hover:border-accent group-hover:shadow-2xl transition-all duration-500" data-node-draggable="true">
                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-blue-50 to-white"></div>
                <div className="relative text-center z-10 px-4">
                  <div className="text-xs font-semibold text-accent uppercase tracking-wider mb-1">Giu - Ott 2025</div>
                  <div className="text-sm font-bold text-gray-800 leading-tight">Freelance</div>
                  <div className="text-sm font-bold text-gray-800 leading-tight">Developer</div>
                </div>
              </div>
              
              <div
                className={`absolute top-full left-1/2 -translate-x-1/2 mt-6 w-96 bg-white rounded-lg shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden z-20 ${isNodeActive('node2') ? 'opacity-100' : 'opacity-0'}`}
                style={{ pointerEvents: isNodeActive('node2') ? 'auto' : 'none' }}
              >
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3">
                  <h3 className="text-lg font-bold text-white">Freelancer</h3>
                  <p className="text-xs text-blue-100">Giugno 2025 - Ottobre 2025</p>
                </div>
                <div className="p-6">
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">
                  Progettazione e realizzazione di prodotti digitali su misura: dal discovery al deploy, con focus su scalabilità, manutenibilità e valore per il business.
                  </p>
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-gray-600 mb-2">Progetti realizzati:</p>
                    <div className="space-y-1 text-xs text-gray-600 flex flex-col items-start">
                      <div className="flex items-center gap-1 w-fit text-sm">
                        <span className="text-gray-400">•</span>
                        <a
                          href="https://new.molisebasket.net"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          new.molisebasket.net
                        </a>
                      </div>
                      <div className="flex items-center gap-1 w-fit text-sm">
                        <span className="text-gray-400">•</span>
                        <a
                          href="https://www.passoetiro.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          www.passoetiro.com
                        </a>
                      </div>
                      <div className="flex items-center gap-1 w-fit text-sm">
                        <span className="text-gray-400">•</span>
                        <a
                          href="https://retr0hub.dev"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          retr0hub.dev
                        </a>
                        <span className="text-gray-500">(In sviluppo)</span>
                      </div>
                      <div className="flex items-center gap-1 w-fit text-sm">
                        <span className="text-gray-400">•</span>
                        <a
                          href="https://lab.retr0hub.dev"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          lab.retr0hub.dev
                        </a>
                        <span className="text-gray-500">(Prossimamente)</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded font-medium">React</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded font-medium">Next.js</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded font-medium">Web Design</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Nodo 3 - Diploma */}
          <div 
            className={`absolute group select-none ${isNodeActive('node3') ? 'z-30' : 'z-10'}`}
            style={{ left: `${nodePositions.node3.x}%`, top: `${nodePositions.node3.y}%`, transform: 'translate(-50%, -50%)' }}
            onMouseDown={(e) => handleNodeMouseDown('node3', e)}
            onMouseEnter={() => {
              if (pinnedNode && pinnedNode !== 'node3') return;
              setHoveredNode('node3');
            }}
            onMouseLeave={() => setHoveredNode((prev) => (prev === 'node3' ? null : prev))}
          >
            <div className="relative" style={{ cursor: 'none' }}>
              <div className="absolute inset-0 w-32 h-32 rounded-full border border-accent/20 animate-pulse" style={{ animationDuration: '3.5s', animationDelay: '0.3s' }}></div>
              
              <div className="relative w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg border border-gray-200 group-hover:border-accent group-hover:shadow-2xl transition-all duration-500" data-node-draggable="true">
                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-orange-50 to-white"></div>
                <div className="relative text-center z-10 px-4">
                  <div className="text-xs font-semibold text-accent uppercase tracking-wider mb-1">2020 - 2025</div>
                  <div className="text-sm font-bold text-gray-800 leading-tight">Diploma</div>
                </div>
              </div>
              
              <div
                className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-6 w-80 bg-white rounded-lg shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden z-20 ${isNodeActive('node3') ? 'opacity-100' : 'opacity-0'}`}
                style={{ pointerEvents: isNodeActive('node3') ? 'auto' : 'none' }}
              >
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3">
                  <h3 className="text-lg font-bold text-white">Diploma</h3>
                  <p className="text-xs text-orange-100">2020 - 2025 | IIS Galilei Sani, Latina</p>
                </div>
                <div className="p-6">
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">
                  Indirizzo Informatica e Telecomunicazioni (sviluppo base di software, siti web, reti e sistemi informatici).
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded font-medium">Sviluppo Software</span>
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded font-medium">Siti Web</span>
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded font-medium">Reti</span>
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded font-medium">Sistemi IT</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Nodo 4 - PCTO MTECH */}
          <div 
            className={`absolute group select-none ${isNodeActive('node4') ? 'z-30' : 'z-10'}`}
            style={{ left: `${nodePositions.node4.x}%`, top: `${nodePositions.node4.y}%`, transform: 'translate(-50%, -50%)' }}
            onMouseDown={(e) => handleNodeMouseDown('node4', e)}
            onMouseEnter={() => {
              if (pinnedNode && pinnedNode !== 'node4') return;
              setHoveredNode('node4');
            }}
            onMouseLeave={() => setHoveredNode((prev) => (prev === 'node4' ? null : prev))}
          >
            <div className="relative" style={{ cursor: 'none' }}>
              <div className="absolute inset-0 w-36 h-36 rounded-full border border-accent/20 animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }}></div>
              
              <div className="relative w-36 h-36 bg-white rounded-full flex items-center justify-center shadow-lg border border-gray-200 group-hover:border-accent group-hover:shadow-2xl transition-all durataion-500" data-node-draggable="true">
                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-green-50 to-white"></div>
                <div className="relative text-center z-10 px-4">
                  <div className="text-xs font-semibold text-accent uppercase tracking-wider mb-1">Giu - Ago 2024</div>
                  <div className="text-sm font-bold text-gray-800 leading-tight">Tecnico Lab</div>
                  <div className="text-sm font-bold text-gray-800 leading-tight">PCTO</div>
                </div>
              </div>
              
              <div
                className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-6 w-80 bg-white rounded-lg shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden z-20 ${isNodeActive('node4') ? 'opacity-100' : 'opacity-0'}`}
                style={{ pointerEvents: isNodeActive('node4') ? 'auto' : 'none' }}
              >
                <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-3">
                  <h3 className="text-lg font-bold text-white">Apprendista Tecnico di Laboratorio</h3>
                  <p className="text-xs text-green-100">Giugno 2024 - Agosto 2024 | MTECH SOLUTIONS Srl</p>
                </div>
                <div className="p-6">
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">
                  Setup tecnico di workstation e periferiche, diagnostica sistemistica e supporto utente in ambito IT.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded font-medium">Configurazione HW</span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded font-medium">Analisi Guasti</span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded font-medium">Manutenzione</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Nodo CV - Curriculum */}
          <div
            className="absolute group z-30 select-none"
            style={{ left: `${nodePositions.nodeCV.x}%`, top: `${nodePositions.nodeCV.y}%`, transform: 'translate(-50%, -50%)' }}
            onMouseDown={(e) => handleNodeMouseDown('nodeCV', e)}
          >
            <div className="relative" style={{ cursor: 'none' }}>
              <div className="absolute inset-0 w-48 h-20 rounded-2xl border border-accent/20 bg-white/40 blur-lg"></div>
              <div
                className="relative w-48 h-20 bg-white rounded-2xl flex flex-col items-center justify-center shadow-lg border border-gray-200 gap-1 px-4"
                data-node-draggable="true"
              >
                <div className="flex items-center gap-2 text-accent font-semibold text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v12m0 0l-4-4m4 4l4-4m-9 9h10" />
                  </svg>
                  Scarica CV
                </div>
                <p className="text-xs text-gray-500 text-center">05/09/2025 · PDF</p>
              </div>
            </div>
          </div>
        </div>
        )}
      </AnimatedSection>

      {/* Skills Section */}
      <AnimatedSection id="skills" title="" variant="up" showTitle={false} className="bg-accent !min-h-[550px] flex items-center justify-center !w-full !max-w-none">
        <div className="max-w-6xl mx-auto">
          {/* All Skills in unified grid */}
          <div className="skills-grid">
            {/* Frontend Card */}
            <div id="skill-frontend" className="skill-card">
              <div className="skill-card-content">
                <div className="relative w-20 h-20 mt-auto">
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt="React" className="absolute top-1 left-1 w-7 h-7 transition-all duration-300 icon-top-left" draggable="false" />
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angular/angular-original.svg" alt="Angular" className="absolute top-1 right-1 w-7 h-7 transition-all duration-300 icon-top-right" draggable="false" />
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" alt="JavaScript" className="absolute bottom-1 left-1 w-7 h-7 transition-all duration-300 icon-bottom-left" draggable="false" />
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" alt="TypeScript" className="absolute bottom-1 right-1 w-7 h-7 transition-all duration-300 icon-bottom-right" draggable="false" />
                </div>
                <span className="skill-name">Frontend</span>
              </div>
            </div>
            
            {/* Backend Card */}
            <div id="skill-backend" className="skill-card">
              <div className="skill-card-content">
                <div className="relative w-20 h-20 mt-auto">
                  <img 
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" 
                    alt="Node.js" 
                    className="absolute top-1 left-1 w-8 h-8 transition-all duration-300 icon-top-left"
                    draggable="false"
                  />
                  <img 
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg" 
                    alt="Go" 
                    className="absolute top-1 right-1 w-8 h-8 transition-all duration-300 icon-top-right"
                    draggable="false"
                  />
                  <img 
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/django/django-plain.svg" 
                    alt="Django" 
                    className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-8 transition-all duration-300 z-10 icon-bottom-center"
                    draggable="false"
                  />
                </div>
                <span className="skill-name">Backend</span>
              </div>
            </div>
            
            {/* Hosting Card */}
            <div id="skill-hosting" className="skill-card">
              <div className="skill-card-content">
                <div className="relative w-20 h-20 mt-auto">
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-original.svg" alt="WordPress" className="absolute top-1 left-1 w-7 h-7 transition-all duration-300 icon-top-left" draggable="false" />
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nginx/nginx-original.svg" alt="Nginx" className="absolute top-1 right-1 w-7 h-7 transition-all duration-300 icon-top-right" draggable="false" />
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apache/apache-original.svg" alt="Apache" className="absolute bottom-1 left-1 w-7 h-7 transition-all duration-300 icon-bottom-left" draggable="false" />
                  <img src="/hostinger-icon.svg" alt="Hostinger" className="absolute bottom-1 right-1 w-7 h-7 transition-all duration-300 icon-bottom-right" draggable="false" />
                </div>
                <span className="skill-name">Hosting</span>
              </div>
            </div>
            
            {/* C Family Card */}
            <div id="skill-cfamily" className="skill-card">
              <div className="skill-card-content">
                <div className="relative w-20 h-20 mt-auto">
                  {/* C - alto a sinistra (1) */}
                  <img 
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg" 
                    alt="C" 
                    className="absolute top-1 left-1 w-8 h-8 transition-all duration-300 icon-top-left"
                    draggable="false"
                  />
                  {/* C++ - alto a destra (2) */}
                  <img 
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" 
                    alt="C++" 
                    className="absolute top-1 right-1 w-8 h-8 transition-all duration-300 icon-top-right"
                    draggable="false"
                  />
                  {/* C# - basso centro (3) */}
                  <img 
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg" 
                    alt="C#" 
                    className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-8 transition-all duration-300 z-10 icon-bottom-center"
                    draggable="false"
                  />
                </div>
                <span className="skill-name">C Family</span>
              </div>
            </div>
            
            {/* Back-end Technologies */}
            <div id="skill-php" className="skill-card">
              <div className="skill-card-content">
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg" alt="PHP" className="skill-icon" />
                <span className="skill-name">PHP</span>
              </div>
            </div>
            
            <div id="skill-java" className="skill-card">
              <div className="skill-card-content">
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" alt="Java" className="skill-icon" />
                <span className="skill-name">Java</span>
              </div>
            </div>
            
            <div id="skill-databases" className="skill-card">
              <div className="skill-card-content">
                <div className="relative w-20 h-20 mt-auto">
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" alt="MySQL" className="absolute top-1 left-1 w-9 h-9 transition-all duration-300 icon-top-left" draggable="false" />
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" alt="PostgreSQL" className="absolute bottom-1 right-1 w-9 h-9 transition-all duration-300 icon-bottom-right" draggable="false" />
                </div>
                <span className="skill-name">Databases</span>
              </div>
            </div>
            
            <div id="skill-python" className="skill-card">
              <div className="skill-card-content">
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" alt="Python" className="skill-icon" />
                <span className="skill-name">Python</span>
              </div>
            </div>
            
            {/* Tools & Others */}
            <div id="skill-git" className="skill-card">
              <div className="skill-card-content">
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" alt="Git" className="skill-icon" />
                <span className="skill-name">Git</span>
              </div>
            </div>
            
            <div id="skill-cloud" className="skill-card">
              <div className="skill-card-content">
                <div className="relative w-20 h-20 mt-auto">
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" alt="AWS" className="absolute top-1 left-1 w-9 h-9 transition-all duration-300 icon-top-left" draggable="false" />
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg" alt="Azure" className="absolute bottom-1 right-1 w-9 h-9 transition-all duration-300 icon-bottom-right" draggable="false" />
                </div>
                <span className="skill-name">Cloud</span>
              </div>
            </div>
            
            <div id="skill-vscode" className="skill-card">
              <div className="skill-card-content">
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" alt="VS Code" className="skill-icon" />
                <span className="skill-name">VS Code</span>
              </div>
            </div>
            
            <div id="skill-containers" className="skill-card">
              <div className="skill-card-content">
                <div className="relative w-20 h-20 mt-auto">
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" alt="Docker" className="absolute top-1 left-1 w-9 h-9 transition-all duration-300 icon-top-left" draggable="false" />
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-original.svg" alt="Kubernetes" className="absolute bottom-1 right-1 w-9 h-9 transition-all duration-300 icon-bottom-right" draggable="false" />
                </div>
                <span className="skill-name">Containers</span>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Projects Section */}
      <AnimatedSection id="projects" title="Projects" variant="left" showTitle={false}>
        <div className="max-w-6xl mx-auto mb-8 md:mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-center">
            <span className="text-accent">Progetti in</span><br />
            <span className="relative inline-block px-2">
              <span className="relative z-0">evidenza</span>
              <span 
                className={`absolute bottom-0 left-0 w-full h-[110%] bg-yellow-300/50 -rotate-1 z-10 ${isProjectsVisible ? 'animate-highlight-draw' : 'opacity-0'}`}
                style={{ animationDelay: isProjectsVisible ? '0.5s' : '0s', animationFillMode: 'forwards' }}
              ></span>
            </span>
          </h2>
        </div>

        {/* Desktop: carousel con frecce */}
        <div className="hidden md:block relative mx-auto" style={{ maxWidth: 'calc(256px * 4 + 16px * 3 + 96px)' }}>
          <button
            type="button"
            onClick={() => scrollProjects('left')}
            disabled={!canScrollLeft}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center transition-all duration-200 ${canScrollLeft ? 'opacity-100 hover:bg-accent hover:text-white hover:border-accent' : 'opacity-30 cursor-not-allowed'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => scrollProjects('right')}
            disabled={!canScrollRight}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center transition-all duration-200 ${canScrollRight ? 'opacity-100 hover:bg-accent hover:text-white hover:border-accent' : 'opacity-30 cursor-not-allowed'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <div
            ref={projectsContainerRef}
            className="overflow-x-auto mx-12 scrollbar-hide py-4 -my-4"
            style={{ width: 'calc(256px * 4 + 16px * 3)', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            onScroll={(e) => {
              if (isProgrammaticScroll.current) return;
              const container = e.currentTarget;
              const cardWidth = 256 + 16;
              const newIndex = Math.round(container.scrollLeft / cardWidth);
              if (newIndex !== projectIndex) {
                setProjectIndex(newIndex);
              }
            }}
          >
            <div className="flex gap-4">
              {/* Project 1 - Community */}
          <div className="group bg-white border border-gray-200 rounded-lg hover:shadow-lg hover:border-accent transition-all duration-300 hover:-translate-y-1 w-64 flex-shrink-0 snap-start">
            <div className="relative h-36 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden rounded-t-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/20 to-slate-500/20"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 bg-white/80 rounded-lg flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 3a1 1 0 000 2h1v10H4a1 1 0 000 2h12a1 1 0 000-2h-1V5h1a1 1 0 000-2H4zm5 2v10h2V5H9z" />
                  </svg>
                </div>
              </div>
              {/* Badge link */}
              <button 
                onClick={() => window.open('https://lab.retr0hub.dev', '_blank', 'noopener,noreferrer')}
                className="absolute top-2 left-2 w-7 h-7 bg-gray-900/40 backdrop-blur-sm rounded-md flex items-center justify-center transition-all durataion-300 z-10 hover:bg-gray-900/60 hover:scale-110"
              >
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </button>
              {/* Badge code in alto a destra */}
              <button 
                onClick={() => handleShowStack(['frontend', 'backend', 'containers', 'databases', 'hosting', 'git'])}
                onMouseEnter={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setDevTooltip({ x: rect.left + rect.width / 2, y: rect.top - 32 });
                }}
                onMouseLeave={() => setDevTooltip(null)}
                className="absolute top-2 right-2 w-7 h-7 bg-gray-900/40 backdrop-blur-sm rounded-md flex items-center justify-center transition-all duration-300 z-10 hover:bg-gray-900/60 hover:scale-110"
              >
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-accent transition-colors text-base">Community</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">Playground sperimentale per componenti UI, articoli tecnici e micro-esperimenti pubblicati con pipeline CI/CD automatizzata.</p>
              <div className="flex flex-wrap gap-1 mb-3">
                <span className="px-2 py-1 bg-gray-100 text-xs rounded text-gray-700">Astro</span>
                <span className="px-2 py-1 bg-gray-100 text-xs rounded text-gray-700">MDX</span>
                <span className="px-2 py-1 bg-gray-100 text-xs rounded text-gray-700">Cloudflare</span>
              </div>
            </div>
          </div>

          {/* Project 2 - Portfolio */}
          <div className="group bg-white border border-gray-200 rounded-lg hover:shadow-lg hover:border-accent transition-all duration-300 hover:-translate-y-1 w-64 flex-shrink-0 snap-start">
            <div className="relative h-36 bg-gradient-to-br from-orange-100 to-orange-200 overflow-hidden rounded-t-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-red-400/20"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 bg-white/80 rounded-lg flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                  </svg>
                </div>
              </div>
              {/* Badge link in alto a sinistra */}
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="absolute top-2 left-2 w-7 h-7 bg-gray-900/40 backdrop-blur-sm rounded-md flex items-center justify-center transition-all duration-300 z-10 hover:bg-gray-900/60 hover:scale-110"
              >
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </button>
              {/* Badge code in alto a destra */}
              <button 
                onClick={() => handleShowStack(['frontend', 'hosting', 'git'])}
                onMouseEnter={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setDevTooltip({ x: rect.left + rect.width / 2, y: rect.top - 32 });
                }}
                onMouseLeave={() => setDevTooltip(null)}
                className="absolute top-2 right-2 w-7 h-7 bg-gray-900/40 backdrop-blur-sm rounded-md flex items-center justify-center transition-all duration-300 z-10 hover:bg-gray-900/60 hover:scale-110"
              >
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-accent transition-colors text-base">Portfolio</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">Nuovo ecosistema personale: design system proprietario, esperimenti UI e spazio community/lab in continua evoluzione.</p>
              <div className="flex flex-wrap gap-1 mb-3">
                <span className="px-2 py-1 bg-gray-100 text-xs rounded text-gray-700">Next.js 15</span>
                <span className="px-2 py-1 bg-gray-100 text-xs rounded text-gray-700">Framer Motion</span>
                <span className="px-2 py-1 bg-gray-100 text-xs rounded text-gray-700">Turbopack</span>
              </div>
            </div>
          </div>

          {/* Project 3 - Passoetiro */}
          <div className="group bg-white border border-gray-200 rounded-lg hover:shadow-lg hover:border-accent transition-all duration-300 hover:-translate-y-1 w-64 flex-shrink-0 snap-start">
            <div className="relative h-36 bg-gradient-to-br from-blue-100 to-blue-200 overflow-hidden rounded-t-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-cyan-400/20"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 bg-white/80 rounded-lg flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"/>
                  </svg>
                </div>
              </div>
              {/* Badge link in alto a sinistra */}
              <button 
                onClick={() => window.open('https://passoetiro.com', '_blank', 'noopener,noreferrer')}
                className="absolute top-2 left-2 w-7 h-7 bg-gray-900/40 backdrop-blur-sm rounded-md flex items-center justify-center transition-all duration-300 z-10 hover:bg-gray-900/60 hover:scale-110"
              >
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </button>
              <button 
                onClick={() => window.open('mailto:info@retr0.dev?subject=Richiesta%20informazioni%20progetto%20Passoetiro', '_blank')}
                className="absolute top-2 left-10 w-7 h-7 bg-gray-900/40 backdrop-blur-sm rounded-md flex items-center justify-center transition-all duration-300 z-10 hover:bg-gray-900/60 hover:scale-110"
              >
                <span className="text-white text-xs font-bold">€</span>
              </button>
              {/* Badge code in alto a destra */}
              <button 
                onClick={() => handleShowStack(['hosting', 'databases', 'php'])}
                onMouseEnter={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setDevTooltip({ x: rect.left + rect.width / 2, y: rect.top - 32 });
                }}
                onMouseLeave={() => setDevTooltip(null)}
                className="absolute top-2 right-2 w-7 h-7 bg-gray-900/40 backdrop-blur-sm rounded-md flex items-center justify-center transition-all duration-300 z-10 hover:bg-gray-900/60 hover:scale-110"
              >
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-accent transition-colors text-base">Passoetiro</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">Magazine digitale con redazione multi-autore, agenda eventi e ottimizzazione SEO dedicata al basket nazionale.</p>
              <div className="flex flex-wrap gap-1 mb-3">
                <span className="px-2 py-1 bg-gray-100 text-xs rounded text-gray-700">Next.js</span>
                <span className="px-2 py-1 bg-gray-100 text-xs rounded text-gray-700">MDX</span>
                <span className="px-2 py-1 bg-gray-100 text-xs rounded text-gray-700">Tailwind</span>
              </div>
            </div>
          </div>

          {/* Project 4 - Molisebasket */}
          <div className="group bg-white border border-gray-200 rounded-lg hover:shadow-lg hover:border-accent transition-all duration-300 hover:-translate-y-1 w-64 flex-shrink-0 snap-start">
            <div className="relative h-36 bg-gradient-to-br from-purple-100 to-purple-200 overflow-hidden rounded-t-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-purple-400/20"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 bg-white/80 rounded-lg flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                  </svg>
                </div>
              </div>
              {/* Badge link in alto a sinistra */}
              <button 
                onClick={() => window.open('https://new.molisebasket.net', '_blank', 'noopener,noreferrer')}
                className="absolute top-2 left-2 w-7 h-7 bg-gray-900/40 backdrop-blur-sm rounded-md flex items-center justify-center transition-all duration-300 z-10 hover:bg-gray-900/60 hover:scale-110"
              >
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </button>
              {/* Badge code in alto a destra */}
              <button 
                onClick={() => handleShowStack(['hosting', 'databases'])}
                onMouseEnter={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setDevTooltip({ x: rect.left + rect.width / 2, y: rect.top - 32 });
                }}
                onMouseLeave={() => setDevTooltip(null)}
                className="absolute top-2 right-2 w-7 h-7 bg-gray-900/40 backdrop-blur-sm rounded-md flex items-center justify-center transition-all duration-300 z-10 hover:bg-gray-900/60 hover:scale-110"
              >
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-accent transition-colors text-base">Molisebasket</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">Restyling completo del portale ufficiale: risultati live, roster dinamici e CMS headless per la redazione.</p>
              <div className="flex flex-wrap gap-1 mb-3">
                <span className="px-2 py-1 bg-gray-100 text-xs rounded text-gray-700">Next.js</span>
                <span className="px-2 py-1 bg-gray-100 text-xs rounded text-gray-700">Supabase</span>
                <span className="px-2 py-1 bg-gray-100 text-xs rounded text-gray-700">Tailwind</span>
              </div>
            </div>
          </div>

          {/* Project 5 - Deskit */}
          <div className="group bg-white border border-gray-200 rounded-lg hover:shadow-lg hover:border-accent transition-all duration-300 hover:-translate-y-1 w-64 flex-shrink-0 snap-start">
            <div className="relative h-36 bg-gradient-to-br from-green-100 to-green-200 overflow-hidden rounded-t-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-emerald-400/20"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 bg-white/80 rounded-lg flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 102 0V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
                  </svg>
                </div>
              </div>
              {/* Badge link in alto a sinistra */}
              <button 
                onClick={() => window.open('https://deskit.svago.online', '_blank', 'noopener,noreferrer')}
                className="absolute top-2 left-2 w-7 h-7 bg-gray-900/40 backdrop-blur-sm rounded-md flex items-center justify-center transition-all duration-300 z-10 hover:bg-gray-900/60 hover:scale-110"
              >
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </button>
              {/* Badge code in alto a destra */}
              <button 
                onClick={() => handleShowStack(['frontend', 'hosting', 'php', 'git'])}
                onMouseEnter={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setDevTooltip({ x: rect.left + rect.width / 2, y: rect.top - 32 });
                }}
                onMouseLeave={() => setDevTooltip(null)}
                className="absolute top-2 right-2 w-7 h-7 bg-gray-900/40 backdrop-blur-sm rounded-md flex items-center justify-center transition-all duration-300 z-10 hover:bg-gray-900/60 hover:scale-110"
              >
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-accent transition-colors text-base">Deskit</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">Suite per gestire menu, palinsesti e promo nei punti vendita con sincronizzazione cloud e player offline.</p>
              <div className="flex flex-wrap gap-1 mb-3">
                <span className="px-2 py-1 bg-gray-100 text-xs rounded text-gray-700">React</span>
                <span className="px-2 py-1 bg-gray-100 text-xs rounded text-gray-700">Electron</span>
                <span className="px-2 py-1 bg-gray-100 text-xs rounded text-gray-700">Firebase</span>
              </div>
            </div>
          </div>
            </div>
          </div>
        </div>

        {/* Mobile: scroll orizzontale con swipe */}
        <div className="md:hidden w-full overflow-x-auto snap-x snap-mandatory pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}>
          <div className="flex gap-4 px-4" style={{ width: 'max-content' }}>
            {/* Project 1 - Community */}
            <div className="group bg-white border border-gray-200 rounded-lg shadow-sm w-[280px] flex-shrink-0 snap-center">
              <div className="relative h-32 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden rounded-t-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/20 to-slate-500/20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/80 rounded-lg flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-accent" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 3a1 1 0 000 2h1v10H4a1 1 0 000 2h12a1 1 0 000-2h-1V5h1a1 1 0 000-2H4zm5 2v10h2V5H9z" />
                    </svg>
                  </div>
                </div>
                <button onClick={() => window.open('https://lab.retr0hub.dev', '_blank', 'noopener,noreferrer')} className="absolute top-2 left-2 w-7 h-7 bg-gray-900/40 backdrop-blur-sm rounded-md flex items-center justify-center z-10">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1 text-base">Community</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">Playground sperimentale per componenti UI, articoli tecnici e micro-esperimenti.</p>
                <div className="flex flex-wrap gap-1">
                  <span className="px-2 py-0.5 bg-gray-100 text-xs rounded text-gray-700">Astro</span>
                  <span className="px-2 py-0.5 bg-gray-100 text-xs rounded text-gray-700">MDX</span>
                  <span className="px-2 py-0.5 bg-gray-100 text-xs rounded text-gray-700">Cloudflare</span>
                </div>
              </div>
            </div>

            {/* Project 2 - Portfolio */}
            <div className="group bg-white border border-gray-200 rounded-lg shadow-sm w-[280px] flex-shrink-0 snap-center">
              <div className="relative h-32 bg-gradient-to-br from-orange-100 to-orange-200 overflow-hidden rounded-t-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-red-400/20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/80 rounded-lg flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-accent" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/></svg>
                  </div>
                </div>
                <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="absolute top-2 left-2 w-7 h-7 bg-gray-900/40 backdrop-blur-sm rounded-md flex items-center justify-center z-10">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1 text-base">Portfolio</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">Ecosistema personale: design system proprietario, esperimenti UI e community/lab.</p>
                <div className="flex flex-wrap gap-1">
                  <span className="px-2 py-0.5 bg-gray-100 text-xs rounded text-gray-700">Next.js 15</span>
                  <span className="px-2 py-0.5 bg-gray-100 text-xs rounded text-gray-700">Framer Motion</span>
                </div>
              </div>
            </div>

            {/* Project 3 - Passoetiro */}
            <div className="group bg-white border border-gray-200 rounded-lg shadow-sm w-[280px] flex-shrink-0 snap-center">
              <div className="relative h-32 bg-gradient-to-br from-blue-100 to-blue-200 overflow-hidden rounded-t-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-cyan-400/20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/80 rounded-lg flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-accent" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"/></svg>
                  </div>
                </div>
                <button onClick={() => window.open('https://passoetiro.com', '_blank', 'noopener,noreferrer')} className="absolute top-2 left-2 w-7 h-7 bg-gray-900/40 backdrop-blur-sm rounded-md flex items-center justify-center z-10">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1 text-base">Passoetiro</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">Magazine digitale con redazione multi-autore e ottimizzazione SEO.</p>
                <div className="flex flex-wrap gap-1">
                  <span className="px-2 py-0.5 bg-gray-100 text-xs rounded text-gray-700">Next.js</span>
                  <span className="px-2 py-0.5 bg-gray-100 text-xs rounded text-gray-700">MDX</span>
                  <span className="px-2 py-0.5 bg-gray-100 text-xs rounded text-gray-700">Tailwind</span>
                </div>
              </div>
            </div>

            {/* Project 4 - Molisebasket */}
            <div className="group bg-white border border-gray-200 rounded-lg shadow-sm w-[280px] flex-shrink-0 snap-center">
              <div className="relative h-32 bg-gradient-to-br from-purple-100 to-purple-200 overflow-hidden rounded-t-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-purple-400/20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/80 rounded-lg flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-accent" fill="currentColor" viewBox="0 0 20 20"><path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/></svg>
                  </div>
                </div>
                <button onClick={() => window.open('https://new.molisebasket.net', '_blank', 'noopener,noreferrer')} className="absolute top-2 left-2 w-7 h-7 bg-gray-900/40 backdrop-blur-sm rounded-md flex items-center justify-center z-10">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1 text-base">Molisebasket</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">Restyling portale: risultati live, roster dinamici e CMS headless.</p>
                <div className="flex flex-wrap gap-1">
                  <span className="px-2 py-0.5 bg-gray-100 text-xs rounded text-gray-700">Next.js</span>
                  <span className="px-2 py-0.5 bg-gray-100 text-xs rounded text-gray-700">Supabase</span>
                  <span className="px-2 py-0.5 bg-gray-100 text-xs rounded text-gray-700">Tailwind</span>
                </div>
              </div>
            </div>

            {/* Project 5 - Deskit */}
            <div className="group bg-white border border-gray-200 rounded-lg shadow-sm w-[280px] flex-shrink-0 snap-center">
              <div className="relative h-32 bg-gradient-to-br from-green-100 to-green-200 overflow-hidden rounded-t-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-emerald-400/20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/80 rounded-lg flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-accent" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/><path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 102 0V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/></svg>
                  </div>
                </div>
                <button onClick={() => window.open('https://deskit.svago.online', '_blank', 'noopener,noreferrer')} className="absolute top-2 left-2 w-7 h-7 bg-gray-900/40 backdrop-blur-sm rounded-md flex items-center justify-center z-10">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1 text-base">Deskit</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">Suite per gestire menu, palinsesti e promo con sync cloud.</p>
                <div className="flex flex-wrap gap-1">
                  <span className="px-2 py-0.5 bg-gray-100 text-xs rounded text-gray-700">React</span>
                  <span className="px-2 py-0.5 bg-gray-100 text-xs rounded text-gray-700">Electron</span>
                  <span className="px-2 py-0.5 bg-gray-100 text-xs rounded text-gray-700">Firebase</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>
      <div className="py-8 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-4">
            <div className="h-px bg-gradient-to-r from-transparent via-accent/30 to-accent/50 flex-1 max-w-xs"></div>
            <div className="flex gap-2">
              <div className="w-2 h-2 rounded-full bg-accent/40 animate-pulse"></div>
              <div className="w-2 h-2 rounded-full bg-accent/60 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <div className="h-px bg-gradient-to-l from-transparent via-accent/30 to-accent/50 flex-1 max-w-xs"></div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <AnimatedSection id="contact" title="Contact" variant="right" showTitle={false}>
        <div className="max-w-7xl mx-auto relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-start">
            {/* Colonna Sinistra - Info */}
            <div className="relative">
              {/* Emoji decorative sinistra */}
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

              {/* Card Info Contatti */}
              <div className="space-y-4 relative z-10">
                {/* Email */}
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-md flex-shrink-0">
                    <span className="text-2xl md:text-3xl">📧</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Email</p>
                    <a
                      href="mailto:info@retr0hub.dev?subject=Richiesta%20dal%20portfolio"
                      className="text-accent font-medium text-base md:text-lg truncate block"
                    >
                      info@retr0hub.dev
                    </a>
                  </div>
                </div>

                {/* LinkedIn */}
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-md flex-shrink-0">
                    <span className="text-2xl md:text-3xl">💼</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">LinkedIn</p>
                    <a href="https://linkedin.com/in/marco-simone-cannizzaro-582787283" target="_blank" rel="noopener noreferrer" className="text-accent font-medium text-base md:text-lg truncate block">Marco Simone Cannizzaro</a>
                  </div>
                </div>

                {/* GitHub */}
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
              {/* Emoji decorative destra */}
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
      
      {/* Footer */}
      <footer className="py-8 border-t border-gray-200">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} <span className="text-accent font-mono">Retr0_</span>. Tutti i diritti riservati.
          </p>
        </div>
      </footer>

      {/* Tooltip overlay per DEV badge */}
      {devTooltip && (
        <div 
          className="fixed z-[9999] px-2 py-1 bg-accent text-white text-[10px] rounded-md shadow-lg pointer-events-none animate-fade-in"
          style={{ 
            left: devTooltip.x, 
            top: devTooltip.y,
            transform: 'translateX(-50%)'
          }}
        >
          Cliccami!
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-accent"></span>
        </div>
      )}
    </main>
    </>
  )
} 