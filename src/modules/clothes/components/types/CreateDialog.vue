<template>
  <BaseCreateDialog
    :model-value="modelValue"
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
import { VForm } from "vuetify/components";
import { useClothingTypesStore } from "../../stores/clothingTypes";

export default defineComponent({
  components: {
    TypeForm,
  },

  props: {
    modelValue: {
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
    async validate() {
      const form = (this.$refs?.form as any)?.$refs?.form as VForm | undefined;
      return form ? (await form.validate()).valid : false;
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

    async save() {
      const item: ClothingType = { name: "", ...this.item };

      if (await this.validate()) {
        this.loading = true;

        useClothingTypesStore()
          .create(item)
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
