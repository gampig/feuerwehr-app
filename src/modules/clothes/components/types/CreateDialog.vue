<template>
  <BaseCreateDialog
    :value="value"
    max-width="900"
    :loading="loading"
    title="Neues Kleidungsstück"
    @input="cancel"
    @create="save"
  >
    <TypeForm ref="form" v-bind.sync="item" create />
  </BaseCreateDialog>
</template>

<script lang="ts">
import Vue from "vue";
import TypeForm from "./TypeForm.vue";
/* eslint-disable no-unused-vars */
import { ClothingType } from "../../models/ClothingType";
/* eslint-enable */

export default Vue.extend({
  components: {
    TypeForm,
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
        category: undefined,
        name: undefined,
        price: undefined,
        isAvailable: true,
        sizes: undefined,
      } as Partial<ClothingType>,
    };
  },

  methods: {
    validate() {
      return (this.$refs?.form as any)?.$refs?.form?.validate();
    },

    reset() {
      (this.$refs?.form as any)?.$refs?.form?.reset();
      this.$set(this.item, "isAvailable", true);
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

      if (this.validate()) {
        this.loading = true;

        this.$store
          .dispatch("clothingTypes/create", item)
          .then(() => {
            this.$showMessage("Kleidungsstück wurde erstellt.");
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },
  },
});
</script>
