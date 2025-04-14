import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'
// @ts-ignore
import tailwindAnimate from 'tailwindcss-animate'
// Import plugin properly
import plugin from 'tailwindcss/plugin'

const config = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  safelist: [
    'animate-text-ripple',
    'animate-water-effect',
    'animate-slide-up',
    'animate-logo-ripple',
    'animate-logo-ripple-delay-1',
    'animate-logo-ripple-delay-2',
    'animate-logo-ripple-delay-3',
    'animate-water-drop',
    'animate-water-ripple-1',
    'animate-water-ripple-2',
    'animate-water-ripple-3',
    'text-shadow-blue',
    'opacity-0',
    'opacity-100',
    'scale-95',
    'scale-100',
    'delay-300',
    'delay-500',
    'delay-700',
    'delay-1000',
    'delay-1500',
    'translate-y-16',
    'translate-y-0'
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        '2xl': '1400px',
      },
    },
    fontWeight: {
      light: '300',
      normal: '300',
      medium: '500',
      semibold: '500',
      bold: '700',
    },
    borderRadius: {
      ...defaultTheme.borderRadius,
      '3xl': '1.25rem',
      '4xl': '1.5rem',
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        borderSecondary: 'hsl(var(--border-secondary))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        tvl: 'hsl(var(--tvl))',
        container: {
          DEFAULT: 'hsl(var(--container))',
          foreground: 'hsl(var(--container-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        mutedSecondary: {
          DEFAULT: 'hsl(var(--muted-secondary))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        legend: {
          DEFAULT: 'hsl(var(--legend))',
          foreground: 'hsl(var(--legend-foreground))',
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        'fade-in': {
          '0%': {
            opacity: '0',
          },
          '100%': {
            opacity: '1',
          },
        },
        'fade-out': {
          '0%': {
            opacity: '1',
          },
          '100%': {
            opacity: '0',
          },
        },
        'width-expand': {
          '0%': { transform: 'scaleX(0)', opacity: '0' },
          '100%': { transform: 'scaleX(1)', opacity: '1' },
        },
        'spin-slow': {
          from: {
            transform: 'rotate(0deg)',
          },
          to: {
            transform: 'rotate(360deg)',
          },
        },
        ripple: {
          '0%': { transform: 'scale(0)', opacity: '1' },
          '100%': { transform: 'scale(4)', opacity: '0' }
        },
        // Enhanced water drop effect animation
        waterDrop: {
          '0%': { 
            transform: 'translateY(-20px) scale(0.2)',
            opacity: '0.8'
          },
          '10%': {
            transform: 'translateY(0) scale(0.3)',
            opacity: '1'
          },
          '20%': { 
            transform: 'translateY(0) scale(0.1)',
            opacity: '0.9'
          },
          '100%': { 
            transform: 'translateY(0) scale(0)',
            opacity: '0'
          },
        },
        // Enhanced ripple animations to look more like water ripples
        waterRipple1: {
          '0%': { 
            transform: 'scale(0.2)',
            opacity: '0', 
            borderWidth: '15px',
          },
          '10%': { 
            transform: 'scale(0.3)',
            opacity: '0.7', 
            borderWidth: '10px',
          },
          '100%': { 
            transform: 'scale(3)',
            opacity: '0', 
            borderWidth: '1px',
          }
        },
        waterRipple2: {
          '0%': { 
            transform: 'scale(0.2)',
            opacity: '0', 
            borderWidth: '12px',
          },
          '30%': { 
            transform: 'scale(0.4)',
            opacity: '0.5', 
            borderWidth: '8px',
          },
          '100%': { 
            transform: 'scale(2.5)',
            opacity: '0', 
            borderWidth: '1px',
          }
        },
        waterRipple3: {
          '0%': { 
            transform: 'scale(0.2)',
            opacity: '0', 
            borderWidth: '8px',
          },
          '50%': { 
            transform: 'scale(0.5)',
            opacity: '0.4', 
            borderWidth: '5px',
          },
          '100%': { 
            transform: 'scale(2)',
            opacity: '0', 
            borderWidth: '1px',
          }
        },
        rippleDelayed1: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '25%': { transform: 'scale(0)', opacity: '0.8' },
          '100%': { transform: 'scale(3)', opacity: '0' }
        },
        rippleDelayed2: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '50%': { transform: 'scale(0)', opacity: '0.6' },
          '100%': { transform: 'scale(2)', opacity: '0' }
        },
        rippleDelayed3: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '70%': { transform: 'scale(0)', opacity: '0.4' },
          '100%': { transform: 'scale(1.5)', opacity: '0' }
        },
        // Enhanced text ripple animation
        textRipple: {
          '0%': { 
            opacity: '0', 
            transform: 'scale(0.90)',
            textShadow: '0 0 0 rgba(0, 153, 204, 0)'
          },
          '30%': { 
            opacity: '0.8', 
            transform: 'scale(1.05)',
            textShadow: '0 0 30px rgba(0, 153, 204, 0.8), 0 0 60px rgba(0, 153, 204, 0.5), 0 0 90px rgba(0, 153, 204, 0.3)'
          },
          '60%': { 
            opacity: '1', 
            transform: 'scale(1)',
            textShadow: '0 0 40px rgba(0, 153, 204, 0.7), 0 0 80px rgba(0, 153, 204, 0.4)'
          },
          '100%': { 
            opacity: '1', 
            transform: 'scale(1)',
            textShadow: '0 0 20px rgba(0, 153, 204, 0.5), 0 0 40px rgba(0, 153, 204, 0.2)'
          }
        },
        // Enhanced slide-up animation for the logo with slower timing
        slideUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(80px)'
          },
          '30%': {
            opacity: '0.3',
            transform: 'translateY(60px)'
          },
          '70%': {
            opacity: '0.7',
            transform: 'translateY(20px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        // Enhanced logo ripple effects
        logoRipple: {
          '0%': { 
            transform: 'scale(0.95)', 
            opacity: '0.8',
            filter: 'drop-shadow(0 0 0 rgba(0, 153, 204, 0))'
          },
          '20%': { 
            transform: 'scale(0.98)', 
            opacity: '0.9',
            filter: 'drop-shadow(0 0 5px rgba(0, 153, 204, 0.3)) drop-shadow(0 0 15px rgba(0, 153, 204, 0.1))'
          },
          '50%': { 
            transform: 'scale(1.03)', 
            opacity: '1',
            filter: 'drop-shadow(0 0 15px rgba(0, 153, 204, 0.8)) drop-shadow(0 0 30px rgba(0, 153, 204, 0.4))'
          },
          '80%': { 
            transform: 'scale(1.01)', 
            opacity: '1',
            filter: 'drop-shadow(0 0 12px rgba(0, 153, 204, 0.7)) drop-shadow(0 0 25px rgba(0, 153, 204, 0.3))'
          },
          '100%': { 
            transform: 'scale(1)', 
            opacity: '1',
            filter: 'drop-shadow(0 0 10px rgba(0, 153, 204, 0.5)) drop-shadow(0 0 20px rgba(0, 153, 204, 0.2))'
          }
        },
        logoRippleDelayed1: {
          '0%': { 
            transform: 'scale(0.2)', 
            opacity: '0' 
          },
          '30%': { 
            transform: 'scale(0.6)', 
            opacity: '0.4' 
          },
          '60%': { 
            transform: 'scale(1.0)', 
            opacity: '0.2' 
          },
          '100%': { 
            transform: 'scale(1.8)', 
            opacity: '0' 
          }
        },
        logoRippleDelayed2: {
          '0%': { 
            transform: 'scale(0.2)', 
            opacity: '0' 
          },
          '40%': { 
            transform: 'scale(0.5)', 
            opacity: '0' 
          },
          '60%': { 
            transform: 'scale(0.8)', 
            opacity: '0.3' 
          },
          '100%': { 
            transform: 'scale(1.6)', 
            opacity: '0' 
          }
        },
        logoRippleDelayed3: {
          '0%': { 
            transform: 'scale(0.2)', 
            opacity: '0' 
          },
          '50%': { 
            transform: 'scale(0.4)', 
            opacity: '0' 
          },
          '70%': { 
            transform: 'scale(0.7)', 
            opacity: '0.2' 
          },
          '100%': { 
            transform: 'scale(1.4)', 
            opacity: '0' 
          }
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'spin-slow': 'spin-slow 12s linear infinite',
        'logo-ripple': 'logoRipple 4s ease-out forwards',
        'logo-ripple-delay-1': 'logoRippleDelayed1 6s ease-out 0.5s infinite',
        'logo-ripple-delay-2': 'logoRippleDelayed2 6s ease-out 1.5s infinite',
        'logo-ripple-delay-3': 'logoRippleDelayed3 6s ease-out 2.5s infinite',
        'text-ripple': 'textRipple 3s ease-out forwards',
        'slide-up': 'slideUp 2.5s ease-out forwards',
        'water-drop': 'waterDrop 1.5s ease-out forwards',
        'water-ripple-1': 'waterRipple1 4s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s infinite',
        'water-ripple-2': 'waterRipple2 4s cubic-bezier(0.25, 0.46, 0.45, 0.94) 1.2s infinite',
        'water-ripple-3': 'waterRipple3 4s cubic-bezier(0.25, 0.46, 0.45, 0.94) 2.2s infinite',
      },
    },
  },
  plugins: [
    tailwindAnimate,
    plugin(({ addUtilities }) => {
      const newUtilities = {
        '.text-shadow-blue': {
          textShadow: '0 0 25px rgba(0, 153, 204, 0.8), 0 0 50px rgba(0, 153, 204, 0.5), 0 0 75px rgba(0, 153, 204, 0.3)'
        },
        '.text-shadow-none': {
          textShadow: 'none'
        },
        '.logo-shadow': {
          filter: 'drop-shadow(0 0 20px rgba(0, 153, 204, 0.7)) drop-shadow(0 0 40px rgba(0, 153, 204, 0.4))'
        }
      }
      addUtilities(newUtilities)
    })
  ],
} satisfies Config

export default config
