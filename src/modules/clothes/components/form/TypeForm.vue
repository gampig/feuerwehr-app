<template>
  <v-form ref="form">
    <v-row class="mb-0">
      <v-col sm="6" md="4" cols="12">
        <v-text-field
          label="Hersteller"
          append-icon="mdi-factory"
          :value="manufacturer"
          @input="update('manufacturer', $event)"
        />
      </v-col>

      <v-col sm="6" md="4" cols="12">
        <v-text-field
          label="Bezeichnung"
          append-icon="mdi-form-textbox"
          :value="name"
          :rules="[rules.required]"
          @input="update('name', $event)"
        />
      </v-col>

      <v-col sm="6" md="4" cols="12">
        <v-select
          label="Kategorie"
          append-icon="mdi-clipboard-list"
          :items="categories"
          :value="category"
          :rules="[rules.required]"
          @input="update('category', $event)"
        />
      </v-col>

      <v-col sm="6" md="4" cols="12">
        <v-text-field
          label="Preis"
          type="number"
          min="0"
          suffix="€"
          :value="price"
          @input="update('price', $event)"
        />
      </v-col>

      <v-col md="8" cols="12">
        <v-combobox
          label="Größen"
          append-icon="mdi-ruler"
          :value="sizes"
          chips
          small-chips
          deletable-chips
          multiple
          @input="update('sizes', $event)"
        />
      </v-col>

      <v-col sm="6" md="4" cols="12">
        <v-checkbox
          label="Ist noch erhältlich"
          :input-value="isAvailable"
          @change="update('isAvailable', $event)"
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
    manufacturer: {
      type: String,
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
});
</script>
