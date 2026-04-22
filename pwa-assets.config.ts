import {
  defineConfig,
  minimal2023Preset,
} from '@vite-pwa/assets-generator/config';

export default defineConfig({
  preset: {
    ...minimal2023Preset,
    transparent: {
      ...minimal2023Preset.transparent,
      padding: 0,
    },
    maskable: {
      ...minimal2023Preset.maskable,
      padding: 0,
    },
    apple: {
      sizes: [180],
      padding: 0,
    },
  },
  images: ['public/icons/LOGO.svg'],
});
