<template>
  <v-dialog :value="value" persistent max-width="900" @input="cancel">
    <v-card :loading="loading">
      <v-card-title>Bestellung bearbeiten</v-card-title>

      <v-divider></v-divider>

      <v-card-text>
        <OrderForm ref="form" v-bind.sync="item" />
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-btn text @click="cancel"> Abbrechen </v-btn>
        <v-spacer />
        <v-btn :loading="saving" color="primary" text @click="save">
          Speichern
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import OrderForm from "./form/OrderForm.vue";
import { mapState } from "vuex";
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
