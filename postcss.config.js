// postcss.config.js - CORRECTED FOR TAILWIND v4+
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    // 'autoprefixer' is no longer needed here as it's included by modern Tailwind
  },
};
