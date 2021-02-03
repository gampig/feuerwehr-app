<template>
  <v-form ref="form">
    <v-row class="mb-0">
      <v-col sm="6" cols="12">
        <v-select
          label="Typ"
          :value="typeArray"
          :items="typeSelectItems"
          :rules="(requireKeyword && [rules.required]) || []"
          multiple
          @input="updateType"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col sm="6" cols="12">
        <v-combobox
          label="Stichwort"
          :items="keywords"
          :value="keyword"
          :rules="(requireKeyword && [rules.required]) || []"
          @input="$emit('update:keyword', $event)"
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

    <v-row>
      <v-col cols="12">
        <v-text-field
          label="Alarm"
          prepend-icon="mdi-alarm-light-outline"
          :value="alarmTimeFormatted"
          :rules="[rules.required, rules.onlyPastAllowed, rules.recently]"
          readonly
          @click="showAlarmTimeDialog = true"
        />
      </v-col>
    </v-row>

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

    <BaseDateTimeDialog
      v-model="showAlarmTimeDialog"
      :max-date="today"
      :min-date="aWeekAgo"
      :date="alarmTime"
      @update:date="$emit('update:alarmTime', $event)"
    />
  </v-form>
</template>

<script>
import FormMixin from "@/mixins/FormMixin";
import keywordsMap from "@/assets/keywords.json";
import { formatDateTime } from "@/utils/dates";

export default FormMixin.extend({
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

      showAlarmTimeDialog: false,
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

    alarmTimeFormatted() {
      return this.alarmTime ? formatDateTime(this.alarmTime) : "";
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
