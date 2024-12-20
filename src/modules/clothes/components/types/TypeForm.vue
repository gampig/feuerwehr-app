<template>
  <v-form ref="form">
    <v-row class="mb-0">
      <v-col sm="8" cols="12">
        <v-text-field
          label="Bezeichnung"
          append-icon="mdi-form-textbox"
          :model-value="name"
          :rules="[rules.required]"
          @update:model-value="update('name', $event)"
        />
      </v-col>

      <v-col sm="4" cols="12">
        <v-select
          label="Kategorie"
          append-icon="mdi-clipboard-list"
          :items="categories"
          :model-value="category"
          :rules="[rules.required]"
          @update:model-value="update('category', $event)"
        />
      </v-col>

      <v-col sm="8" cols="12">
        <v-combobox
          label="Größen"
          append-icon="mdi-ruler"
          :model-value="sizes"
          chips
          closable-chips
          multiple
          @update:model-value="update('sizes', $event)"
        />
      </v-col>

      <v-col sm="4" cols="12">
        <v-text-field
          label="Preis"
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
          @update:model-value="update('isAvailable', $event)"
        />
      </v-col>
    </v-row>
  </v-form>
</template>

<script lang="ts">
import FormMixin from "@/mixins/FormMixin";
/* eslint-disable no-unused-vars */
import { PropType } from "vue";
import {
  ALL_CLOTHING_TYPE_CATEGORIES,
  ClothingTypeCategory,
} from "../../models/ClothingType";
/* eslint-enable */

export default FormMixin.extend({
  props: {
    category: {
      type: String as PropType<ClothingTypeCategory>,
    },
    name: {
      type: String,
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

  data() {
    return {
      categories: ALL_CLOTHING_TYPE_CATEGORIES,
    };
  },

  methods: {
    updatePrice(price: any) {
      this.update("price", Number(price));
    },
  },
});
</script>
