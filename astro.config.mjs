// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// Staging is GitHub Pages at k8sagentmesh.github.io (project pages → base path
// matches the repo name) until a custom domain is chosen. Swap `site`/`base`
// together when the domain lands.
export default defineConfig({
  site: 'https://k8sagentmesh.github.io',
  base: '/k8sAgentsMesh-website/',
  integrations: [
    starlight({
      title: 'K8sAgentMesh',
      description:
        'The mesh layer for agent teams on Kubernetes — protocol-first communication, discovery, and memory for standing AI agents.',
      favicon: '/favicon.svg',
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
        { label: 'Roadmap', link: '/docs/roadmap' },
        {
          label: 'Concepts',
          autogenerate: { directory: 'concepts' },
        },
      ],
    }),
  ],
});
