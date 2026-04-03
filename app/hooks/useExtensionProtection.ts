'use client';
import { useEffect } from 'react';

export function useExtensionProtection() {
  useEffect(() => {
    const originalError = console.error;
    console.error = (...args) => {
      if (typeof args[0] === 'string' && args[0].includes('hydrated but some attributes')) {
        return;
      }
      originalError.apply(console, args);
    };

    const validAttributes = new Set([
      'id', 'class', 'style', 'title', 'lang', 'dir', 'hidden', 'tabindex',
      'role', 'aria-*', 'data-testid', 'data-cy', 'data-test',
      'key', 'ref', 'dangerouslySetInnerHTML', 'suppressHydrationWarning',
      'data-nextjs-scroll-focus-boundary', 'data-overlay', 'data-nextjs-dialog-overlay',
      'data-nextjs-container', 'data-nextjs-portal', 'data-turbopack-hmr',
      'data-fast-refresh', 'data-next-error-overlay', 'data-reactroot',
      'name', 'value', 'type', 'placeholder', 'required', 'disabled', 'readonly',
      'checked', 'selected', 'multiple', 'autocomplete', 'autofocus',
      'href', 'src', 'alt', 'width', 'height', 'loading', 'decoding',
      'crossorigin', 'referrerpolicy', 'sizes', 'srcset',
      'content', 'charset', 'http-equiv', 'property'
    ]);

    const suspiciousPatterns = [
      /^cz-/i,
      /^data-(gramm|gr-)/i,
      /^data-lastpass/i,
      /^data-(honey|pinterest|facebook)/i,
      /^goog(le)?-?te/i,
      /^data-(darkreader|adblock)/i,
      /extension/i,
      /^_[a-z]+ext/i,
      /-extension-/i,
      /^data-[0-9a-f]{8,}/i
    ];

    const isExtensionAttribute = (attrName: string): boolean => {
      const name = attrName.toLowerCase();
      
      if (validAttributes.has(name)) return false;
      if (name.startsWith('aria-')) return false;
      if (name.startsWith('data-test')) return false;
      
      if (name.includes('next') || name.includes('turbo') || name.includes('react')) return false;
      if (name.includes('hmr') || name.includes('fast-refresh')) return false;
      if (name.includes('overlay') || name.includes('error')) return false;
      
      if (suspiciousPatterns.some(pattern => pattern.test(name))) return true;
      if (name.startsWith('data-') && name.length > 20) return true;
      if (/^[_$-]/.test(name)) return true;
      
      return false;
    };

    const cleanExtensionAttributes = (element: Element) => {
      const attributes = Array.from(element.attributes);
      attributes.forEach(attr => {
        if (isExtensionAttribute(attr.name)) {
          element.removeAttribute(attr.name);
        }
      });
    };

    const cleanAllElements = () => {
      const allElements = document.querySelectorAll('*');
      allElements.forEach(cleanExtensionAttributes);
    };

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.target instanceof Element) {
          cleanExtensionAttributes(mutation.target);
        }
        
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node instanceof Element) {
              cleanExtensionAttributes(node);
              const children = node.querySelectorAll('*');
              children.forEach(cleanExtensionAttributes);
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeOldValue: true
    });

    cleanAllElements();
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
    
    const proTips = [
      '💡 Pro tip: Prova a cliccare sulle mie skills sopra!',
      '🎨 E hai notato la scia del mouse sul testo? Magico, vero?',
      '🖱️ Il cursore cambia forma a seconda di dove lo posizioni!',
      '✨ Ogni parola del paragrafo ha la sua animazione hover personalizzata!',
      '🔄 Le skills si alternano in modo ciclico - scoprile tutte!',
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
    
    const randomProTip = proTips[Math.floor(Math.random() * proTips.length)];
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    
    setTimeout(() => {
      console.log('%c' + randomProTip, 'color: #7C3AED; font-size: 14px; font-style: italic;');
    }, 1000);

    setTimeout(() => {
      console.log('%c' + randomTip, 'color: #7C3AED; font-size: 14px; font-style: italic;');
    }, 2000);

    return () => {
      console.error = originalError;
      observer.disconnect();
      clearInterval(cleanupInterval);
    };
  }, []);
}
