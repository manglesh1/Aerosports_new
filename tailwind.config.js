/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      /* COLORS */
      colors: {
        neon: {
          pink: '#FF1152',
          'pink-dark': '#F00C74',
          green: '#39FF14',
          'green-bright': '#CAFF1A',
          purple: '#9D4EDD',
          blue: '#00D9FF',
          orange: '#FF6B35',
        },
        dark: {
          50: '#FFFFFF',
          100: '#E0E0E0',
          200: '#A0A0A0',
          300: '#707070',
          400: '#505050',
          500: '#303030',
          600: '#1a1a1a',
          700: '#0a0a0a',
          800: '#050505',
          900: '#000000',
        },
      },

      /* SPACING */
      spacing: {
        xs: 'var(--space-xs)',
        sm: 'var(--space-sm)',
        md: 'var(--space-md)',
        lg: 'var(--space-lg)',
        xl: 'var(--space-xl)',
        '2xl': 'var(--space-2xl)',
        '3xl': 'var(--space-3xl)',
        '4xl': 'var(--space-4xl)',
        '5xl': 'var(--space-5xl)',
      },

      /* BORDER RADIUS */
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
      },

      /* BOX SHADOWS */
      boxShadow: {
        'glow-pink': 'var(--shadow-glow-pink)',
        'glow-pink-lg': 'var(--shadow-glow-pink-lg)',
        'glow-green': 'var(--shadow-glow-green)',
        'glow-green-lg': 'var(--shadow-glow-green-lg)',
        'glow-combined': 'var(--shadow-glow-combined)',
        card: 'var(--shadow-card)',
        'card-elevated': 'var(--shadow-card-elevated)',
      },

      /* TYPOGRAPHY */
      fontFamily: {
        sans: "var(--font-family)",
        display: "var(--font-bebas), sans-serif",
      },

      fontSize: {
        xs: ['var(--font-size-xs)', { lineHeight: 'var(--line-height-tight)' }],
        sm: ['var(--font-size-sm)', { lineHeight: 'var(--line-height-snug)' }],
        base: ['var(--font-size-md)', { lineHeight: 'var(--line-height-normal)' }],
        lg: ['var(--font-size-lg)', { lineHeight: 'var(--line-height-normal)' }],
        xl: ['var(--font-size-xl)', { lineHeight: 'var(--line-height-snug)' }],
        '2xl': ['var(--font-size-2xl)', { lineHeight: 'var(--line-height-snug)' }],
        '3xl': ['var(--font-size-3xl)', { lineHeight: 'var(--line-height-tight)' }],
        '4xl': ['var(--font-size-4xl)', { lineHeight: 'var(--line-height-tight)' }],
      },

      fontWeight: {
        light: 'var(--font-weight-light)',
        normal: 'var(--font-weight-regular)',
        medium: 'var(--font-weight-medium)',
        semibold: 'var(--font-weight-semibold)',
        bold: 'var(--font-weight-bold)',
        extrabold: 'var(--font-weight-extrabold)',
      },

      letterSpacing: {
        tight: 'var(--letter-spacing-tight)',
        normal: 'var(--letter-spacing-normal)',
        wide: 'var(--letter-spacing-wide)',
        wider: 'var(--letter-spacing-wider)',
        widest: 'var(--letter-spacing-widest)',
      },

      lineHeight: {
        tight: 'var(--line-height-tight)',
        snug: 'var(--line-height-snug)',
        normal: 'var(--line-height-normal)',
        relaxed: 'var(--line-height-relaxed)',
      },

      /* ANIMATIONS */
      animation: {
        'fade-in': 'fadeIn 0.6s var(--ease-in-out) forwards',
        'fade-in-up': 'fadeInUp 0.6s var(--ease-in-out) forwards',
        'fade-in-down': 'fadeInDown 0.6s var(--ease-in-out) forwards',
        'fade-in-left': 'fadeInLeft 0.6s var(--ease-in-out) forwards',
        'fade-in-right': 'fadeInRight 0.6s var(--ease-in-out) forwards',
        'slide-in-left': 'slideInLeft 0.6s var(--ease-out-cubic) forwards',
        'slide-in-right': 'slideInRight 0.6s var(--ease-out-cubic) forwards',
        'scale-in': 'scaleIn 0.6s var(--ease-in-out) forwards',
        'scale-in-up': 'scaleInUp 0.6s var(--ease-out-bounce) forwards',
        float: 'float 3s ease-in-out infinite',
        'float-slow': 'floatSlow 4s ease-in-out infinite',
        pulse: 'pulse 2s var(--ease-in-out) infinite',
        'pulse-shadow': 'pulseShadow 2s var(--ease-in-out) infinite',
        bounce: 'bounce 2s ease-in-out infinite',
        spin: 'spin 2s linear infinite',
        wiggle: 'wiggle 0.5s ease-in-out infinite',
        flip: 'flip 1s linear infinite',
      },

      /* TRANSITIONS */
      transitionDuration: {
        fast: 'var(--duration-fast)',
        base: 'var(--duration-base)',
        slow: 'var(--duration-slow)',
      },

      transitionTimingFunction: {
        'out-cubic': 'var(--ease-out-cubic)',
        'out-bounce': 'var(--ease-out-bounce)',
        'in-out': 'var(--ease-in-out)',
      },

      /* Z-INDEX */
      zIndex: {
        hide: 'var(--z-hide)',
        base: 'var(--z-base)',
        dropdown: 'var(--z-dropdown)',
        sticky: 'var(--z-sticky)',
        fixed: 'var(--z-fixed)',
        'modal-backdrop': 'var(--z-modal-backdrop)',
        modal: 'var(--z-modal)',
        tooltip: 'var(--z-tooltip)',
        notification: 'var(--z-notification)',
      },

      /* SCREEN SIZES */
      screens: {
        xs: '320px',
        sm: '480px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1400px',
      },

      /* CUSTOM UTILITIES */
      clipPath: {
        'button': 'polygon(8% 0, 100% 0, 92% 100%, 0 100%)',
        'diagonal-right': 'polygon(0 0, 100% 0, 85% 100%, 0% 100%)',
        'diagonal-left': 'polygon(0 0, 100% 0, 100% 100%, 15% 100%)',
      },

      /* BACKDROP FILTER */
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '10px',
        lg: '18px',
        xl: '25px',
      },

      /* CONTAINER */
      maxWidth: {
        container: '1400px',
      },
    },
  },

  /* PLUGINS */
  plugins: [
    /* Custom plugin for parallax utilities */
    function ({ addUtilities, theme }) {
      const parallaxUtilities = {
        '.parallax-none': {
          'transform': 'translateZ(0)',
        },
        '.parallax-slow': {
          'transform': 'translateY(var(--parallax-offset, 0px))',
        },
        '.parallax-medium': {
          'transform': 'translateY(calc(var(--parallax-offset, 0px) * 0.5))',
        },
        '.parallax-fast': {
          'transform': 'translateY(calc(var(--parallax-offset, 0px) * 0.25))',
        },
      };

      addUtilities(parallaxUtilities);
    },

    /* Custom plugin for glow utilities */
    function ({ addUtilities, theme }) {
      const glowUtilities = {
        '.glow-pink': {
          'box-shadow': 'var(--shadow-glow-pink)',
        },
        '.glow-pink-lg': {
          'box-shadow': 'var(--shadow-glow-pink-lg)',
        },
        '.glow-green': {
          'box-shadow': 'var(--shadow-glow-green)',
        },
        '.glow-green-lg': {
          'box-shadow': 'var(--shadow-glow-green-lg)',
        },
        '.glow-combined': {
          'box-shadow': 'var(--shadow-glow-combined)',
        },
        '.hover-glow-pink': {
          'transition': 'box-shadow var(--duration-base) var(--ease-in-out)',

          '&:hover': {
            'box-shadow': 'var(--shadow-glow-pink-lg)',
          },
        },
        '.hover-glow-green': {
          'transition': 'box-shadow var(--duration-base) var(--ease-in-out)',

          '&:hover': {
            'box-shadow': 'var(--shadow-glow-green-lg)',
          },
        },
      };

      addUtilities(glowUtilities);
    },

    /* Custom plugin for interactive utilities */
    function ({ addUtilities, theme }) {
      const interactiveUtilities = {
        '.hover-lift': {
          'transition': 'transform var(--duration-base) var(--ease-out-bounce), box-shadow var(--duration-base) var(--ease-in-out)',

          '&:hover': {
            'transform': 'translateY(-10px)',
            'box-shadow': 'var(--shadow-card-elevated)',
          },
        },
        '.hover-scale-105': {
          'transition': 'transform var(--duration-base) var(--ease-out-bounce)',

          '&:hover': {
            'transform': 'scale(1.05)',
          },
        },
        '.hover-shift-right': {
          'transition': 'transform var(--duration-base) var(--ease-in-out)',

          '&:hover': {
            'transform': 'translateX(5px)',
          },
        },
        '.active-scale-95': {
          'transition': 'transform var(--duration-fast)',

          '&:active': {
            'transform': 'scale(0.95)',
          },
        },
      };

      addUtilities(interactiveUtilities);
    },
  ],
};
