'use client';

import { useState, type ReactNode } from 'react';
import { FEATURES } from '@/app/config/site';
import { useConsoleGreeting } from '@/app/hooks/useConsoleGreeting';
import ConstructionBanner from './ConstructionBanner';
import Header from './Header';
import VerticalSliderNav from './VerticalSliderNav';

/** Initial guess so the first paint doesn't jump before the banner is measured. */
const BANNER_HEIGHT_ESTIMATE = 36;

export default function SiteShell({ children }: { children: ReactNode }) {
  useConsoleGreeting();
  const [measuredBannerHeight, setBannerHeight] = useState(BANNER_HEIGHT_ESTIMATE);
  const bannerHeight = FEATURES.showBanner ? measuredBannerHeight : 0;

  return (
    <>
      {FEATURES.showBanner && <ConstructionBanner onHeightChange={setBannerHeight} />}
      <main className="min-h-screen overflow-x-hidden" style={bannerHeight ? { paddingTop: bannerHeight } : undefined}>
        <Header offsetTop={bannerHeight} />
        <VerticalSliderNav />
        {children}
      </main>
    </>
  );
}
