export const SECTION_ID = {
  home: 'home',
  about: 'about',
  works: 'works',
  skills: 'skills',
  projects: 'projects',
  contact: 'contact',
} as const;

export type SectionId = (typeof SECTION_ID)[keyof typeof SECTION_ID];

/** Page order: drives both the header and the vertical dot navigation. */
export const SECTION_ORDER: readonly SectionId[] = [
  SECTION_ID.home,
  SECTION_ID.about,
  SECTION_ID.works,
  SECTION_ID.skills,
  SECTION_ID.projects,
  SECTION_ID.contact,
];

export const HEADER_NAV: readonly { id: SectionId; label: string }[] = [
  { id: SECTION_ID.about, label: 'About' },
  { id: SECTION_ID.works, label: 'Works' },
  { id: SECTION_ID.skills, label: 'Skills' },
  { id: SECTION_ID.projects, label: 'Projects' },
  { id: SECTION_ID.contact, label: 'Contact' },
];
