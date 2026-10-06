import dynamic from 'next/dynamic';
import SiteShell from './components/layout/SiteShell';
import FooterSection from './components/layout/FooterSection';
import HeroSection from './components/sections/HeroSection';
import AboutSection from './components/sections/AboutSection';
import WorksSection from './components/sections/WorksSection';
import SkillsSection from './components/sections/SkillsSection';
import ContactSection from './components/sections/ContactSection';
import { StackHighlightProvider } from './context/StackHighlightContext';

const ProjectsSection = dynamic(() => import('./components/sections/ProjectsSection'));

export default function Home() {
  return (
    <SiteShell>
      <HeroSection />
      <AboutSection />
      <WorksSection />
      {/* Projects can highlight the matching skill cards. */}
      <StackHighlightProvider>
        <SkillsSection />
        <ProjectsSection />
      </StackHighlightProvider>
      <ContactSection />
      <FooterSection />
    </SiteShell>
  );
}
