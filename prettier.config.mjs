/** @typedef  {import('prettier').Config} PrettierConfig*/
/** @typedef  {import('@ianvs/prettier-plugin-sort-imports').PluginConfig} SortImportsConfig*/
/** @typedef  {import('prettier-plugin-tailwindcss').PluginOptions} TailwindConfig*/

/** @type { PrettierConfig | SortImportsConfig | TailwindConfig } */
const config = {
  arrowParens: 'always',
  printWidth: 80,
  singleQuote: true,
  jsxSingleQuote: true,
  semi: true,
  trailingComma: 'none',
  tabWidth: 2,
  plugins: [
    '@ianvs/prettier-plugin-sort-imports',
    'prettier-plugin-tailwindcss'
  ],
  tailwindConfig: './tailwind.config.ts',
  importOrder: [
    '^(react/(.*)$)|^(react$)',
    '^(next/(.*)$)|^(next$)',
    '<THIRD_PARTY_MODULES>',
    '',
    '^@/',
    '',
    '^[../]',
    '^[./]'
  ],
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
  importOrderTypeScriptVersion: '5.3.3'
};

export default config;
