'use client';
import { useCallback, useRef, useState } from 'react';
import Header from './components/layout/Header';
import VerticalSliderNav from './components/layout/VerticalSliderNav';
import ConstructionBanner from './components/layout/ConstructionBanner';
import HeroSection from './components/sections/HeroSection';
import AboutSection from './components/sections/AboutSection';
import WorksSection from './components/sections/WorksSection';
import SkillsSection from './components/sections/SkillsSection';
import ProjectsSection from './components/sections/ProjectsSection';
import ContactSection from './components/sections/ContactSection';
import FooterSection from './components/layout/FooterSection';
import { useExtensionProtection } from './hooks/useExtensionProtection';

const SHOW_BANNER = true;

export default function Home() {
  useExtensionProtection();

  const [bannerHeight, setBannerHeight] = useState(SHOW_BANNER ? 36 : 0);
  const shakeTimeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const activeShakingCardsRef = useRef<string[]>([]);

  const handleShowStack = useCallback((stackIds: string[]) => {
    shakeTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    shakeTimeoutsRef.current = [];

    activeShakingCardsRef.current.forEach(id => {
      const card = document.getElementById(`skill-${id}`);
      if (card) {
        card.classList.add('fading-out');
        card.classList.remove('shaking');
        const fadeTimeout = setTimeout(() => {
          card.classList.remove('fading-out');
        }, 500);
        shakeTimeoutsRef.current.push(fadeTimeout);
      }
    });
    activeShakingCardsRef.current = [];

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

    const scrollTimeout = setTimeout(() => {
      stackIds.forEach((id, index) => {
        const card = document.getElementById(`skill-${id}`);
        if (card) {
          const startTimeout = setTimeout(() => {
            card.classList.remove('fading-out');
            card.classList.add('shaking');
            activeShakingCardsRef.current.push(id);
            
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

  return (
    <>
      <ConstructionBanner visible={SHOW_BANNER} onHeightChange={setBannerHeight} />
      <main className="min-h-screen overflow-x-hidden" style={SHOW_BANNER ? { paddingTop: `${bannerHeight}px` } : undefined}>
        <Header bannerHeight={SHOW_BANNER ? bannerHeight : 0} />
        <VerticalSliderNav />
        <HeroSection />
        <AboutSection />
        <WorksSection />
        <SkillsSection />
        <ProjectsSection onShowStack={handleShowStack} />
        <ContactSection />
        <FooterSection />
      </main>
    </>
  );
}
