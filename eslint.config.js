import eslint from '@eslint/js'
import nextPlugin from '@next/eslint-plugin-next'
import importPlugin from 'eslint-plugin-import'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import tseslint from 'typescript-eslint'

export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'simple-import-sort': simpleImportSort,
      import: importPlugin,
      '@next/next': nextPlugin
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    settings: {
      react: {
        version: 'detect'
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: '.'
        }
      }
    },
    rules: {
      'react/react-in-jsx-scope': 0,
      'react/display-name': 0,
      'react/prop-types': 0,
      '@typescript-eslint/explicit-function-return-type': 0,
      '@typescript-eslint/explicit-member-accessibility': 0,
      '@typescript-eslint/indent': 0,
      '@typescript-eslint/no-explicit-any': 0,
      '@typescript-eslint/no-var-requires': 0,
      '@typescript-eslint/no-use-before-define': 0,
      '@typescript-eslint/ban-ts-comment': 0,
      '@typescript-eslint/no-namespace': 'off',
      'simple-import-sort/imports': 'warn',
      'simple-import-sort/exports': 'warn',
      'react-hooks/exhaustive-deps': [
        'warn',
        {
          additionalHooks: '(useIsomorphicLayoutEffect)'
        }
      ],
      'react/no-unescaped-entities': 0,
      curly: ['error', 'multi-line'],
      'react/no-unknown-property': [
        'error',
        {
          ignore: [
            'position',
            'rotation',
            'geometry',
            'material',
            'args',
            'object',
            'intensity',
            'scale',
            'rotation-y',
            'dispose',
            'uFillColor',
            'transparent',
            'uTexture',
            'uPixels',
            'uTextureSize',
            'uElementSize',
            'uProgress',
            'uEffectType',
            'uMouse',
            'uPrevMouse'
          ]
        }
      ],
      'no-console': [
        'warn',
        {
          allow: ['warn', 'error']
        }
      ]
    }
  }
]
