// https://nuxt.com/docs/api/configuration/nuxt-config
import eslintPlugin from 'vite-plugin-eslint';
export default defineNuxtConfig({
    ssr: false,
    vite: {
        plugins: [
            eslintPlugin()
        ]
    },
    css: ['~/assets/css/main.css'],
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },
    modules: [
        '@kevinmarrec/nuxt-pwa'
    ],
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    pwa: {
        meta: {
            name: 'Learn Letters',
            author: 'Nemanja Dragun',
            lang: 'en',
            theme_color: 'white'
        },
        manifest: {
            name: 'Learn Letters',
            short_name: 'learn_letters',
            theme_color: 'white'
        },
        icon: {
            fileName: 'logo.svg'
        },
    }
})
