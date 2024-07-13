import { addIconSelectors } from '@iconify/tailwind'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      transitionProperty: {
        height: 'height, max-height',
        margin: 'margin',
      },
    },
  },
  plugins: [
    addIconSelectors({
      prefixes: ['tabler'],
      maskSelector: '.icon',
      backgroundSelector: '.icon-color',
      extraMaskRules: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
      customise: (content, name, prefix) => {
        switch (prefix) {
          case 'tabler':
            if (name === 'x')
              return content
            else
              return content.replaceAll('stroke-width="2"', 'stroke-width="3"')
        }
        return content
      },
    }),
  ],
}
