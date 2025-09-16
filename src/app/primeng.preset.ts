import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

export const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      700: 'var(--primary-color)',
    },
    colorScheme: {
      // light: {
      //   surface: {
      //     0: '#ffffff',
      //     50: '{zinc.50}',
      //     100: '{zinc.100}',
      //     200: '{zinc.200}',
      //     300: '{zinc.300}',
      //     400: '{zinc.400}',
      //     500: '{zinc.500}',
      //     600: '{zinc.600}',
      //     700: '{zinc.700}',
      //     800: '{zinc.800}',
      //     900: '{zinc.900}',
      //     950: '{zinc.950}',
      //   },
      //   primary: {
      //     color: '{zinc.950}',
      //     inverseColor: '#ffffff',
      //     hoverColor: '{zinc.900}',
      //     activeColor: '{zinc.800}',
      //   },
      //   highlight: {
      //     background: '{zinc.950}',
      //     focusBackground: '{zinc.700}',
      //     color: '#ffffff',
      //     focusColor: '#ffffff',
      //   },
      //   formField: {
      //     hoverBorderColor: '{primary.color}',
      //   },
      // },
      dark: {
        surface: {
          0: '#ffffff',
          50: '{slate.50}',
          100: '{slate.100}',
          200: '{slate.200}',
          300: '{slate.300}',
          400: '{slate.400}',
          500: '{slate.500}',
          600: '{slate.600}',
          700: '{slate.700}',
          800: '{slate.800}',
          900: '#000000ff',
          950: '{slate.950}',
        },
        primary: {
          color: 'var(--primary-color)',
          inverseColor: '{zinc.950}',
          hoverColor: 'var(--primary-color)',
          activeColor: 'var(--primary-color)',

        },

        highlight: {
          background: 'rgba(250, 250, 250, .16)',
          focusBackground: 'rgba(250, 250, 250, .24)',
          color: 'rgba(255,255,255,.87)',
          focusColor: 'rgba(255,255,255,.87)',
        },
        formField: {
          borderColor: 'var(--primary-color)',
          focusBorderColor: 'var(--primary-color)',
        },
        input: {
          borderColor: 'var(--primary-color)',
          focusBorderColor: 'var(--primary-color)',
          hoverBorderColor: 'var(--primary-color)',
          focusHoverBorderColor: 'var(--primary-color)',
        },
      },
    },
  },
});
