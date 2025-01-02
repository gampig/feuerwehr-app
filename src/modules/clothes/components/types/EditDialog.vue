<template>
  <BaseEditDialog
    :model-value="modelValue"
    max-width="900"
    :title="(clothingType && clothingType.name) || 'Kleidungsstück bearbeiten'"
    :loading="loading"
    :saving="saving"
    @update:model-value="cancel"
    @save="save"
  >
    <v-container fluid>
      <TypeForm
        ref="form"
        v-model:category="item.category"
        v-model:name="item.name"
        v-model:price="item.price"
        v-model:is-available="item.isAvailable"
        v-model:sizes="item.sizes"
      />
    </v-container>
  </BaseEditDialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import TypeForm from "./TypeForm.vue";
import { VForm } from "vuetify/components";
import { ClothingType } from "../../models/ClothingType";
import { mapState } from "pinia";
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

  emits: ["update:model-value"],

  data() {
    return {
      saving: false,

      item: {} as Partial<ClothingType>,
      emptyItem: {
        category: undefined,
        name: undefined,
        price: undefined,
        isAvailable: undefined,
        sizes: undefined,
      } as Partial<ClothingType>,
    };
  },

  computed: {
    ...mapState(useClothingTypesStore, {
      clothingType: "selectedType",
      loading: "selectedTypeLoading",
    }),
  },

  watch: {
    loading(loading) {
      if (!loading) {
        this.reset();
      }
    },

    modelValue(modelValue) {
      if (modelValue) {
        this.reset();
      }
    },
  },

  methods: {
    async validate() {
      const form = (this.$refs?.form as any)?.$refs?.form as VForm | undefined;
      return form ? (await form.validate()).valid : false;
    },

    reset() {
      if (this.clothingType) {
        this.item = Object.assign({}, this.emptyItem, this.clothingType);
      } else {
        this.item = { ...this.emptyItem };
      }
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
        this.saving = true;

        useClothingTypesStore()
          .set(item)
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
