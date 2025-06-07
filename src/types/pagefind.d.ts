declare module '/pagefind/pagefind.js' {
  export interface PagefindUI {
    new (options: {
      element: string;
      showSubResults?: boolean;
      highlightParam?: string;
      excerptLength?: number;
      resetStyles?: boolean;
      showImages?: boolean;
      translations?: Record<string, string>;
    }): void;
  }

  export function options(opts: {
    baseUrl?: string;
    excerptLength?: number;
    highlightParam?: string;
  }): Promise<void>;

  export const PagefindUI: PagefindUI;
} 