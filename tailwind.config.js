/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			animation: {
				marquee: 'marquee 25s linear infinite'
			},
			keyframes: {
				marquee: {
					'0%': { transform: 'translateX(0%)' },
					'100%': { transform: 'translateX(-100%)' }
				}
			},
			fontFamily: {
				heading: ['Montserrat'],
				body: ['Lato']
			}
		}
	},
	// eslint-disable-next-line @typescript-eslint/no-require-imports
	plugins: [require('@tailwindcss/typography'), require('daisyui')],
	daisyui: {
		themes: [
			{
				acid: {
					// eslint-disable-next-line @typescript-eslint/no-require-imports
					...require('daisyui/src/theming/themes')['acid'],
					primary: '#4E63F2',
					secondary: '#C7D9FF',
					accent: '#FF7F50',
					neutral: '#000'
				}
			}
		]
	}
}
