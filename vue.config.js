const MomentLocalesPlugin = require("moment-locales-webpack-plugin");
const { gitDescribeSync } = require("git-describe");

process.env.VUE_APP_GIT_HASH = gitDescribeSync().hash;

module.exports = {
  transpileDependencies: true,
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
  chainWebpack: (config) => {
    config.resolve.alias.set("vue", "@vue/compat");

    config.module
      .rule("vue")
      .use("vue-loader")
      .tap((options) => {
        return {
          ...options,
          compilerOptions: {
            compatConfig: {
              MODE: 2,
            },
          },
        };
      });
  },
};
