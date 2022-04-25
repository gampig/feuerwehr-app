<template>
  <v-dialog :value="value" persistent max-width="900" @input="cancel">
    <v-card>
      <v-card-title>Neue Bestellung</v-card-title>

      <v-divider></v-divider>

      <v-card-text>
        <OrderForm ref="form" v-bind.sync="item" create />
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-btn text @click="cancel"> Abbrechen </v-btn>
        <v-spacer />
        <v-btn :loading="loading" color="primary" text @click="save">
          Speichern
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import OrderForm from "./form/OrderForm.vue";
import moment from "moment";
/* eslint-disable no-unused-vars */
import { Order } from "../models/Order";
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
