<template>
  <BaseEditDialog
    :value="value"
    max-width="900"
    title="Bestellung bearbeiten"
    :loading="loading"
    :saving="saving"
    @input="cancel"
    @save="save"
  >
    <OrderForm ref="form" v-bind.sync="item" />
  </BaseEditDialog>
</template>

<script lang="ts">
import Vue from "vue";
import OrderForm from "./OrderForm.vue";
import { mapState } from "vuex";
/* eslint-disable no-unused-vars */
import { Order } from "../../models/Order";
/* eslint-enable */

export default Vue.extend({
  components: {
    OrderForm,
  },

  props: {
    value: {
      type: Boolean,
    },
  },

  data() {
    return {
      saving: false,

      item: {} as Partial<Order>,
      emptyItem: {
        person: undefined,
        clothingType: undefined,
        size: undefined,
        count: undefined,
        paid: undefined,
        submittedOn: undefined,
        orderedOn: undefined,
        doneOn: undefined,
      } as Partial<Order>,
    };
  },

  computed: {
    ...mapState("orders", { order: "order", loading: "loadingOrder" }),
  },

  watch: {
    loading(loading) {
      if (!loading) {
        this.reset();
      }
    },
  },

  methods: {
    validate() {
      return (this.$refs?.form as any)?.$refs?.form?.validate();
    },

    reset() {
      if (this.order) {
        this.item = Object.assign({}, this.emptyItem, this.order);
      } else {
        this.item = { ...this.emptyItem };
      }
    },

    closeDialog() {
      this.reset();
      this.$emit("input", false);
    },

    cancel() {
      this.closeDialog();
    },

    save() {
      if (this.validate()) {
        this.saving = true;

        this.$store
          .dispatch("orders/set", this.item)
          .then(() => {
            this.$showMessage("Gespeichert");
            this.closeDialog();
          })
          .finally(() => {
            this.saving = false;
          });
      }
    },
  },
});
</script>
