import tseslint from 'typescript-eslint';

export default [
  ...tseslint.configs.recommended,
  {
    ignores: [
      'dist',
      'src-tauri',
      'src/components/ui',
      'src/components/{mode-toggle.tsx,theme-provider.tsx}',
    ],
  },
];
