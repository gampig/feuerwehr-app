const MomentLocalesPlugin = require("moment-locales-webpack-plugin");

module.exports = {
  transpileDependencies: ["vuetify"],
  pwa: {
    name: process.env.VUE_APP_TITLE,
    themeColor: "#ba000d",
    iconPaths: {
      maskIcon: null,
    },
    manifestOptions: {
      background_color: "#ffffff",
      icons: [
        {
          src: "./img/icons/192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "./img/icons/512.png",
          sizes: "512x512",
          type: "image/png",
        },
        {
          src: "./img/icons/maskable-192.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "maskable",
        },
        {
          src: "./img/icons/maskable-512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable",
        },
      ],
    },
  },
  configureWebpack: {
    devtool: "source-map",
    plugins: [
      new MomentLocalesPlugin({
        localesToKeep: ["de"],
      }),
    ],
  },
};
