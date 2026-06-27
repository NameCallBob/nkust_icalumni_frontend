/** @type {import('tailwindcss').Config} */
// Tailwind v3 + DaisyUI v4 — NKUST 校友系統深藍主題
// Bootstrap 已完全移除 → preflight 開啟，提供完整 CSS base reset（新 UI 設計地基）。
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  corePlugins: {
    preflight: true,
  },
  theme: {
    extend: {
      fontFamily: {
        // 全站統一使用 Noto Sans TC（含原本用 font-serif 的標題）
        sans: ['Noto Sans TC', 'Microsoft JhengHei', 'sans-serif'],
        serif: ['Noto Sans TC', 'Microsoft JhengHei', 'sans-serif'],
      },
      colors: {
        navy: {
          900: '#0f172a', // near-black navy
          800: '#1e293b',
          700: '#1e40af',
          600: '#1e3a8a', // 主深藍
          500: '#3b82f6',
        },
        gold: {
          600: '#a0781c',
          400: '#c9a84c',
        },
      },
      boxShadow: {
        modal: '0 24px 60px -12px rgba(15,23,42,.45), 0 4px 16px rgba(30,58,138,.15)',
      },
      backdropBlur: { xs: '2px' },
      keyframes: {
        modalIn: {
          '0%': { opacity: '0', transform: 'translateY(16px) scale(.96)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
      animation: {
        modalIn: 'modalIn .3s cubic-bezier(0,0,0.2,1)',
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    logs: false,
    themes: [
      {
        nkust: {
          primary: '#1e3a8a', // 深藍 - 學術權威
          'primary-content': '#ffffff',
          secondary: '#a0781c', // 沉穩金 - 榮譽點綴
          'secondary-content': '#ffffff',
          accent: '#0f766e', // 深綠 - 專業穩重
          'accent-content': '#ffffff',
          neutral: '#0f172a', // near-black navy
          'neutral-content': '#ffffff',
          'base-100': '#ffffff',
          'base-200': '#f8fafc',
          'base-300': '#e2e8f0',
          'base-content': '#0f172a',
          info: '#0284c7',
          success: '#059669',
          warning: '#d97706',
          error: '#dc2626',
          '--rounded-box': '1rem',
          '--rounded-btn': '0.5rem',
          '--rounded-badge': '0.375rem',
          '--animation-btn': '0.25s',
          '--border-btn': '1px',
        },
      },
    ],
  },
};
