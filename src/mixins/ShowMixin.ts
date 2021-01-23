import NotificationMixin from "./NotificationMixin";

export default function (servicePrefix: string, storeName: string) {
  return NotificationMixin.extend({
    watch: {
      id() {
        this.retrieveItem();
      },
    },

    mounted() {
      this.retrieveItem();
    },

    computed: {
      id() {
        return this.$route.params.id;
      },
    },

    methods: {
      retrieveItem(): any {
        return {};
      },

      del() {
        this.$store.dispatch(`${storeName}/remove`, this.id).then(() => {
          this.showMessage("Objekt wurde gelöscht.");
          this.$router.back();
        });
      },
    },
  });
}
