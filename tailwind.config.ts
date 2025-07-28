import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'ai-blue': {
          50: '#f0f7ff',
          100: '#e0f0ff',
          200: '#b9e1ff',
          300: '#7cc8ff',
          400: '#36acff',
          500: '#0891f0',
          600: '#0074d9',
          700: '#005cb0',
          800: '#004d91',
          900: '#003d75',
          950: '#002347',
        },
        'ai-dark': {
          50: '#f6f7f9',
          100: '#ebeef3',
          200: '#d3dae4',
          300: '#adbace',
          400: '#8095b3',
          500: '#60779c',
          600: '#4d5f83',
          700: '#3f4d6b',
          800: '#36415a',
          900: '#30384c',
          950: '#1e2332',
        }
      },
      backgroundImage: {
        'ai-gradient': 'linear-gradient(135deg, #003d75 0%, #0074d9 25%, #36acff 50%, #7cc8ff 75%, #b9e1ff 100%)',
        'ai-gradient-reverse': 'linear-gradient(315deg, #003d75 0%, #0074d9 25%, #36acff 50%, #7cc8ff 75%, #b9e1ff 100%)',
        'ai-subtle': 'linear-gradient(135deg, #f0f7ff 0%, #e0f0ff 50%, #b9e1ff 100%)',
        'ai-complex': `
          radial-gradient(circle at 20% 80%, rgba(0, 61, 117, 0.8) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(54, 172, 255, 0.6) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(0, 116, 217, 0.4) 0%, transparent 50%),
          linear-gradient(135deg, #001a33 0%, #002a52 20%, #003d75 40%, #0074d9 60%, #36acff 80%, #7cc8ff 100%)
        `,
        'ai-mesh': `
          conic-gradient(from 45deg at 25% 25%, #003d75, #0074d9, #36acff, #003d75),
          radial-gradient(circle at 75% 75%, rgba(124, 200, 255, 0.3) 0%, transparent 60%),
          linear-gradient(135deg, #001a33 0%, #003d75 50%, #0074d9 100%)
        `,
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-ai': 'pulseAi 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bg-shift': 'backgroundShift 15s ease-in-out infinite',
        'gradient-flow': 'gradientFlow 8s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseAi: {
          '0%, 100%': { 
            opacity: '1',
            boxShadow: '0 0 0 0 rgba(56, 172, 255, 0.7)'
          },
          '50%': { 
            opacity: '0.8',
            boxShadow: '0 0 0 10px rgba(56, 172, 255, 0)'
          },
        },
        backgroundShift: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        gradientFlow: {
          '0%': { 
            filter: 'hue-rotate(0deg) brightness(1)',
          },
          '50%': { 
            filter: 'hue-rotate(3deg) brightness(1.02)',
          },
          '100%': { 
            filter: 'hue-rotate(0deg) brightness(1)',
          },
        }
      }
    },
  },
  plugins: [],
} satisfies Config; 