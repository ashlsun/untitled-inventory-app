import antfu from '@antfu/eslint-config'

export default antfu({
  svelte: true,
  rules: {
    'svelte/valid-compile': 'off',
    'no-console': 'off',
    'svelte/html-quotes': ['warn', { prefer: 'double' }],
    'curly': ['warn', 'multi-or-nest', 'consistent'],
  },
})
