import antfu from '@antfu/eslint-config'

export default antfu({
  svelte: true,
  rules: {
    'svelte/valid-compile': 'off',
    'no-console': 'off',
  },
})
