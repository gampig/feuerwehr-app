<template>
  <BaseCreateDialog
    :value="value"
    max-width="900"
    :loading="loading"
    title="Neue Bestellung"
    @input="cancel"
    @create="save"
  >
    <OrderForm ref="form" v-bind.sync="item" create />
  </BaseCreateDialog>
</template>

<script lang="ts">
import Vue from "vue";
import OrderForm from "./OrderForm.vue";
import moment from "moment";
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
      loading: false,

      item: {
        person: undefined,
        clothingType: undefined,
        size: undefined,
        count: 1,
        paid: undefined,
        submittedOn: undefined,
        orderedOn: undefined,
        doneOn: undefined,
      } as Partial<Order>,
    };
  },

  methods: {
    validate() {
      return (this.$refs?.form as any)?.$refs?.form?.validate();
    },

    reset() {
      (this.$refs?.form as any)?.$refs?.form?.reset();
    },

    closeDialog() {
      this.reset();
      this.$emit("input", false);
    },

    cancel() {
      this.closeDialog();
    },

    save() {
      const item = { ...this.item };
      item.submittedOn = moment().unix();

      if (this.validate()) {
        this.loading = true;

        this.$store
          .dispatch("orders/create", item)
          .then(() => {
            this.$showMessage("Bestellung wurde erstellt.");
            this.closeDialog();
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },
  },
});
</script>
