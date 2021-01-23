import { mapState } from "vuex";
import moment from "moment";
import NotificationMixin from "./NotificationMixin";

export default function (servicePrefix: string, storeName: string) {
  return NotificationMixin.extend({
    computed: {
      ...mapState(storeName, ["loading"]),
    },

    methods: {
      addHandler() {
        this.$router.push({ name: `${servicePrefix}Create` });
      },
      showHandler(item: any) {
        this.$router.push({
          name: `${servicePrefix}Show`,
          params: { id: item.id },
        });
      },
      editHandler(item: any) {
        this.$router.push({
          name: `${servicePrefix}Update`,
          params: { id: item.id },
        });
      },
      deleteHandler(item: any) {
        this.$store
          .dispatch(`${storeName}/remove`, item.id)
          .then(() => this.showMessage("Objekt wurde gelöscht."));
      },

      filterList(list: Array<any>, search: string) {
        if (search) {
          const searchLowerCase = search.toLowerCase();
          return list.filter((item) =>
            Object.values(item).some((value) =>
              String(value).toLowerCase().includes(searchLowerCase)
            )
          );
        } else {
          return list;
        }
      },

      sortDateTime(a: any, b: any) {
        const diff = moment(a, "L LT").diff(moment(b, "L LT"));
        if (diff > 0) return 1;
        else if (diff < 0) return -1;
        else return 0;
      },
      sortDate(a: any, b: any) {
        const diff = moment(a, "L").diff(moment(b, "L"));
        if (diff > 0) return 1;
        else if (diff < 0) return -1;
        else return 0;
      },
    },
  });
}
