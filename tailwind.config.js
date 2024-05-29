/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./src/**/*.stories.@(js|jsx|ts|tsx)",
    ],
    theme: {
        extend: {
            screens: {
                'min-h-sm': {'raw': '(min-height: 640px)'},
                'min-h-md': {'raw': '(min-height: 768px)'},
                'min-h-lg': {'raw': '(min-height: 1024px)'},
                'min-h-xl': {'raw': '(min-height: 1280px)'},
            },
            animation: {
                'pulse-slow': 'pulse 2s infinite',
                'ping-slow': 'ping 4s cubic-bezier(0, 0, 0.2, 1) 5',
            }
        },
    },
    plugins: [],
}

