import Vue from "vue";
import moment from "moment";

export default Vue.extend({
  data() {
    return {
      rules: {
        required: (value: any) => !!value || "Bitte fülle dieses Feld aus",
        onlyPastAllowed: (value: any) =>
          !value ||
          moment(value).unix() <= moment().unix() ||
          "Zeitpunkt muss in Vergangenheit liegen",

        restrictFuture: (value: any) =>
          !value ||
          moment(value).unix() <= moment().add(1, "day").unix() ||
          "Zeitpunkt darf nicht später als 24 Stunden ab jetzt sein",

        recently: (value: any) => {
          const aDayAgo = moment().subtract(7, "day").unix();
          return (
            moment(value).unix() > aDayAgo ||
            "Zeitpunkt darf nicht länger als 7 Tage her sein"
          );
        },
      },
    };
  },

  computed: {
    today() {
      return moment().format("YYYY-MM-DD");
    },

    tomorrow() {
      return moment().add(1, "day").format("YYYY-MM-DD");
    },
  },

  methods: {
    update(key: string, value: any) {
      this.$emit("update:" + key, value);
    },
  },
});
