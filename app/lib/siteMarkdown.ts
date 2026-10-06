import { SITE } from '@/app/config/site';
import { ABOUT } from '@/app/data/about';
import { CONTACT_INTRO } from '@/app/data/contact';
import { EXPERIENCES, type Experience } from '@/app/data/experiences';
import { HERO_TAGLINE, ROTATING_WORD_GROUPS } from '@/app/data/hero';
import { SECTION_ID } from '@/app/data/navigation';
import { PROJECTS, type Project, type ProjectTarget } from '@/app/data/projects';
import { SKILLS, type StackId } from '@/app/data/skills';

export const MARKDOWN_PATH = '/index.md';

const absoluteUrl = (path: string) => new URL(path, SITE.url).href;
const link = (label: string, url: string) => `[${label}](${url})`;
const sectionUrl = (id: string) => `${SITE.url}/#${id}`;

const SKILL_NAME = new Map<StackId, string>(SKILLS.map((skill) => [skill.id, skill.name]));

function targetLine(target: ProjectTarget): string {
  if (target.kind === 'external') return `- Link: ${link(target.url, target.url)}`;
  if (target.kind === 'scroll-top') return `- Link: ${link(SITE.url, SITE.url)} (questo sito)`;
  return '- Link: in arrivo';
}

function renderExperience(experience: Experience): string {
  const lines = [
    `### ${experience.role} — ${experience.organization}`,
    '',
    `*${experience.periodLong}*`,
    '',
    experience.description,
    '',
    `- Ambiti: ${experience.tags.join(', ')}`,
  ];
  if (experience.links?.length) {
    lines.push('- Link:');
    for (const { label, url, comingSoon } of experience.links) {
      lines.push(`  - ${link(label, url)}${comingSoon ? ' (in arrivo)' : ''}`);
    }
  }
  return lines.join('\n');
}

function renderProject(project: Project): string {
  return [
    `### ${project.name}${project.paid ? ' (lavoro su commissione)' : ''}`,
    '',
    project.description,
    '',
    `- Tecnologie: ${project.tags.join(', ')}`,
    `- Aree dello stack: ${project.stack.map((id) => SKILL_NAME.get(id) ?? id).join(', ')}`,
    targetLine(project.target),
  ].join('\n');
}

/** Agent-facing Markdown version of the home page, built from the same data as the UI. */
export function renderSiteMarkdown(): string {
  const cvLine = `- CV (PDF): ${link('scarica', absoluteUrl(SITE.cv.href))}${SITE.cv.updatedAt ? ` (aggiornato al ${SITE.cv.updatedAt})` : ''}`;

  return [
    `# ${SITE.brand} — ${SITE.owner}`,
    '',
    `> ${ROTATING_WORD_GROUPS[0].join(' · ')}`,
    '',
    HERO_TAGLINE,
    '',
    `Sito: ${link(SITE.url, SITE.url)}`,
    '',
    `## About`,
    '',
    ...ABOUT.paragraphs.flatMap((paragraph) => [paragraph, '']),
    `*${ABOUT.motto}*`,
    '',
    `## Esperienze`,
    '',
    EXPERIENCES.map(renderExperience).join('\n\n'),
    '',
    `## Skills`,
    '',
    ...SKILLS.map((skill) => `- **${skill.name}**: ${skill.icons.map((icon) => icon.name).join(', ')}`),
    '',
    `## Progetti`,
    '',
    PROJECTS.map(renderProject).join('\n\n'),
    '',
    `## Contatti`,
    '',
    CONTACT_INTRO.description,
    '',
    `- Form di contatto: ${link(sectionUrl(SECTION_ID.contact), sectionUrl(SECTION_ID.contact))}`,
    `- LinkedIn: ${link(SITE.socials.linkedin.label, SITE.socials.linkedin.url)}`,
    `- GitHub: ${link(SITE.socials.github.label, SITE.socials.github.url)}`,
    cvLine,
    '',
    '---',
    '',
    `Codice sorgente: ${link(SITE.repository.slug, SITE.repository.url)} · Licenza ${link(SITE.license.name, SITE.license.url)}`,
    '',
  ].join('\n');
}

/** Rough estimate (~4 characters per token), as exposed by Cloudflare's `x-markdown-tokens`. */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}
