<template>
  <v-form ref="form">
    <v-row class="mb-0">
      <v-col sm="8" cols="12">
        <v-text-field
          label="Bezeichnung"
          prepend-icon="mdi-form-textbox"
          :model-value="name"
          :rules="[rules.required]"
          @update:model-value="$emit('update:name', $event)"
        />
      </v-col>

      <v-col sm="4" cols="12">
        <v-select
          label="Kategorie"
          prepend-icon="mdi-clipboard-list"
          :items="categories"
          :model-value="category"
          :rules="[rules.required]"
          @update:model-value="$emit('update:category', $event)"
        />
      </v-col>

      <v-col sm="8" cols="12">
        <v-combobox
          label="Größen"
          prepend-icon="mdi-ruler"
          :model-value="sizes"
          chips
          closable-chips
          multiple
          @update:model-value="$emit('update:sizes', $event)"
        />
      </v-col>

      <v-col sm="4" cols="12">
        <v-text-field
          label="Preis"
          prepend-icon="mdi-cash"
          type="number"
          min="0"
          suffix="€"
          :model-value="price"
          @update:model-value="updatePrice($event)"
        />
      </v-col>

      <v-col cols="12">
        <v-checkbox
          label="Ist noch erhältlich"
          :model-value="isAvailable"
          @update:model-value="$emit('update:isAvailable', $event)"
        />
      </v-col>
    </v-row>
  </v-form>
</template>

<script lang="ts">
import { PropType, defineComponent } from "vue";
import { required } from "@/utils/rules";
import {
  ALL_CLOTHING_TYPE_CATEGORIES,
  ClothingTypeCategory,
} from "../../models/ClothingType";

export default defineComponent({
  props: {
    category: {
      type: String as PropType<ClothingTypeCategory>,
      default: undefined,
    },

    name: {
      type: String,
      default: undefined,
    },

    price: {
      type: Number,
      default: 0,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    sizes: {
      type: Array as PropType<Array<string | number>>,
      default: () => [],
    },
  },

  emits: [
    "update:price",
    "update:name",
    "update:category",
    "update:sizes",
    "update:isAvailable",
  ],

  data() {
    return {
      rules: {
        required,
      },

      categories: ALL_CLOTHING_TYPE_CATEGORIES,
    };
  },

  methods: {
    updatePrice(price: any) {
      this.$emit("update:price", Number(price));
    },
  },
});
</script>
