// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import mermaid from 'astro-mermaid';

// Brand-aligned Mermaid theme (board-directed visual standards: every diagram
// is Mermaid or SVG, legible in light AND dark). astro-mermaid renders
// client-side and auto-switches mermaid 'default' (light) / 'dark' per the
// page's data-theme. The variables below pin the brand palette onto every
// diagram surface:
//   - shapes are self-contained dark-navy surfaces with light text, so they
//     read identically on both canvases,
//   - strokes that sit on the page canvas use mid-teal #0E7490 (>=3:1 on both
//     the light and dark canvases),
//   - text that sits directly on the page canvas (sequence numbers, signal
//     text, diagram titles) is deliberately left to the active mermaid theme,
//     which is dark-on-light / light-on-dark.
const MERMAID_THEME_VARIABLES = {
  fontFamily:
    'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  // flowchart / generic
  primaryColor: '#0B1220',
  primaryTextColor: '#E8ECF5',
  primaryBorderColor: '#2DD4BF',
  secondaryColor: '#111521',
  secondaryTextColor: '#C4CCDE',
  secondaryBorderColor: '#38BDF8',
  tertiaryColor: '#1A2032',
  tertiaryTextColor: '#C4CCDE',
  tertiaryBorderColor: '#4A556E',
  lineColor: '#0E7490',
  textColor: '#E8ECF5',
  nodeBorder: '#2DD4BF',
  clusterBkg: '#111521',
  clusterBorder: '#2DD4BF',
  edgeLabelBackground: '#0B1220',
  labelBackgroundColor: '#0B1220',
  noteBkgColor: '#1A2032',
  noteTextColor: '#C4CCDE',
  noteBorderColor: '#38BDF8',
  // stateDiagram-v2
  mainBkg: '#0B1220',
  stateBkg: '#0B1220',
  stateBorder: '#2DD4BF',
  stateLabelColor: '#E8ECF5',
  transitionColor: '#0E7490',
  transitionLabelColor: '#E8ECF5',
  specialStateColor: '#2DD4BF',
  innerEndBackground: '#2DD4BF',
  compositeTitleBackground: '#111521',
  compositeBackground: '#111521',
  altBackground: '#1A2032',
  // sequence
  actorBkg: '#0B1220',
  actorTextColor: '#E8ECF5',
  actorLineColor: '#4A556E',
  actorBorder: '#2DD4BF',
  signalColor: '#0E7490',
  labelBoxBkgColor: '#0B1220',
  labelTextColor: '#E8ECF5',
  labelBoxBorderColor: '#2DD4BF',
  loopTextColor: '#E8ECF5',
  activationBkgColor: '#1A2032',
  activationBorderColor: '#38BDF8',
};

// Staging is GitHub Pages at k8sagentmesh.github.io (project pages → base path
// matches the repo name) until a custom domain is chosen. Swap `site`/`base`
// together when the domain lands.
export default defineConfig({
  site: 'https://k8sagentmesh.github.io',
  base: '/k8sAgentsMesh-website/',
  integrations: [
    // mermaid must come before starlight (markdown transform order).
    mermaid({
      theme: 'default',
      autoTheme: true,
      enableLog: false,
      mermaidConfig: {
        themeVariables: MERMAID_THEME_VARIABLES,
        flowchart: { htmlLabels: true, curve: 'basis' },
      },
    }),
    starlight({
      title: 'K8sAgentMesh',
      description:
        'The mesh layer for agent teams on Kubernetes — protocol-first communication, discovery, and memory for standing AI agents.',
      favicon: '/favicon.svg',
      logo: {
        // Horizontal lockup in the header. Full-color on the dark header,
        // monochrome-dark on light surfaces (brand guide §1). Starlight
        // resolves these via Vite from the project root.
        dark: './brand/logos/k8sagentmesh-lockup-horizontal.svg',
        light: './brand/logos/k8sagentmesh-lockup-mono-dark.svg',
        alt: 'K8sAgentMesh',
      },
      customCss: ['./src/styles/theme.css'],
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/K8sAgentMesh' },
      ],
      head: [
        // Dark mode is the default experience. Starlight follows the system
        // preference; this tiny inline script runs before first paint and
        // seeds the stored theme to dark when the visitor has no preference.
        {
          tag: 'script',
          attrs: { 'is:inline': true },
          content:
            "try{if(localStorage.getItem('starlight-theme')===null){localStorage.setItem('starlight-theme','dark');document.documentElement.setAttribute('data-theme','dark');}}catch(e){}",
        },
      ],
      sidebar: [
        { label: 'Overview', link: '/docs/' },
        { label: 'Quickstart', link: '/docs/quickstart' },
        { label: 'Prerequisites', link: '/docs/prerequisites' },
        { label: 'Roadmap', link: '/docs/roadmap' },
        { label: 'Host integration', link: '/docs/host-integration' },
        {
          label: 'Concepts',
          autogenerate: { directory: 'concepts' },
        },
        {
          label: 'Blog & changelog',
          autogenerate: { directory: 'blog' },
        },
        { label: 'Community', link: '/community/' },
        { label: 'Contributing', link: '/community/contributing' },
      ],
    }),
  ],
});
