import NotificationMixin from "./NotificationMixin";

export default function (servicePrefix: string, storeName: string) {
  return NotificationMixin.extend({
    data() {
      return {
        updating: false,
      };
    },

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
      validate(): boolean {
        return true;
      },

      update(item: any) {
        if (this.validate()) {
          this.updating = true;

          this.$store
            .dispatch(`${storeName}/update`, item)
            .then(() => {
              this.showMessage("Gespeichert");
            })
            .finally(() => {
              this.updating = false;
            });
        }
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
