/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'muted-pastel': 'linear-gradient(135deg, #e0e7ff 0%, #f3e8ff 100%)',
        'muted-pink': 'linear-gradient(135deg, #ffe0f0 0%, #e0e7ff 100%)',
        'muted-green': 'linear-gradient(135deg, #d1fae5 0%, #e0f2fe 100%)',
      },
      colors: {
        pastelBlue: '#e0e7ff',
        pastelPurple: '#f3e8ff',
        pastelPink: '#ffe0f0',
        pastelGreen: '#d1fae5',
        pastelYellow: '#fef9c3',
        mutedGray: '#f3f4f6',
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans KR', 'Pretendard', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
} 