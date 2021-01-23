import NotificationMixin from "./NotificationMixin";

export default function (servicePrefix: string, storeName: string) {
  return NotificationMixin.extend({
    data() {
      return {
        creating: false,
      };
    },

    methods: {
      validate(): boolean {
        return true;
      },

      create(item: any) {
        if (this.validate()) {
          this.creating = true;

          this.$store
            .dispatch(`${storeName}/create`, item)
            .then((ref) => {
              this.showMessage("Objekt wurde erstellt.");

              this.$router.replace({
                name: `${servicePrefix}Update`,
                params: { id: ref.key },
              });
            })
            .finally(() => {
              this.creating = false;
            });
        }
      },
    },
  });
}
