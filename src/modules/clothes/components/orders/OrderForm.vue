<template>
  <v-form ref="form">
    <v-row class="mb-0">
      <v-col cols="12">
        <v-autocomplete
          label="Person"
          prepend-icon="mdi-account"
          :items="people"
          item-title="id"
          :model-value="person"
          :loading="loadingPeople"
          :rules="[rules.required]"
          @update:model-value="$emit('update:person', $event)"
        />
      </v-col>
      <v-col cols="12">
        <v-autocomplete
          label="Kleidungsstück"
          prepend-icon="mdi-tshirt-crew"
          :items="types"
          :item-title="getTypeText"
          item-value="id"
          :model-value="clothingType"
          :loading="loadingTypes"
          :rules="[rules.required]"
          @update:model-value="$emit('update:clothingType', $event)"
        />
      </v-col>
    </v-row>

    <v-row v-if="clothingType">
      <v-col sm="6" cols="12">
        <v-combobox
          label="Größe"
          prepend-icon="mdi-ruler"
          :items="sizes"
          :model-value="size"
          @update:model-value="$emit('update:size', $event)"
        />
      </v-col>
      <v-col sm="6" cols="12">
        <v-text-field
          label="Anzahl"
          type="number"
          prepend-icon="mdi-cart-variant"
          :model-value="count"
          :rules="[rules.required]"
          @update:model-value="$emit('update:count', Number($event))"
        />
      </v-col>
    </v-row>

    <v-row>
      <template v-if="totalPrice > 0">
        <v-col cols="6">
          <v-text-field
            label="Bezahlt"
            type="number"
            min="0"
            suffix="€"
            prepend-icon="mdi-cash"
            :error="totalPrice > 0 && paid != totalPrice"
            :model-value="paid"
            @update:model-value="$emit('update:paid', $event)"
          />
        </v-col>

        <v-col cols="6">
          <v-text-field
            label="Gesamtkosten"
            :model-value="totalPrice + ' €'"
            prepend-icon="mdi-cash"
            disabled
          />
        </v-col>
      </template>

      <v-col cols="12">
        <v-checkbox
          :label="makeLabelWithDate('Eingereicht', submittedOn)"
          :model-value="true"
          disabled
        />

        <v-checkbox
          :label="makeLabelWithDate('Bestellt', orderedOn)"
          :model-value="!!orderedOn"
          @update:model-value="updateOrderedOn"
        />

        <v-checkbox
          :label="makeLabelWithDate('Erledigt', doneOn)"
          :model-value="!!doneOn"
          @update:model-value="updateDoneOn"
        />
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
import { mapState as vuexMapState } from "vuex";
import { mapState as piniaMapState } from "pinia";
import moment from "moment";
import { usePeopleStore } from "@/modules/people/stores/people";
import { defineComponent } from "vue";
import { required } from "@/utils/rules";

export default defineComponent({
  props: {
    person: {
      type: String,
      default: undefined,
    },

    clothingType: {
      type: String,
      default: undefined,
    },

    size: {
      type: String,
      default: undefined,
    },

    count: { type: Number, default: undefined },

    paid: { type: Number, default: undefined },

    submittedOn: { type: Number, default: undefined },
    orderedOn: { type: Number, default: undefined },
    doneOn: { type: Number, default: undefined },
  },

  emits: [
    "update:name",
    "update:person",
    "update:clothingType",
    "update:size",
    "update:count",
    "update:paid",
    "update:orderedOn",
    "update:doneOn",
  ],

  data() {
    return {
      rules: {
        required,
      },
    };
  },

  computed: {
    ...piniaMapState(usePeopleStore, {
      loadingPeople: "loading",
      people: "people",
    }),

    ...vuexMapState("clothingTypes", {
      loadingTypes: "loading",
      types: "types",
    }),

    clothingTypeObject() {
      return (
        this.clothingType &&
        this.types.find((item) => item.id == this.clothingType)
      );
    },

    sizes() {
      return (this.clothingTypeObject && this.clothingTypeObject.sizes) || [];
    },

    totalPrice() {
      if (
        !this.clothingTypeObject ||
        !this.clothingTypeObject.price ||
        this.clothingTypeObject.price == 0
      ) {
        return 0;
      }

      const count = this.count ? this.count : 1;
      return this.clothingTypeObject.price * count;
    },
  },

  methods: {
    getTypeText(type) {
      let text = "";

      if (type.category) {
        text += `(${type.category}) `;
      }
      text += type.name;

      return text;
    },

    makeLabelWithDate(text, timestamp) {
      if (timestamp) {
        return text + " (am " + this.getDate(timestamp) + ")";
      } else {
        return text;
      }
    },

    getDate(timestamp) {
      return moment.unix(timestamp).format("L");
    },

    updateOrderedOn(checked) {
      this.$emit("update:orderedOn", this.getTimestampForCheckbox(checked));
    },

    updateDoneOn(checked) {
      this.$emit("update:doneOn", this.getTimestampForCheckbox(checked));
    },

    getTimestampForCheckbox(checked) {
      return checked ? moment().unix() : null;
    },
  },
});
</script>
