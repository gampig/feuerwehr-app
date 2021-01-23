<template>
  <v-form ref="form">
    <v-row class="mb-0">
      <v-col sm="6" cols="12">
        <v-select
          label="Typ"
          :value="typeArray"
          @input="updateType"
          :items="typeSelectItems"
          :rules="(requireKeyword && [rules.required]) || []"
          multiple
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col sm="6" cols="12">
        <v-combobox
          label="Stichwort"
          :items="keywords"
          :value="keyword"
          @input="$emit('update:keyword', $event)"
          :rules="(requireKeyword && [rules.required]) || []"
        />
      </v-col>
      <v-col sm="6" cols="12">
        <v-combobox
          label="Schlagwort"
          :items="catchphrases"
          :value="catchphrase"
          @input="$emit('update:catchphrase', $event)"
        />
      </v-col>
    </v-row>

    <DateTimeFields
      label="Alarm"
      prepend-icon="mdi-alarm-light-outline"
      :value="alarmTime"
      @input="update('alarmTime', $event)"
      :max-date="today"
      :rules-date="[rules.required, rules.onlyPastAllowed, rules.recently]"
      :rules-time="[rules.required]"
    />

    <v-row>
      <v-col cols="12">
        <v-text-field
          label="Adresse"
          prepend-icon="mdi-map-marker-outline"
          :value="address"
          @input="$emit('update:address', $event)"
        />
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
import FormMixin from "@/mixins/FormMixin";
import DateTimeFields from "@/components/DateTimeFields";
import keywordsMap from "@/assets/keywords.json";

export default FormMixin.extend({
  components: {
    DateTimeFields,
  },

  props: {
    type: null,
    keyword: null,
    catchphrase: null,
    alarmTime: null,
    address: null,

    requireKeyword: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      typeSelectItems: ["Brand", "THL", "UG-ÖEL"],
    };
  },

  computed: {
    keywords() {
      return Object.keys(keywordsMap).sort();
    },
    catchphrases() {
      return (
        (keywordsMap[this.keyword] && keywordsMap[this.keyword].sort()) || []
      );
    },

    typeArray() {
      return (
        this.type != null &&
        Object.entries(this.type)
          .filter((type) => type[1] === true)
          .map((type) => type[0])
      );
    },
  },

  methods: {
    updateType(event) {
      const types = Object.fromEntries(event.map((type) => [type, true]));
      this.update("type", types);
    },
  },
});
</script>
