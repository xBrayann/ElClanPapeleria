import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'productos/:id',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => {
      // TODO: Replace with actual product IDs fetching logic
      // For now, return an empty array or static list of IDs
      return [
        { id: '1' },
        { id: '2' },
        { id: '3' }
      ];
    }
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
