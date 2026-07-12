import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.{md,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        // Dark "space observatory" palette. `ink` is the foreground and
        // `paper` the page background so every existing ink/paper utility
        // keeps its semantic meaning on the dark theme.
        ink: '#e6e9f5',
        paper: '#060815',
        accent: '#8f8ffc',
        muted: '#9aa1c4',
        rule: '#2a2f4d',
        // Intermediate zinc shade used by the VaporLoop demo (/vaporloop)
        'zinc-850': '#1f1f23',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
