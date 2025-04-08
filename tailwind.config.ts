
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
				'lightning': {
					'0%': { 
						opacity: '0',
						filter: 'brightness(0)'
					},
					'5%': { 
						opacity: '0.9',
						filter: 'brightness(1.5)'
					},
					'20%': { 
						opacity: '1',
						filter: 'brightness(2)'
					},
					'40%': { 
						opacity: '0.8',
						filter: 'brightness(1.8)'
					},
					'60%': { 
						opacity: '0.4',
						filter: 'brightness(1.2)'
					},
					'80%': { 
						opacity: '0.2',
						filter: 'brightness(0.8)'
					},
					'100%': { 
						opacity: '0',
						filter: 'brightness(0)'
					}
				},
				'lightning-flash': {
					'0%': {
						opacity: '0',
						filter: 'brightness(1)',
						transform: 'scale(0.95)'
					},
					'5%': {
						opacity: '0.3',
						filter: 'brightness(1.5)',
						transform: 'scale(0.975)'
					},
					'10%': {
						opacity: '0.8',
						filter: 'brightness(2)',
						transform: 'scale(1)'
					},
					'15%': {
						opacity: '1',
						filter: 'brightness(3)',
						transform: 'scale(1.05)'
					},
					'30%': {
						opacity: '0.6',
						filter: 'brightness(2)',
						transform: 'scale(1.02)'
					},
					'50%': {
						opacity: '0.3',
						filter: 'brightness(1.5)',
						transform: 'scale(1)'
					},
					'100%': {
						opacity: '0',
						filter: 'brightness(1)',
						transform: 'scale(0.98)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-light': 'pulse-light 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				'float': 'float 3s ease-in-out infinite',
				'vibrate': 'vibrate 1.5s ease-out forwards',
				'lightning': 'lightning 1s ease-out forwards',
				'lightning-flash': 'lightning-flash 1.5s ease-out forwards'
			}
		}
	},
	plugins: [
		require("tailwindcss-animate"),
		function({ addComponents }) {
			addComponents({
				'.lightning-bolt': {
					position: 'absolute',
					width: '100%',
					height: '100%',
					background: 'transparent',
					pointerEvents: 'none',
					overflow: 'hidden',
					zIndex: 50,
				},
				'.lightning-main': {
					position: 'absolute',
					top: '0',
					left: '50%',
					width: '8px',
					height: '100%',
					background: 'transparent',
					'&::before': {
						content: '""',
						position: 'absolute',
						top: '0',
						left: '0',
						width: '100%',
						height: '100%',
						backgroundColor: '#FFFFFF',
						filter: 'blur(5px)',
						boxShadow: '0 0 20px 2px rgba(30, 174, 219, 0.8), 0 0 40px 6px rgba(59, 130, 246, 0.6)',
						clipPath: 'polygon(50% 0%, 45% 15%, 60% 25%, 40% 40%, 55% 50%, 40% 65%, 60% 75%, 45% 90%, 50% 100%, 53% 93%, 63% 85%, 49% 75%, 68% 65%, 47% 50%, 60% 35%, 43% 25%, 55% 10%)',
					}
				},
				'.lightning-branch-1': {
					position: 'absolute',
					top: '30%',
					left: 'calc(50% + 4px)',
					width: '4px',
					height: '35%',
					background: 'transparent',
					transformOrigin: 'top left',
					transform: 'rotate(25deg)',
					'&::before': {
						content: '""',
						position: 'absolute',
						top: '0',
						left: '0',
						width: '100%',
						height: '100%',
						backgroundColor: '#FFFFFF',
						filter: 'blur(3px)',
						boxShadow: '0 0 15px 2px rgba(30, 174, 219, 0.8)',
						clipPath: 'polygon(50% 0%, 40% 20%, 60% 30%, 30% 50%, 70% 60%, 40% 80%, 60% 100%, 55% 85%, 65% 70%, 40% 60%, 75% 45%, 35% 35%, 65% 20%)',
					}
				},
				'.lightning-branch-2': {
					position: 'absolute',
					top: '60%',
					left: 'calc(50% - 6px)',
					width: '4px',
					height: '25%',
					background: 'transparent',
					transformOrigin: 'top right',
					transform: 'rotate(-35deg)',
					'&::before': {
						content: '""',
						position: 'absolute',
						top: '0',
						left: '0',
						width: '100%',
						height: '100%',
						backgroundColor: '#FFFFFF',
						filter: 'blur(3px)',
						boxShadow: '0 0 15px 2px rgba(30, 174, 219, 0.8)',
						clipPath: 'polygon(50% 0%, 35% 15%, 65% 25%, 30% 45%, 65% 55%, 40% 75%, 55% 100%, 60% 80%, 40% 65%, 70% 50%, 25% 40%, 60% 25%)',
					}
				},
				'.lightning-branch-3': {
					position: 'absolute',
					top: '70%',
					left: 'calc(50% + 2px)',
					width: '3px',
					height: '20%',
					background: 'transparent',
					transformOrigin: 'top left',
					transform: 'rotate(15deg)',
					'&::before': {
						content: '""',
						position: 'absolute',
						top: '0',
						left: '0',
						width: '100%',
						height: '100%',
						backgroundColor: '#FFFFFF',
						filter: 'blur(2px)',
						boxShadow: '0 0 10px 1px rgba(30, 174, 219, 0.8)',
						clipPath: 'polygon(50% 0%, 40% 20%, 65% 25%, 35% 40%, 60% 55%, 45% 70%, 55% 100%, 60% 75%, 45% 60%, 65% 45%, 35% 35%, 60% 25%)',
					}
				},
				'.lightning-flash': {
					position: 'fixed',
					top: '0',
					left: '0',
					width: '100%',
					height: '100%',
					backgroundColor: 'rgba(30, 174, 219, 0.2)',
					pointerEvents: 'none',
					zIndex: 49,
				}
			});
		}
	],
} satisfies Config;
