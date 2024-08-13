/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {}
	},
	// eslint-disable-next-line @typescript-eslint/no-require-imports
	plugins: [require('@tailwindcss/typography'), require('daisyui')],
	daisyui: {
		themes: [
			{
				lofi: {
					// eslint-disable-next-line @typescript-eslint/no-require-imports
					...require('daisyui/src/theming/themes')['lofi'],
					primary: '#4E63F2',
					secondary: '#C7D9FF',
					accent: '#FF7F50'
				}
			},
			'business'
		]
	}
}
