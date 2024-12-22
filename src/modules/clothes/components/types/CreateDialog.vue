<template>
  <BaseCreateDialog
    :model-value="value"
    max-width="900"
    :loading="loading"
    title="Neues Kleidungsstück"
    @update:model-value="cancel"
    @create="save"
  >
    <TypeForm
      ref="form"
      v-model:category="item.category"
      v-model:name="item.name"
      v-model:price="item.price"
      v-model:is-available="item.isAvailable"
      v-model:sizes="item.sizes"
    />
  </BaseCreateDialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import TypeForm from "./TypeForm.vue";
import { ClothingType } from "../../models/ClothingType";

export default defineComponent({
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
      this.item.isAvailable = true;
    },

    closeDialog() {
      this.reset();
      this.$emit("update:model-value", false);
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
