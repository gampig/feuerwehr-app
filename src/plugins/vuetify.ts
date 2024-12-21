import "@fontsource/roboto";
import "@mdi/font/css/materialdesignicons.css";
import { createVuetify } from "vuetify";
import "vuetify/styles";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import { de } from "vuetify/locale";

const mq = window.window.matchMedia("(prefers-color-scheme: dark)");

export const vuetify = createVuetify({
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: { mdi },
  },
  locale: {
    locale: "de",
    fallback: "de",
    messages: { de },
  },
  theme: {
    defaultTheme: mq.matches ? "dark" : "light",
    themes: {
      light: {
        dark: false,
        colors: {
          primary: "#f44336",
          secondary: "#607d8b",
          accent: "#3f51b5",
        },
      },
      dark: {
        dark: true,
        colors: {
          primary: "#b71c1c",
        },
      },
    },
  },
});

mq.addEventListener("change", (e) => {
  vuetify.theme.global.name.value = e.matches ? "dark" : "light";
});
