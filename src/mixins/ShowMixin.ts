import Vue from "vue";

export default function (servicePrefix: string, storeName: string) {
  return Vue.extend({
    computed: {
      id() {
        return this.$route.params.id;
      },
    },

    watch: {
      id() {
        this.retrieveItem();
      },
    },

    mounted() {
      this.retrieveItem();
    },

    methods: {
      retrieveItem(): any {
        return {};
      },

      del() {
        this.$store.dispatch(`${storeName}/remove`, this.id).then(() => {
          this.$showMessage("Objekt wurde gelöscht.");
          this.$router.back();
        });
      },
    },
  });
}
