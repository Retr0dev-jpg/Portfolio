'use client';
import { useState, useEffect, useCallback } from 'react';
import HeroShape from '../ui/HeroShape';

const skillsData = {
  skill1: ['Full-stack dev', 'Frontend', 'Backend', 'HMI & Web', 'API & sistemi'],
  skill2: ['design minimalista', 'interfacce precise', 'UX/UI design', 'architetture pulite', 'code-first thinking'],
  skill3: ['problem solving', 'debug aggressivo', 'soluzioni eleganti', 'zero bug tolerance', 'pensiero laterale']
} as const;

type SkillKey = keyof typeof skillsData;
const skillIds = Object.keys(skillsData) as SkillKey[];

function AnimatedHeroShape() {
  const shapes = ['circle', 'triangle'] as const;
  const [index, setIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIndex((prev) => (prev + 1) % shapes.length);
  };

  useEffect(() => {
    if (!isAnimating) return;
    const timeout = setTimeout(() => setIsAnimating(false), 1200);
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

export default function HeroSection() {
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

  const rotateWord = useCallback((skillId: SkillKey) => {
    const element = document.getElementById(skillId);
    if (!element) return;

    element.classList.add('flipping');
    
    setTimeout(() => {
      setSkillIndices(prev => ({
        ...prev,
        [skillId]: (prev[skillId] + 1) % skillsData[skillId].length
      }));
      
      setTimeout(() => {
        element.classList.remove('flipping');
      }, 300);
    }, 300);
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
      if (!available.length) return;

      const randomSkill = available[Math.floor(Math.random() * available.length)];
      rotateWord(randomSkill);
    }, 2000);

    return () => clearInterval(interval);
  }, [pausedSkills, rotateWord]);

  return (
    <section id="home" className="min-h-screen min-h-dvh flex items-center bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-xl mx-auto md:mx-0 md:ml-[210px] relative">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
            <span className="text-accent font-mono">
              Retr0<span className="animate-blink">_</span>
            </span>
          </h1>
          <p className="text-base md:text-2xl mb-6 opacity-0 animate-slide-up text-gray-700 skills-container" style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>
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
              <span className="hover-word">Se</span> <span className="hover-word">posso</span> <span className="hover-word">scriptarlo,</span> <span className="hover-word">lo</span> <span className="hover-word">scrivo.</span> <span className="hover-word">Se</span> <span className="hover-word">è</span> <span className="hover-word">moderno,</span> <span className="hover-word">lo</span> <span className="hover-word">costruisco.</span> <span className="hover-word">Sviluppatore</span> <span className="hover-word">full-stack</span> <span className="hover-word">tra</span> <span className="hover-word">il</span> <span className="hover-word">web</span> <span className="hover-word">e</span> <span className="hover-word">i</span> <span className="hover-word">sistemi</span> <span className="hover-word">industriali</span> <span className="hover-word">—</span> <span className="hover-word">ogni</span> <span className="hover-word">progetto</span> <span className="hover-word">è</span> <span className="hover-word">un</span> <span className="hover-word">sistema</span> <span className="hover-word">da</span> <span className="hover-word">capire,</span> <span className="hover-word">ottimizzare</span> <span className="hover-word">e</span> <span className="hover-word">rendere</span> <span className="hover-word">bello.</span> <span className="hover-word">Non</span> <span className="hover-word">creo</span> <span className="hover-word">bug:</span> <span className="hover-word">li</span> <span className="hover-word">trovo</span> <span className="hover-word">prima</span> <span className="hover-word">che</span> <span className="hover-word">diventino</span> <span className="hover-word">feature.</span>
            </p>
          </div>
          <AnimatedHeroShape />
        </div>
      </div>
    </section>
  );
}
