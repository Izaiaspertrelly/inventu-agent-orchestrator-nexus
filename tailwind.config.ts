
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Custom colors for Inventu Super Agent
				inventu: {
					primary: '#007AFF', // Apple blue
					secondary: '#5AC8FA', // Apple light blue
					accent: '#30B0C7', // Blue-teal
					background: '#000000', // Dark background
					foreground: '#FFFFFF', // White text
					muted: '#86868B', // Apple gray
					border: '#1D1D1F', // Apple dark gray
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'pulse-light': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.5' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'vibrate': {
					'0%': { transform: 'translateX(0)' },
					'5%': { transform: 'translateX(-6px) rotate(-3deg)' },
					'10%': { transform: 'translateX(6px) rotate(3deg)' },
					'15%': { transform: 'translateX(-6px) rotate(-3deg)' },
					'20%': { transform: 'translateX(6px) rotate(3deg)' },
					'25%': { transform: 'translateX(0) rotate(0)' },
					'100%': { transform: 'translateX(0)' }
				},
				'border-glow': {
					'0%': { 
						'box-shadow': '0 0 15px 5px rgba(21, 169, 255, 0.5)',
						'background-position': '0% 0%'
					},
					'25%': { 
						'box-shadow': '0 0 20px 5px rgba(33, 150, 243, 0.6)',
						'background-position': '100% 0%'
					},
					'50%': { 
						'box-shadow': '0 0 25px 5px rgba(41, 128, 255, 0.7)',
						'background-position': '100% 100%'
					},
					'75%': { 
						'box-shadow': '0 0 20px 5px rgba(63, 131, 255, 0.6)',
						'background-position': '0% 100%'
					},
					'100%': {
						'box-shadow': '0 0 15px 5px rgba(21, 169, 255, 0.5)',
						'background-position': '0% 0%'
					}
				},
				'input-glow': {
					'0%': { 
						'box-shadow': '0 0 5px 1px rgba(33, 150, 243, 0.3)',
						'border-color': 'rgba(33, 150, 243, 0.3)'
					},
					'50%': { 
						'box-shadow': '0 0 8px 2px rgba(21, 169, 255, 0.5)',
						'border-color': 'rgba(21, 169, 255, 0.5)'
					},
					'100%': { 
						'box-shadow': '0 0 5px 1px rgba(33, 150, 243, 0.3)',
						'border-color': 'rgba(33, 150, 243, 0.3)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-light': 'pulse-light 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				'float': 'float 3s ease-in-out infinite',
				'vibrate': 'vibrate 1.5s ease-out forwards',
				'border-glow': 'border-glow 6s linear infinite',
				'input-glow': 'input-glow 3s ease-in-out infinite'
			}
		}
	},
	plugins: [
		require("tailwindcss-animate")
	],
} satisfies Config;
