import "@fontsource/roboto";
import "@mdi/font/css/materialdesignicons.css";
import Vue from "vue";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);

import de from "vuetify/src/locale/de";

export const vuetify = new Vuetify({
  icons: {
    iconfont: "mdi",
  },
  lang: {
    locales: { de },
    current: "de",
  },
  theme: {
    themes: {
      light: {
        primary: "#f44336",
        secondary: "#607d8b",
        accent: "#3f51b5",
      },
      dark: {
        primary: "#b71c1c",
      },
    },
  },
});
