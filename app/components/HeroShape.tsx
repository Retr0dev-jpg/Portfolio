'use client';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useEffect, useRef } from 'react';

interface HeroShapeProps {
  shape: 'circle' | 'triangle';
  className?: string;
}

// Genera i punti di un cerchio
function getCirclePoints(cx: number, cy: number, r: number, n: number) {
  return Array.from({ length: n }, (_, i) => {
    const theta = (2 * Math.PI * i) / n;
    return {
      x: cx + r * Math.cos(theta),
      y: cy + r * Math.sin(theta),
    };
  });
}

// Genera i punti di un triangolo equilatero centrato (mantenuto per compatibilità)
function getTrianglePoints(cx: number, cy: number, r: number, n: number) {
  // Vertici del triangolo
  const verts = [
    { x: cx, y: cy - r }, // top
    { x: cx + r * Math.sin(Math.PI / 3), y: cy + r * Math.cos(Math.PI / 3) }, // bottom right
    { x: cx - r * Math.sin(Math.PI / 3), y: cy + r * Math.cos(Math.PI / 3) }, // bottom left
  ];
  // Suddividi i lati in modo uniforme
  const points = [];
  for (let side = 0; side < 3; side++) {
    const start = verts[side];
    const end = verts[(side + 1) % 3];
    for (let i = 0; i < n / 3; i++) {
      const t = i / (n / 3);
      points.push({
        x: start.x + (end.x - start.x) * t,
        y: start.y + (end.y - start.y) * t,
      });
    }
  }
  return points;
}

// Interpola tra i punti (mantenuto per compatibilità)
function interpolatePoints(circle: {x:number,y:number}[], triangle: {x:number,y:number}[], t: number) {
  return circle.map((c, i) => ({
    x: c.x + (triangle[i].x - c.x) * t,
    y: c.y + (triangle[i].y - c.y) * t,
  }));
}

// Genera la stringa path SVG da una lista di punti
function pointsToPath(points: {x:number,y:number}[]) {
  return points.reduce((acc, p, i) =>
    acc + (i === 0 ? `M ${p.x},${p.y}` : ` L ${p.x},${p.y}`),
    '') + ' Z';
}

// Configurazione delle orbite atomiche
const atomConfig = {
  nucleus: [
    { x: 192, y: 192, r: 16, color: "#e53e3e" },
    { x: 212, y: 185, r: 16, color: "#e53e3e" },
    { x: 200, y: 216, r: 16, color: "#3b82f6" },
    { x: 224, y: 208, r: 16, color: "#3b82f6" },
    { x: 208, y: 228, r: 16, color: "#e53e3e" },
    { x: 176, y: 212, r: 16, color: "#3b82f6" },
  ],
  orbits: [
    { rx: 150, ry: 50, rotation: 0, electronCount: 1, electronSize: 10, duration: 15 },
    { rx: 200, ry: 70, rotation: 60, electronCount: 1, electronSize: 10, duration: 20 },
    { rx: 250, ry: 90, rotation: 120, electronCount: 1, electronSize: 10, duration: 12 },
  ]
};

// Calcola direzioni di esplosione casuali per gli atomi
const explosionDirections = atomConfig.nucleus.map((atom) => {
  // Calcola l'angolo dal centro (200,200) alla posizione iniziale dell'atomo
  const dx = atom.x - 200;
  const dy = atom.y - 200;
  const angle = Math.atan2(dy, dx);
  
  // Distanza di esplosione casuale (150-200 unità)
  const distance = 150 + Math.random() * 50;
  
  // Ritardo casuale per l'esplosione
  const delay = 0.1 + Math.random() * 0.2;
  
  return {
    x: 200 + Math.cos(angle) * distance,
    y: 200 + Math.sin(angle) * distance,
    delay
  };
});

