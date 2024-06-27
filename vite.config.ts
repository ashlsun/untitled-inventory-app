import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { svelteTesting } from '@testing-library/svelte/vite';

export default defineConfig({
	plugins: [sveltekit(), svelteTesting()],
	test: {
		environment: 'jsdom',
		coverage: {
			provider: 'v8',
			enabled: true
		},
		reporters: ['html', 'default'],
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
