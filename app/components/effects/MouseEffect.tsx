'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Lenis from 'lenis';

function LenisProvider() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      autoRaf: true
    });
    return () => { lenis.destroy(); };
  }, []);
  return null;
}

export default function MouseEffect() {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsTouch(isTouchDevice);

    if (!isTouchDevice) {
      document.documentElement.classList.add('has-fine-pointer');
    }

    const handleTouchStart = () => {
      document.documentElement.classList.remove('has-fine-pointer');
      setIsTouch(true);
    };

    window.addEventListener('touchstart', handleTouchStart, { once: true });
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      document.documentElement.classList.remove('has-fine-pointer');
    };
  }, []);

  if (isTouch) {
    return <LenisProvider />;
  }

  return <MouseCursorEffect />;
}

function MouseCursorEffect() {
  const mouse = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const smallPos = useRef({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isOverNav, setIsOverNav] = useState(false);
  const [isOverLogo, setIsOverLogo] = useState(false);
  const [currentNavItemText, setCurrentNavItemText] = useState('');
  const [isOverDot, setIsOverDot] = useState(false);
  const [isMiddleMousePressed, setIsMiddleMousePressed] = useState(false);
  const [isDraggingNode, setIsDraggingNode] = useState(false);
  const [dotTarget, setDotTarget] = useState<{ x: number; y: number } | null>(null);
  const bigRef = useRef<HTMLDivElement>(null);
  const smallRef = useRef<HTMLDivElement>(null);
  const gravityRef = useRef<HTMLDivElement>(null); // SVG personalizzato che orbita
  const outerCircleRef = useRef<HTMLDivElement>(null); // Cerchio di debug temporaneo
  const leftBracketRef = useRef<HTMLDivElement>(null);
  const rightBracketRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const bracketPos = useRef({ x: 0, y: 0 });
  const gravityPos = useRef({ x: 0, y: 0 }); // Posizione del pallino gravità
  
  // Variabili per la logica orbitale
  const prevMouse = useRef({ x: 0, y: 0 }); // Posizione precedente del mouse
  const orbitAngle = useRef(0); // Angolo di orbita attuale
  const orbitRadius = 26; // Raggio di orbita maggiore del cerchio (36/2 + 8px di distacco = 26px)

  // Listener per eventi custom dei pallini
  useEffect(() => {
    const handleDotHover = (e: any) => {
      // Trova il centro del pallino
      const idx = e.detail.idx;
      const dot = document.querySelectorAll('.fixed.right-8 button')[idx] as HTMLElement;
      if (dot) {
        const rect = dot.getBoundingClientRect();
        setDotTarget({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
        setIsOverDot(true);
      }
    };
    const handleDotLeave = () => {
      setIsOverDot(false);
      setDotTarget(null);
    };
    
    // Listener per drag dei nodi
    const handleNodeDragStart = () => {
      setIsDraggingNode(true);
    };
    const handleNodeDragEnd = () => {
      setIsDraggingNode(false);
    };
    
    window.addEventListener('dot-hover', handleDotHover);
    window.addEventListener('dot-leave', handleDotLeave);
    window.addEventListener('node-drag-start', handleNodeDragStart);
    window.addEventListener('node-drag-end', handleNodeDragEnd);
    return () => {
      window.removeEventListener('dot-hover', handleDotHover);
      window.removeEventListener('dot-leave', handleDotLeave);
      window.removeEventListener('node-drag-start', handleNodeDragStart);
      window.removeEventListener('node-drag-end', handleNodeDragEnd);
    };
  }, []);

  useEffect(() => {
    let animationFrame: number;

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      setMousePos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
      setIsMiddleMousePressed(false); // Reset dello stato del middle button quando il mouse esce
      if (smallRef.current) smallRef.current.style.opacity = '0';
      if (bigRef.current) bigRef.current.style.opacity = '0';
      if (leftBracketRef.current) leftBracketRef.current.style.opacity = '0';
      if (rightBracketRef.current) rightBracketRef.current.style.opacity = '0';
    };

    // Disabilita il comportamento predefinito del middle mouse button e attiva il pallino gravità
    const handleMiddleMouseDown = (e: MouseEvent) => {
      if (e.button === 1) { // Middle mouse button
        e.preventDefault();
        setIsMiddleMousePressed(true);
        return false;
      }
    };

    const handleMiddleMouseUp = (e: MouseEvent) => {
      if (e.button === 1) { // Middle mouse button
        e.preventDefault();
        setIsMiddleMousePressed(false);
        return false;
      }
    };

    // Controlla se il mouse è sopra gli elementi di navigazione, il logo o le skills
    const checkIfOverElements = () => {
      const navLinks = document.querySelectorAll('header a.nav-link');
      const logoLink = document.querySelector('header a.logo-link');
      const skillWords = document.querySelectorAll('.clickable-word');
      const mouseX = mouse.current.x;
      const mouseY = mouse.current.y;
      let isOverNavItem = false;
      let isOverLogoItem = false;
      let isOverSkillItem = false;
      let currentText = '';
      const margin = 16; // px di tolleranza extra

      // Controlla se il mouse è sopra i link di navigazione
      navLinks.forEach(link => {
        const rect = link.getBoundingClientRect();
        if (
          mouseX >= rect.left - margin &&
          mouseX <= rect.right + margin &&
          mouseY >= rect.top - margin &&
          mouseY <= rect.bottom + margin
        ) {
          isOverNavItem = true;
          currentText = link.textContent || '';
        }
      });

      // Controlla se il mouse è sopra il logo
      if (logoLink) {
        const rect = logoLink.getBoundingClientRect();
        if (
          mouseX >= rect.left &&
          mouseX <= rect.right &&
          mouseY >= rect.top &&
          mouseY <= rect.bottom
        ) {
          isOverLogoItem = true;
        }
      }

      // Controlla se il mouse è sopra le parole delle skills
      skillWords.forEach(skill => {
        const rect = skill.getBoundingClientRect();
        if (
          mouseX >= rect.left - margin &&
          mouseX <= rect.right + margin &&
          mouseY >= rect.top - margin &&
          mouseY <= rect.bottom + margin
        ) {
          isOverSkillItem = true;
        }
      });

      setIsOverNav(isOverNavItem);
      setIsOverLogo(isOverLogoItem || isOverSkillItem); // Tratta le skills come il logo
      setCurrentNavItemText(currentText);
    };

    // Disabilita il menu contestuale del tasto destro
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    const lerp = (a: number, b: number, n: number) => a + (b - a) * n;

    const animate = () => {
      // Più burroso: n=0.08
      pos.current.x = lerp(pos.current.x, mouse.current.x, 0.13);
      pos.current.y = lerp(pos.current.y, mouse.current.y, 0.13);
            // Se sopra un pallino, il cursore piccolo va verso il centro del pallino e si ingrandisce
      if (isOverDot && dotTarget) {
        smallPos.current.x = lerp(smallPos.current.x, dotTarget.x, 0.18);
        smallPos.current.y = lerp(smallPos.current.y, dotTarget.y, 0.18);
      } else {
        smallPos.current.x = lerp(smallPos.current.x, mouse.current.x, 0.13);
        smallPos.current.y = lerp(smallPos.current.y, mouse.current.y, 0.13);
      }
      
      // Animazione del pallino gravità - orbita intorno al pallino principale
      if (isMiddleMousePressed) {
        // Calcola la direzione del movimento del mouse
        const deltaX = mouse.current.x - prevMouse.current.x;
        const deltaY = mouse.current.y - prevMouse.current.y;
        const mouseSpeed = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        // Se il mouse si sta muovendo, aggiorna l'angolo di orbita verso la direzione del movimento
        if (mouseSpeed > 0.5) {
          const targetAngle = Math.atan2(deltaY, deltaX);
          
          // Gestione degli angoli circolari per evitare rotazioni errate
          let angleDiff = targetAngle - orbitAngle.current;
          
          // Normalizza la differenza per prendere il percorso più corto
          if (angleDiff > Math.PI) {
            angleDiff -= 2 * Math.PI;
          } else if (angleDiff < -Math.PI) {
            angleDiff += 2 * Math.PI;
          }
          
          // Applica l'interpolazione alla differenza normalizzata
          orbitAngle.current += angleDiff * 0.15; // Velocità leggermente aumentata
        }
        
        // Posiziona la freccia sull'orbita intorno al pallino principale
        gravityPos.current.x = smallPos.current.x + Math.cos(orbitAngle.current) * orbitRadius;
        gravityPos.current.y = smallPos.current.y + Math.sin(orbitAngle.current) * orbitRadius;
      } else {
        // Quando middle click non è attivo, resetta l'angolo alla posizione di destra
        orbitAngle.current = 0; // 0 radianti = punta a destra
      }
      
      // Salva la posizione attuale del mouse per il prossimo frame
      prevMouse.current.x = mouse.current.x;
      prevMouse.current.y = mouse.current.y;
      
      // Controlla se il mouse è sopra gli elementi di navigazione o il logo
      checkIfOverElements();
      
      if (bigRef.current) {
        bigRef.current.style.left = `${pos.current.x - 75}px`;
        bigRef.current.style.top = `${pos.current.y - 75}px`;
        // Mantieni l'effetto scuro anche quando il mouse è sopra un elemento di navigazione
        bigRef.current.style.opacity = isVisible ? '0.2' : '0';
        bigRef.current.style.transition = 'left 0.35s cubic-bezier(0.22,1,0.36,1), top 0.35s cubic-bezier(0.22,1,0.36,1), opacity 0.2s';
      }
      
      // Gestisci la visibilità del cerchio piccolo e delle parentesi quadre
      if (smallRef.current) {
        if (isDraggingNode) {
          // Effetto cerchio vuoto espanso durante il drag (come sul logo)
          const size = 32; // Cerchio più grande
          const offset = size / 2;
          
          smallRef.current.style.width = `${size}px`;
          smallRef.current.style.height = `${size}px`;
          smallRef.current.style.left = `${smallPos.current.x - offset}px`;
          smallRef.current.style.top = `${smallPos.current.y - offset}px`;
          smallRef.current.style.opacity = isVisible ? '1' : '0';
          smallRef.current.style.backgroundColor = 'transparent'; // Cerchio vuoto
          smallRef.current.style.borderColor = 'var(--color-accent)'; // Contorno viola
          smallRef.current.style.borderWidth = '2.5px';
          smallRef.current.style.mixBlendMode = 'normal'; // Nessun blend mode
          smallRef.current.style.transition = 'left 0.15s cubic-bezier(0.22,1,0.36,1), top 0.15s cubic-bezier(0.22,1,0.36,1), opacity 0.15s, width 0.2s, height 0.2s';
        } else if (isOverNav && !isOverLogo) {
          // Nascondi il cerchio quando siamo sopra i link dell'header (ma non il logo)
          smallRef.current.style.opacity = '0';
        } else if (isOverLogo) {
          // Per il logo, mostra un cerchio vuoto con contorno viola
          const size = 28; // Cerchio più grande per il logo
          const offset = size / 2;
          
          smallRef.current.style.width = `${size}px`;
          smallRef.current.style.height = `${size}px`;
          smallRef.current.style.left = `${smallPos.current.x - offset}px`;
          smallRef.current.style.top = `${smallPos.current.y - offset}px`;
          smallRef.current.style.opacity = isVisible ? '1' : '0';
          smallRef.current.style.backgroundColor = 'transparent'; // Cerchio vuoto
          smallRef.current.style.borderColor = 'var(--color-accent)'; // Contorno viola
          smallRef.current.style.borderWidth = '2px';
          smallRef.current.style.mixBlendMode = 'normal'; // Nessun blend mode
          smallRef.current.style.transition = 'left 0.3s cubic-bezier(0.22,1,0.36,1), top 0.3s cubic-bezier(0.22,1,0.36,1), opacity 0.2s, width 0.3s, height 0.3s';
        } else if (isOverDot) {
          // Effetto: il cursore si rimpicciolisce e svanisce
          const size = 10;
          const offset = size / 2;
          smallRef.current.style.width = `${size}px`;
          smallRef.current.style.height = `${size}px`;
          smallRef.current.style.left = `${smallPos.current.x - offset}px`;
          smallRef.current.style.top = `${smallPos.current.y - offset}px`;
          smallRef.current.style.opacity = '0';
          smallRef.current.style.backgroundColor = 'white';
          smallRef.current.style.borderColor = 'var(--color-accent)';
          smallRef.current.style.borderWidth = '2px';
          smallRef.current.style.mixBlendMode = 'difference';
          smallRef.current.style.transition = 'left 0.2s cubic-bezier(0.22,1,0.36,1), top 0.2s cubic-bezier(0.22,1,0.36,1), width 0.2s, height 0.2s, opacity 0.2s';
        } else {
          // Mostra il cerchio normale
          const size = 20;
          const offset = 10;
          
          smallRef.current.style.width = `${size}px`;
          smallRef.current.style.height = `${size}px`;
          smallRef.current.style.left = `${smallPos.current.x - offset}px`;
          smallRef.current.style.top = `${smallPos.current.y - offset}px`;
          smallRef.current.style.opacity = isVisible ? '1' : '0';
          smallRef.current.style.backgroundColor = 'white';
          smallRef.current.style.borderColor = 'var(--color-accent)';
          smallRef.current.style.borderWidth = '2px';
          smallRef.current.style.mixBlendMode = 'difference';
          smallRef.current.style.transition = 'left 0.3s cubic-bezier(0.22,1,0.36,1), top 0.3s cubic-bezier(0.22,1,0.36,1), opacity 0.2s, width 0.3s, height 0.3s';
        }
      }
      
      // Gestione del SVG personalizzato orbitale - visibile solo quando il middle mouse button è premuto
      if (gravityRef.current) {
        const size = 30; // Dimensione del nuovo SVG
        const offset = size / 2;
        
        gravityRef.current.style.width = `${size}px`;
        gravityRef.current.style.height = `${size}px`;
        gravityRef.current.style.left = `${gravityPos.current.x - offset}px`;
        gravityRef.current.style.top = `${gravityPos.current.y - offset}px`;
        gravityRef.current.style.opacity = (isVisible && isMiddleMousePressed) ? '1' : '0';
        
        // Orientamento del SVG verso la direzione del movimento del mouse
        // orbitAngle.current è l'angolo verso cui si muove il mouse
        // L'SVG punta verso l'alto per default, quindi aggiungo 90° per allinearlo
        const rotationDegrees = (orbitAngle.current * 180) / Math.PI + 90;
        gravityRef.current.style.transform = `rotate(${rotationDegrees}deg)`;
        gravityRef.current.style.transition = 'left 0.2s ease-out, top 0.2s ease-out, opacity 0.15s, transform 0.15s ease-out';
      }
      
      // Cerchio di debug temporaneo - segue il pallino principale
      if (outerCircleRef.current) {
        const size = 36;
        const offset = size / 2;
        
        outerCircleRef.current.style.width = `${size}px`;
        outerCircleRef.current.style.height = `${size}px`;
        outerCircleRef.current.style.left = `${smallPos.current.x - offset}px`;
        outerCircleRef.current.style.top = `${smallPos.current.y - offset}px`;
        outerCircleRef.current.style.opacity = '0'; // Sempre nascosto - Visibile -> isVisible ? '0.3' : '0';
        outerCircleRef.current.style.transition = 'left 0.3s cubic-bezier(0.22,1,0.36,1), top 0.3s cubic-bezier(0.22,1,0.36,1), opacity 0.2s';
      }
      
      // Gestisci le parentesi quadre
      if (leftBracketRef.current && rightBracketRef.current) {
        if (isOverNav && !isOverLogo) {
          // La distanza tra le parentesi si basa sulla larghezza del testo
          const textWidth = currentNavItemText.length * 9; // Approssimazione di 9px per carattere
          const offset = 10; // Distanza aggiuntiva dalle estremità del testo
          
          // Posiziona le parentesi intorno al testo
          leftBracketRef.current.style.left = `${smallPos.current.x - textWidth/2 - offset}px`;
          leftBracketRef.current.style.top = `${smallPos.current.y - 10}px`;
          leftBracketRef.current.style.opacity = isVisible ? '1' : '0';
          
          rightBracketRef.current.style.left = `${smallPos.current.x + textWidth/2 + offset - 10}px`; // -10px per la larghezza del carattere
          rightBracketRef.current.style.top = `${smallPos.current.y - 10}px`;
          rightBracketRef.current.style.opacity = isVisible ? '1' : '0';
        } else {
          // Nascondi le parentesi quando non siamo sopra i link o quando siamo sul logo
          leftBracketRef.current.style.opacity = '0';
          rightBracketRef.current.style.opacity = '0';
        }
      }
      
      animationFrame = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('mousedown', handleMiddleMouseDown);
    document.addEventListener('mouseup', handleMiddleMouseUp);
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('mousedown', handleMiddleMouseDown);
      document.removeEventListener('mouseup', handleMiddleMouseUp);
      cancelAnimationFrame(animationFrame);
    };
  }, [isVisible, isOverNav, isOverLogo, currentNavItemText, isOverDot, dotTarget, isMiddleMousePressed, isDraggingNode]);

  useEffect(() => {
    let animationFrame: number;

    // Animazione burrosa per le parentesi
    function animateBrackets() {
      if (isOverDot) {
        bracketPos.current.x = bracketPos.current.x + (mouse.current.x - bracketPos.current.x) * 0.13;
        bracketPos.current.y = bracketPos.current.y + (mouse.current.y - bracketPos.current.y) * 0.13;
      } else {
        bracketPos.current.x = mouse.current.x;
        bracketPos.current.y = mouse.current.y;
      }
      animationFrame = requestAnimationFrame(animateBrackets);
    }
    animateBrackets();
    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [isOverDot]);

  useEffect(() => {
    if (isOverDot) {
      document.body.style.cursor = 'none';
    } else {
      document.body.style.cursor = '';
    }
  }, [isOverDot]);

  // useEffect per gestire lo scroll con middle mouse button tramite Lenis
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      autoRaf: true
    });

    let scrollAnimationFrame: number;

    const smoothScroll = () => {
      if (isMiddleMousePressed && isVisible) {
        const scrollSpeed = 5;
        const deltaX = Math.cos(orbitAngle.current) * scrollSpeed;
        const deltaY = Math.sin(orbitAngle.current) * scrollSpeed;
        
        lenis.scrollTo(window.scrollY + deltaY, { duration: 0.1, immediate: false });
        
        if (Math.abs(deltaX) > 0.1) {
          window.scrollBy(deltaX, 0);
        }
      }
      
      scrollAnimationFrame = requestAnimationFrame(smoothScroll);
    };

    scrollAnimationFrame = requestAnimationFrame(smoothScroll);

    return () => {
      lenis.destroy();
      cancelAnimationFrame(scrollAnimationFrame);
    };
  }, [isMiddleMousePressed, isVisible]);

  return (
    <>
      <div
        ref={bigRef}
        className="fixed pointer-events-none z-[999] rounded-full bg-accent opacity-20 blur-xl"
        style={{
          width: '150px',
          height: '150px',
          left: '-9999px',
          top: '-9999px',
          transform: 'translate(0, 0)',
          opacity: 0,
        }}
      />
      <div
        ref={smallRef}
        className="fixed pointer-events-none z-[999] rounded-full bg-white border-2 border-accent mix-blend-difference"
        style={{
          width: '20px',
          height: '20px',
          left: '-9999px',
          top: '-9999px',
          transform: 'translate(0, 0)',
          opacity: 0,
        }}
      />
      {/* Cerchio di debug temporaneo */}
      <div
        ref={outerCircleRef}
        className="fixed pointer-events-none z-[997] rounded-full border border-red-500"
        style={{
          width: '36px',
          height: '36px',
          left: '-9999px',
          top: '-9999px',
          transform: 'translate(0, 0)',
          opacity: 0,
          backgroundColor: 'transparent',
          borderWidth: '2px',
        }}
      />
      {/* SVG personalizzato orbitale - appare quando il middle button è premuto e orbita intorno al cerchio */}
      <div
        ref={gravityRef}
        className="fixed pointer-events-none z-[999]"
        style={{
          width: '30px',
          height: '30px',
          left: '-9999px',
          top: '-9999px',
          opacity: 0,
          mixBlendMode: 'difference', // Stesso effetto contrasto del pallino principale
        }}
      >
        <svg 
          width="30" 
          height="30" 
          viewBox="0 0 300 300" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M 150 30
               C 180 60, 240 110, 220 160
               C 190 135, 110 135, 80 160
               C 60 110, 120 60, 150 30
               Z"
            fill="white"
            stroke="#7C3AED"
            strokeWidth="10"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {/* Parentesi quadra sinistra */}
      <div
        ref={leftBracketRef}
        className="fixed pointer-events-none z-[999] text-accent font-mono"
        style={{
          fontSize: '24px',
          fontWeight: 'bold',
          left: '-9999px',
          top: '-9999px',
          opacity: 0,
          transition: 'left 0.3s cubic-bezier(0.22,1,0.36,1), top 0.3s cubic-bezier(0.22,1,0.36,1), opacity 0.2s',
        }}
      >
        [
      </div>
      {/* Parentesi quadra destra */}
      <div
        ref={rightBracketRef}
        className="fixed pointer-events-none z-[999] text-accent font-mono"
        style={{
          fontSize: '24px',
          fontWeight: 'bold',
          left: '-9999px',
          top: '-9999px',
          opacity: 0,
          transition: 'left 0.3s cubic-bezier(0.22,1,0.36,1), top 0.3s cubic-bezier(0.22,1,0.36,1), opacity 0.2s',
        }}
      >
        ]
      </div>
      {/* Cursore custom per i pallini dello slider: solo parentesi laterali animate che seguono il mouse in modo burroso */}
      <AnimatePresence>
        {isOverDot && (
          <motion.div
            className="fixed pointer-events-none z-[1000] flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1, x: bracketPos.current.x - 36, y: bracketPos.current.y - 36 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            style={{ width: 72, height: 72 }}
          >
            {/* Parentesi tonde laterali animate */}
            <span
              className={`absolute left-0 top-1/2 -translate-y-1/2 text-accent text-4xl font-bold transition-all duration-200 opacity-100 ${isOverDot ? 'scale-130' : 'scale-100'}`}
              style={{ WebkitTextStroke: '0.3px white', mixBlendMode: 'difference' }}
            >(
            </span>
            <span
              className={`absolute right-0 top-1/2 -translate-y-1/2 text-accent text-4xl font-bold transition-all duration-200 opacity-100 ${isOverDot ? 'scale-130' : 'scale-100'}`}
              style={{ WebkitTextStroke: '0.3px white', mixBlendMode: 'difference' }}
            >)
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 