export default {
    mode: "universal",
    server: {
        port: 3999 // default: 3000
    },
    head: {
        title: process.env.npm_package_name || "",
        meta: [
            { charset: "utf-8" },
            {
                name: "viewport",
                content: "width=device-width, initial-scale=1"
            },
            {
                hid: "description",
                name: "description",
                content: process.env.npm_package_description || ""
            }
        ],
        link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
    },
    loading: { color: "#fff" },
    css: [
        'vue-multiselect/dist/vue-multiselect.min.css',
        {
            src: '@assets/scss/bootstrap.scss',
            lang: 'scss'
        }
    ],
    plugins: [
        '~/node_modules/svgxuse/svgxuse.js',
        '@plugins/icons.js',
        '@plugins/vue-js-modal.js',
    ],
    buildModules: [],
    modules: [
        "@nuxtjs/axios",
        "@nuxtjs/style-resources",
    ],
    styleResources: {
        scss: [
            '@assets/scss/_functions.scss',
            '@assets/scss/_variables.scss',
        ]
    },
    axios: {
        proxy: true,
    },
    proxy: {
        '/api': {
            target: 'http://api.holypony.ru/',
            pathRewrite: { '^/api/': '' }
        }
    },
    build: {
        extend(config, ctx) {}
    }
};
