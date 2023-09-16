<template>
  <v-form ref="form">
    <v-row>
      <v-col cols="12">
        <v-checkbox
          v-for="t in availableTypes"
          :key="t"
          :label="t"
          :input-value="type && type[t]"
          dense
          @change="updateType(t, $event)"
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
      availableTypes: ["Brand", "THL", "UG-ÖEL"],

      showAlarmTimeDialog: false,

      ruleSelectionIsNotEmpty: (value) =>
        (value && value.length > 0) || "Bitte wähle mindestens einen Typ aus",
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

    alarmTimeFormatted() {
      return this.alarmTime ? formatDateTime(this.alarmTime) : "";
    },
  },

  methods: {
    updateType(updatedType, value) {
      const newTypes = {
        ...this.type,
        [updatedType]: value === true,
      };
      this.update("type", newTypes);
    },
  },
});
</script>
