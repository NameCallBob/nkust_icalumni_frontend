// CRACO — 讓 CRA(react-scripts 5) 套用 Tailwind 的 PostCSS 設定。
// CRA 的 postcss-loader 設了 config:false（忽略根 postcss.config.js），
// 因此必須在此強制把 tailwindcss/autoprefixer 注入 postcss-loader 的 plugins。
module.exports = {
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