export default function HeroShape({ shape, className = '' }: HeroShapeProps) {
  // Aggiungi uno stato per tracciare se siamo sul client
  const [isClient, setIsClient] = useState(false);
  // Stati per il path e i punti
  const [pathData, setPathData] = useState("");
  // Stato per le fasi dell'animazione
  const [animationPhase, setAnimationPhase] = useState<'atom' | 'explosion' | 'blackhole'>('atom');
  const [isAnimating, setIsAnimating] = useState(false);
  // Stato per tracciare quante particelle sono state ingoiate
  const [particlesConsumed, setParticlesConsumed] = useState(0);
  // Stato per la rotazione animata delle orbite - rotazioni iniziali diverse
  const [orbitAngles, setOrbitAngles] = useState([0, Math.PI/4, Math.PI/2]);
  // Stato per la posizione angolare dei pallini (elettroni) - posizioni iniziali diverse
  const [electronAngles, setElectronAngles] = useState([0, Math.PI * 2/3, Math.PI * 4/3]);
  const requestRef = useRef<number>(0);
  const cleanupCounterRef = useRef(0);
  
  // Funzione per normalizzare gli angoli in modo più robusto
  const normalizeAngle = (angle: number) => {
    // Normalizza l'angolo tra 0 e 2π in modo più preciso
    const normalized = angle % (Math.PI * 2);
    return normalized < 0 ? normalized + (Math.PI * 2) : normalized;
  };

  // Animazione continua delle orbite e dei pallini
  useEffect(() => {
    let lastTime = performance.now();
    const orbitSpeeds = [0.12, 0.12, 0.12]; // radianti al secondo per ogni orbita - stessa velocità
    const electronSpeeds = [0.15, 0.12, 0.18]; // radianti al secondo per ogni pallino - velocità molto aumentata
    
    function animate(time: number) {
      const delta = Math.min((time - lastTime) / 1000, 0.016); // Limita delta max a ~60fps
      lastTime = time;
      
      // Pulizia periodica per prevenire accumulo di errori (ogni ~10 secondi)
      cleanupCounterRef.current += 1;
      const shouldCleanup = cleanupCounterRef.current % 600 === 0; // 60fps * 10s = 600 frames
      
      setOrbitAngles(prev => prev.map((a, i) => {
        const newAngle = a + orbitSpeeds[i] * delta;
        return shouldCleanup ? normalizeAngle(newAngle) : normalizeAngle(newAngle);
      }));
      
      setElectronAngles(prev => prev.map((a, i) => {
        const newAngle = a + electronSpeeds[i] * delta;
        return shouldCleanup ? normalizeAngle(newAngle) : normalizeAngle(newAngle);
      }));
      
      requestRef.current = requestAnimationFrame(animate);
    }
    
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current!);
  }, []);

  // Funzione per attivare/disattivare l'effetto buco nero al click
  const handleNucleusClick = () => {
    // Impedisci qualsiasi azione se l'animazione è già in corso
    if (isAnimating) {
      return;
    }

    if (animationPhase === 'atom') {
      // Attiva l'effetto buco nero
      setIsAnimating(true);
      setAnimationPhase('explosion');
      setParticlesConsumed(0); // Reset counter
      
      // Dopo l'esplosione, mostra il buco nero
      setTimeout(() => {
        setAnimationPhase('blackhole');
        
        // Simula l'ingoiamento delle particelle una alla volta
        atomConfig.nucleus.forEach((_, idx) => {
          const delay = 300 + idx * 200;
          setTimeout(() => {
            setParticlesConsumed(prev => prev + 1);
          }, delay);
        });
        
        // L'animazione termina dopo che tutte le particelle sono state ingoiate
        const endDelay = 300 + atomConfig.nucleus.length * 200 + 500;
        setTimeout(() => {
          setIsAnimating(false);
        }, endDelay);
        
      }, 1200);
      
    } else if (animationPhase === 'blackhole') {
      // Se è già in modalità buco nero, torna all'atomo solo se l'animazione è completata
      if (!isAnimating) {
        setAnimationPhase('atom');
        setParticlesConsumed(0); // Reset per la prossima volta
      }
    }
  };

  // Genera i punti e il path solo quando siamo sul client
  useEffect(() => {
    const N = 60; // punti per la smoothness
    const cx = 200, cy = 200, r = 30; // nucleo atomico piccolo
    const circlePoints = getCirclePoints(cx, cy, r, N);
    
    setPathData(pointsToPath(circlePoints));
    setIsClient(true);
  }, []);

  // Non renderizzare nulla durante l'SSR o prima che i dati del path siano pronti
  if (!isClient || !pathData) {
    return <div className={`w-full h-full ${className}`}></div>;
  }

  return (
    <div className={`w-full h-full flex items-center justify-center ${className}`} style={{ transform: 'translateX(-80px)' }}>
      <motion.svg
        width="100%"
        height="100%"
        viewBox="-100 -100 600 600"
        style={{ 
          position: 'absolute',
          pointerEvents: isAnimating ? 'none' : 'auto' 
        }}
      >
        {/* Definizione dei filtri */}
        <defs>
          <filter id="atomGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <filter id="blackHoleGlow" x="-200%" y="-200%" width="500%" height="500%" filterUnits="userSpaceOnUse">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feDropShadow dx="0" dy="0" stdDeviation="10" floodColor="#000000" floodOpacity="0.6" result="shadow" />
            <feComposite in="SourceGraphic" in2="shadow" operator="over" />
          </filter>
          
          <radialGradient id="blackHoleGradient" cx="45%" cy="45%" r="70%" gradientUnits="objectBoundingBox">
            <stop offset="0%" stopColor="#000000" stopOpacity="1" />
            <stop offset="20%" stopColor="#0a0a0a" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#1a1a1a" stopOpacity="0.7" />
            <stop offset="60%" stopColor="#2a2a2a" stopOpacity="0.5" />
            <stop offset="80%" stopColor="#404040" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
          
          <ellipse id="gravitationalDistortion" cx="200" cy="200" rx="80" ry="40" fill="url(#blackHoleGradient)" opacity="0.4" />
          
          <radialGradient id="blackHoleCenter" cx="50%" cy="50%" r="50%" gradientUnits="objectBoundingBox">
            <stop offset="0%" stopColor="#000000" />
            <stop offset="100%" stopColor="#000000" />
          </radialGradient>
        </defs>

        {/* Fase 1: Atomo normale */}
        {animationPhase === 'atom' && (
          <motion.g
            key="atom"
            initial={shape === 'circle' ? { opacity: 0, scale: 0 } : false}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* Orbite ellittiche animate e pallini sincronizzati */}
            {atomConfig.orbits.map((orbit, idx) => {
              // Angolo di rotazione corrente per questa orbita
              const angle = orbitAngles[idx];
              // Angolo di posizione corrente per il pallino
              const eAngle = electronAngles[idx];
              // Calcola la posizione del pallino lungo l'ellisse ruotata
              const x = orbit.rx * Math.cos(eAngle);
              const y = orbit.ry * Math.sin(eAngle);
              const rotX = x * Math.cos(angle) - y * Math.sin(angle);
              const rotY = x * Math.sin(angle) + y * Math.cos(angle);
              return (
                <g key={`orbit-${idx}`}> 
                  <ellipse
                    cx={200}
                    cy={200}
                    rx={orbit.rx}
                    ry={orbit.ry}
                    fill="none"
                    stroke="#4B5563"
                    strokeWidth={2}
                    strokeOpacity={0.5}
                    transform={`rotate(${(angle * 180) / Math.PI} 200 200)`}
                  />
                  {/* Elettrone che segue l'orbita, sincronizzato con la rotazione */}
                  <motion.circle
                    r={orbit.electronSize}
                    fill="#4B5563"
                    opacity="0.9"
                    cx={200 + rotX}
                    cy={200 + rotY}
                  />
                  {/* Solo sulla prima orbita, disegna il nucleo */}
                  {idx === 0 && (
                    <>
                      {/* Area cliccabile invisibile attorno al nucleo */}
                      <circle
                        cx="200"
                        cy="200"
                        r="50"
                        fill="transparent"
                        onClick={handleNucleusClick}
                      />
                      {/* Particelle del nucleo */}
                      {atomConfig.nucleus.map((particle, pidx) => (
                        <motion.circle
                          key={`nucleus-${pidx}`}
                          cx={particle.x}
                          cy={particle.y}
                          r={particle.r}
                          fill={particle.color}
                          filter="url(#atomGlow)"
                          onClick={handleNucleusClick}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ 
                            opacity: 1, 
                            scale: 1,
                            x: [0, Math.sin(pidx) * 8, -Math.cos(pidx) * 5, Math.cos(pidx * 2) * 7, 0],
                            y: [0, Math.cos(pidx) * 6, Math.sin(pidx * 2) * 8, -Math.sin(pidx) * 5, 0]
                          }}
                          transition={{ 
                            opacity: { duration: 0.6, delay: 0.6 + pidx * 0.1 },
                            scale: { duration: 0.6, delay: 0.6 + pidx * 0.1, ease: "backOut" },
                            x: { 
                              duration: 3 + pidx % 3, 
                              repeat: Infinity, 
                              repeatType: "reverse",
                              ease: "easeInOut",
                              delay: pidx * 0.2
                            },
                            y: { 
                              duration: 4 + pidx % 2, 
                              repeat: Infinity, 
                              repeatType: "reverse", 
                              ease: "easeInOut",
                              delay: pidx * 0.2
                            }
                          }}
                        />
                      ))}
                    </>
                  )}
                </g>
              );
            })}
          </motion.g>
        )}

        {/* Fase 2: Esplosione degli atomi */}
        {animationPhase === 'explosion' && (
          <motion.g key="explosion">
            {/* Orbite che svaniscono */}
            {atomConfig.orbits.map((orbit, idx) => (
              <motion.ellipse
                key={`orbit-explode-${idx}`}
                cx="200"
                cy="200"
                rx={orbit.rx}
                ry={orbit.ry}
                fill="none"
                stroke="#4B5563"
                strokeWidth={2}
                strokeOpacity={0.5}
                transform={`rotate(${orbit.rotation} 200 200)`}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 0, strokeWidth: 0 }}
                transition={{ duration: 0.4 }}
              />
            ))}
            
            {/* Atomi che si allontanano */}
            {atomConfig.nucleus.map((particle, idx) => (
              <motion.circle
                key={`nucleus-explode-${idx}`}
                cx={particle.x}
                cy={particle.y}
                r={particle.r}
                fill={particle.color}
                filter="url(#atomGlow)"
                initial={{ opacity: 1, scale: 1 }}
                animate={{ 
                  x: explosionDirections[idx].x - particle.x,
                  y: explosionDirections[idx].y - particle.y,
                  opacity: 0.8,
                  scale: 1.2
                }}
                transition={{ 
                  duration: 1.0,
                  delay: explosionDirections[idx].delay,
                  ease: "easeOut"
                }}
              />
            ))}
          </motion.g>
        )}

        {/* Fase 3: Buco nero che risucchia */}
        {animationPhase === 'blackhole' && (
          <motion.g key="blackhole">
            {/* Area cliccabile per disattivare il buco nero */}
            <circle
              cx="200"
              cy="200"
              r="100"
              fill="transparent"
              onClick={handleNucleusClick}
            />
            {/* Buco nero centrale che cresce in base alle particelle ingoiate */}
            <motion.circle
              cx="200"
              cy="200"
              r="30"
              fill="url(#blackHoleCenter)"
              filter="url(#blackHoleGlow)"
              initial={{ scale: 0 }}
              animate={{ 
                scale: particlesConsumed === 0 ? 0 : 0.5 + (particlesConsumed * 0.6), // Cresce con ogni particella
                transition: { 
                  duration: 0.3,
                  ease: "easeOut"
                }
              }}
            />
            
            {/* Alone gravitazionale distorto che ruota lentamente */}
            <motion.ellipse
              cx="200"
              cy="200"
              rx="80"
              ry="40"
              fill="url(#blackHoleGradient)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: particlesConsumed === 0 ? 0 : 0.8 + (particlesConsumed * 0.4), // Cresce con ogni particella
                opacity: particlesConsumed === 0 ? 0 : Math.min(0.4, 0.1 + particlesConsumed * 0.05),
                rotate: 360,
                transition: { 
                  duration: 0.3,
                  ease: "easeOut",
                  rotate: {
                    duration: 15, // 15 secondi per rotazione completa
                    repeat: Infinity,
                    ease: "linear"
                  }
                }
              }}
              style={{ originX: '200px', originY: '200px' }}
            />
            
            {/* Secondo anello di distorsione gravitazionale */}
            <motion.ellipse
              cx="200"
              cy="200"
              rx="60"
              ry="80"
              fill="url(#blackHoleGradient)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: particlesConsumed === 0 ? 0 : 0.6 + (particlesConsumed * 0.3),
                opacity: particlesConsumed === 0 ? 0 : Math.min(0.3, 0.05 + particlesConsumed * 0.04),
                rotate: -360,
                transition: { 
                  duration: 0.3,
                  ease: "easeOut",
                  rotate: {
                    duration: 25, // Rotazione opposta più lenta
                    repeat: Infinity,
                    ease: "linear"
                  }
                }
              }}
              style={{ originX: '200px', originY: '200px' }}
            />
            
            {/* Atomi che vengono risucchiati */}
            {atomConfig.nucleus.map((particle, idx) => (
              <motion.circle
                key={`nucleus-sucked-${idx}`}
                cx={explosionDirections[idx].x}
                cy={explosionDirections[idx].y}
                r={particle.r}
                fill={particle.color}
                filter="url(#atomGlow)"
                initial={{ opacity: 0.8, scale: 1.2 }}
                animate={{ 
                  x: 200 - explosionDirections[idx].x,
                  y: 200 - explosionDirections[idx].y,
                  opacity: 0,
                  scale: 0.1
                }}
                transition={{ 
                  duration: 1.0 + idx * 0.2,
                  delay: 0.3 + idx * 0.1,
                  ease: [0.5, 0.05, 0.5, 0.95]
                }}
              />
            ))}
          </motion.g>
        )}
      </motion.svg>
    </div>
  );
} 