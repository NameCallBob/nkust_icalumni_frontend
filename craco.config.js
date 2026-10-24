// CRACO — 讓 CRA(react-scripts 5) 套用 Tailwind 的 PostCSS 設定。
// CRA 的 postcss-loader 設了 config:false（忽略根 postcss.config.js），
// 因此必須在此強制把 tailwindcss/autoprefixer 注入 postcss-loader 的 plugins。
const path = require('path');

module.exports = {
  webpack: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  jest: {
    configure: (config) => {
      config.moduleNameMapper = { ...config.moduleNameMapper, '^@/(.*)$': '<rootDir>/src/$1',
        // Jest 27 不支援 package.json exports 子路徑；Radix 內部用到這個。
        '^@radix-ui/primitive/is-development$': '<rootDir>/node_modules/@radix-ui/primitive/dist/internal/is-development.true.js',
      };
      return config;
    },
  },
  style: {
    postcss: {
      mode: 'extends',
      loaderOptions: (opts) => {
        opts.postcssOptions = opts.postcssOptions || {};
        const existing = opts.postcssOptions.plugins || [];
        opts.postcssOptions.plugins = [
          require('tailwindcss'),
          require('autoprefixer'),
          ...existing,
        ];
        return opts;
      },
    },
  },
};
