<template>
  <BaseUpdatePage
    page-title="Einsatz bearbeiten"
    :loading="loading"
    :updating="updating"
    @submit="onSubmit"
    @reset="resetItem"
    @delete="del"
  >
    <CalloutForm ref="form" v-bind.sync="item" require-keyword />
  </BaseUpdatePage>
</template>

<script>
import { mapActions, mapState } from "vuex";
import CalloutForm from "../components/form/Form.vue";
import makeUpdateMixin from "@/mixins/UpdateMixin";

export default makeUpdateMixin("Callout", "callouts").extend({
  components: {
    CalloutForm,
  },

  data() {
    return {
      loading: false,

      item: {},
      emptyItem: {
        type: null,
        keyword: null,
        catchphrase: null,
        alarmTime: null,
        address: null,
      },
    };
  },

  computed: {
    ...mapState("callout", ["callout"]),
  },

  methods: {
    ...mapActions("callout", ["bind", "updateCallout", "remove"]),
    validate() {
      return this.$refs.form.$refs.form.validate();
    },

    onSubmit() {
      this.update(this.item);
    },

    retrieveItem() {
      this.loading = true;
      this.bind(this.id)
        .then(() => {
          this.resetItem();
        })
        .finally(() => {
          this.loading = false;
        });
    },
    resetItem() {
      if (this.callout) {
        this.item = Object.assign({}, this.emptyItem, this.callout);
      } else {
        this.item = { ...this.emptyItem };
      }
    },

    update(item) {
      if (this.validate()) {
        this.updating = true;
        this.updateCallout(item)
          .then(() => {
            this.showMessage("Gespeichert");
          })
          .finally(() => {
            this.updating = false;
          });
      }
    },
    del() {
      this.remove().then(() => {
        this.showMessage("Objekt wurde gelöscht.");
        this.$router.back();
      });
    },
  },
});
</script>
