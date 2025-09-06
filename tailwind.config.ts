import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                "primary": '#000000',
                "secondary": '#111111',
                "bg-primary": '#fff',
                "bg-secondary": '#f5f5f5',
                "text-primary": '#000',
                "text-secondary": '#111',
                "text-tertiary": '#333',
                "text-quaternary": '#555',
                "text-quinary": '#777',
                "text-senary": '#999'
            }
        },
    },
    plugins: [],
}

export default config;