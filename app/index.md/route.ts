import { estimateTokens, renderSiteMarkdown } from '@/app/lib/siteMarkdown';

export const dynamic = 'force-static';

export function GET() {
  const markdown = renderSiteMarkdown();
  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'x-markdown-tokens': String(estimateTokens(markdown)),
    },
  });
}
