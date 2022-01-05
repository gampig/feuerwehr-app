<template>
  <v-form ref="form">
    <v-row class="mb-0">
      <v-col cols="12">
        <v-autocomplete
          label="Person"
          prepend-icon="mdi-account"
          :items="people"
          item-text="id"
          :value="person"
          :loading="loadingPeople"
          single-line
          :rules="[rules.required]"
          @input="update('person', $event)"
        />
      </v-col>
      <v-col cols="12">
        <v-autocomplete
          label="Kleidungsstück"
          prepend-icon="mdi-tshirt-crew"
          :items="types"
          :item-text="getTypeText"
          item-value="id"
          :value="clothingType"
          :loading="loadingTypes"
          single-line
          :rules="[rules.required]"
          @input="update('clothingType', $event)"
        />
      </v-col>
    </v-row>

    <v-row v-if="clothingType">
      <v-col sm="6" cols="12">
        <v-combobox
          label="Größe"
          prepend-icon="mdi-ruler"
          :items="sizes"
          :value="size"
          @input="update('size', $event)"
        />
      </v-col>
      <v-col sm="6" cols="12">
        <v-text-field
          label="Anzahl"
          type="number"
          prepend-icon="mdi-cart-variant"
          :value="count"
          :rules="[rules.required]"
          @input="update('count', $event)"
        />
      </v-col>
    </v-row>

    <template v-if="!create">
      <v-divider></v-divider>

      <v-row>
        <v-col cols="6">
          <v-text-field
            label="Bezahlt"
            type="number"
            min="0"
            suffix="€"
            prepend-icon="mdi-cash"
            :error="totalPrice > 0 && paid != totalPrice"
            :value="paid"
            @input="update('paid', $event)"
          />
        </v-col>

        <v-col cols="6">
          <v-text-field
            label="Gesamtkosten"
            :value="totalPrice + ' €'"
            disabled
          />
        </v-col>

        <v-col v-if="submittedOn" cols="12">
          <v-checkbox
            :label="makeLabelWithDate('Eingereicht', submittedOn)"
            input-value="true"
            disabled
          />
        </v-col>

        <v-col cols="12">
          <v-checkbox
            :label="makeLabelWithDate('Bestellt', orderedOn)"
            :input-value="orderedOn"
            @change="updateCheckbox('orderedOn', $event)"
          />
        </v-col>

        <v-col cols="12">
          <v-checkbox
            :label="makeLabelWithDate('Erledigt', doneOn)"
            :input-value="doneOn"
            @change="updateCheckbox('doneOn', $event)"
          />
        </v-col>
      </v-row>
    </template>
  </v-form>
</template>

<script>
import FormMixin from "@/mixins/FormMixin";
import { mapState } from "vuex";
import moment from "moment";

export default FormMixin.extend({
  props: {
    create: {
      type: Boolean,
      default: false,
    },

    person: null,
    clothingType: null,
    size: null,
    count: null,
    paid: null,
    submittedOn: null,
    orderedOn: null,
    doneOn: null,
  },

  computed: {
    ...mapState("people", { loadingPeople: "loading", people: "people" }),
    ...mapState("clothingTypes", { loadingTypes: "loading", types: "types" }),

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
      if (type.manufacturer) {
        text += type.manufacturer + ": ";
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

    updateCheckbox(name, checked) {
      let value = null;

      if (checked) {
        value = moment().unix();
      }

      this.update(name, value);
    },
  },
});
</script>
