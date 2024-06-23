/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			transitionProperty: {
				height: 'height, max-height',
				margin: 'margin'
			}
		}
	},
	plugins: []
};
